import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import * as cheerio from "cheerio";
import { decode } from "html-entities";
import sharp from "sharp";

type Product = {
  slug: string;
  images: string[];
  [key: string]: unknown;
};

type ImageCandidate = {
  key: string;
  order: number;
  score: number;
  url: string;
};

const DOMAIN = "https://userivano.com.br";
const USER_AGENT = "Rivano-Site-Migration/1.0";
const PRODUCTS_PATH = path.join(process.cwd(), "src", "data", "products.json");
const PUBLIC_PRODUCTS_DIR = path.join(process.cwd(), "public", "products");
const OUTPUT_SIZES = [600, 1200, 2000] as const;

async function main() {
  const products = await readProducts();

  for (const [index, product] of products.entries()) {
    await processProduct(product, index + 1, products.length);
    await writeProducts(products);

    if (index < products.length - 1) {
      await sleep(500);
    }
  }
}

async function readProducts(): Promise<Product[]> {
  const raw = await readFile(PRODUCTS_PATH, "utf8").catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") {
      throw new Error(`products.json não encontrado em ${PRODUCTS_PATH}. Rode npm run import primeiro.`);
    }

    throw error;
  });
  const parsed = JSON.parse(raw) as unknown;

  if (!Array.isArray(parsed)) {
    throw new Error("src/data/products.json deve conter um array de produtos.");
  }

  return parsed as Product[];
}

async function writeProducts(products: Product[]) {
  await writeFile(PRODUCTS_PATH, `${JSON.stringify(products, null, 2)}\n`, "utf8");
}

async function processProduct(product: Product, index: number, total: number) {
  const pageUrl = `${DOMAIN}/products/${encodeURIComponent(product.slug)}`;

  try {
    const html = await fetchText(pageUrl);
    const imageUrls = extractImageUrls(html);
    console.log(`produto ${index}/${total} (${product.slug}): ${imageUrls.length} imagens encontradas`);

    if (imageUrls.length === 0) {
      product.images = [];
      return;
    }

    product.images = await downloadAndOptimizeImages(product.slug, imageUrls);
  } catch (error) {
    console.error(`produto ${index}/${total} (${product.slug}): falha - ${formatError(error)}`);
  }
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      accept: "text/html,application/xhtml+xml",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ao buscar ${url}`);
  }

  return response.text();
}

function extractImageUrls(html: string): string[] {
  const $ = cheerio.load(html);

  // Estratégia 1: JSON-LD (application/ld+json) — fonte mais confiável
  const jsonLdUrls = extractFromJsonLd($);
  if (jsonLdUrls.length > 0) {
    return jsonLdUrls;
  }

  // Estratégia 2: img/source tags na galeria ou página inteira
  const scopedMedia = getGalleryMedia($);
  const media = scopedMedia.length > 0 ? scopedMedia : $("img, source");
  const candidates = new Map<string, ImageCandidate>();
  let order = 0;

  media.each((_, element) => {
    for (const attribute of ["src", "data-src", "data-original", "data-lazy", "srcset", "data-srcset"]) {
      const value = $(element).attr(attribute);

      if (!value) {
        continue;
      }

      const values = attribute.includes("srcset") ? parseSrcset(value) : [{ url: value, descriptor: "" }];

      for (const candidate of values) {
        const absoluteUrl = toAbsoluteCdnUrl(candidate.url);

        if (!absoluteUrl) {
          continue;
        }

        const imageCandidate = buildCandidate(absoluteUrl, candidate.descriptor, order++);
        const current = candidates.get(imageCandidate.key);

        if (!current || imageCandidate.score > current.score) {
          candidates.set(imageCandidate.key, {
            ...imageCandidate,
            order: current?.order ?? imageCandidate.order,
          });
        }
      }
    }
  });

  return Array.from(candidates.values())
    .sort((a, b) => a.order - b.order)
    .map((candidate) => candidate.url);
}

function extractFromJsonLd($: cheerio.CheerioAPI): string[] {
  const urls: string[] = [];

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html() ?? "") as Record<string, unknown>;
      if (data["@type"] !== "Product") return;

      const images = data["image"];
      if (Array.isArray(images)) {
        for (const img of images) {
          if (typeof img === "string" && isCdnUrl(img)) {
            urls.push(img);
          }
        }
      } else if (typeof images === "string" && isCdnUrl(images)) {
        urls.push(images);
      }
    } catch {
      // JSON inválido — ignorar
    }
  });

  return urls;
}

function getGalleryMedia($: cheerio.CheerioAPI): cheerio.Cheerio<any> {
  const scopes = $(
    [
      "[class*='gallery']",
      "[id*='gallery']",
      "[class*='carousel']",
      "[class*='slider']",
      "[class*='product']",
      "[id*='product']",
      "[data-store*='product']",
    ].join(","),
  );

  return scopes.find("img, source").add(scopes.filter("img, source"));
}

function parseSrcset(value: string): Array<{ url: string; descriptor: string }> {
  return decode(value)
    .split(",")
    .map((part) => {
      const [url = "", descriptor = ""] = part.trim().split(/\s+/, 2);
      return { url, descriptor };
    })
    .filter((item) => item.url);
}

const CDN_HOSTNAMES = [
  "acdn.tiendanube.com",
  "acdn.mitiendanube.com",
  "dcdn-us.mitiendanube.com",
  "dcdn.tiendanube.com",
];

function isCdnUrl(rawUrl: string): boolean {
  try {
    const url = new URL(rawUrl.startsWith("//") ? `https:${rawUrl}` : rawUrl);
    return CDN_HOSTNAMES.some((h) => url.hostname.toLowerCase() === h);
  } catch {
    return false;
  }
}

function toAbsoluteCdnUrl(rawUrl: string): string | null {
  const decoded = decode(rawUrl).trim();

  if (!decoded || decoded.startsWith("data:") || decoded.startsWith("blob:")) {
    return null;
  }

  try {
    const url = new URL(decoded.startsWith("//") ? `https:${decoded}` : decoded, DOMAIN);

    if (!CDN_HOSTNAMES.some((h) => url.hostname.toLowerCase() === h)) {
      return null;
    }

    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

function buildCandidate(url: string, descriptor: string, order: number): ImageCandidate {
  return {
    key: imageKey(url),
    order,
    score: imageScore(url, descriptor),
    url,
  };
}

function imageKey(url: string): string {
  const parsed = new URL(url);
  parsed.search = "";
  const normalizedPath = parsed.pathname.replace(/[-_]\d{2,5}[-x]\d{2,5}(?=\.(?:jpe?g|png|webp)$)/i, "");
  return `${parsed.hostname}${normalizedPath}`;
}

function imageScore(url: string, descriptor: string): number {
  const descriptorWidth = Number(descriptor.replace(/[^\d]/g, ""));

  if (descriptor.endsWith("w") && Number.isFinite(descriptorWidth)) {
    return descriptorWidth;
  }

  const dimensions = new URL(url).pathname.match(/[-_](\d{2,5})[-x](\d{2,5})(?=\.(?:jpe?g|png|webp)$)/i);

  if (dimensions) {
    return Math.max(Number(dimensions[1]), Number(dimensions[2]));
  }

  return 0;
}

async function downloadAndOptimizeImages(slug: string, urls: string[]): Promise<string[]> {
  const safeSlug = safePathSegment(slug);
  const productDir = path.join(PUBLIC_PRODUCTS_DIR, safeSlug);
  const images: string[] = [];

  await mkdir(productDir, { recursive: true });

  for (const [index, url] of urls.entries()) {
    const imageNumber = index + 1;

    try {
      const image = await fetchImage(url);
      const extension = imageExtension(url, image.contentType);
      const rawPath = path.join(productDir, `raw-${imageNumber}.${extension}`);

      await writeFile(rawPath, image.buffer);

      for (const size of OUTPUT_SIZES) {
        const fileName = `${imageNumber}-${size}.webp`;
        const outputPath = path.join(productDir, fileName);

        await sharp(image.buffer)
          .rotate()
          .resize({ width: size, withoutEnlargement: true })
          .webp({ quality: size >= 2000 ? 86 : 82 })
          .toFile(outputPath);

        images.push(`products/${safeSlug}/${fileName}`);
      }
    } catch (error) {
      console.warn(`  imagem ${imageNumber}: falha ao processar ${url} - ${formatError(error)}`);
    }
  }

  return images;
}

async function fetchImage(url: string): Promise<{ buffer: Buffer; contentType: string }> {
  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return {
    buffer: Buffer.from(await response.arrayBuffer()),
    contentType: response.headers.get("content-type") ?? "",
  };
}

function imageExtension(url: string, contentType: string): string {
  const extension = path.extname(new URL(url).pathname).replace(".", "").toLowerCase();

  if (["jpg", "jpeg", "png", "webp"].includes(extension)) {
    return extension === "jpeg" ? "jpg" : extension;
  }

  if (contentType.includes("png")) {
    return "png";
  }

  if (contentType.includes("webp")) {
    return "webp";
  }

  return "jpg";
}

function safePathSegment(segment: string): string {
  const safe = segment.replace(/[^a-zA-Z0-9._-]/g, "-");

  if (!safe || safe === "." || safe === "..") {
    throw new Error(`slug inválido para caminho de arquivo: ${segment}`);
  }

  return safe;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

main().catch((error) => {
  console.error(formatError(error));
  process.exitCode = 1;
});
