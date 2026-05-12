import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import * as cheerio from "cheerio";
import { decode } from "html-entities";
import Papa from "papaparse";

type CsvRow = Record<string, string | undefined>;

type ProductDescription = {
  experience: string | null;
  details: Record<string, string> | null;
  fit: string | null;
  testimonial: { text: string; author: string } | null;
  body: string | null;
};

type Product = {
  slug: string;
  name: string;
  price: number;
  priceCompare: number | null;
  currency: "BRL";
  audience: string[];
  stock: number;
  available: boolean;
  description: ProductDescription;
  variants: Array<{ name: string; stock: number }>;
  images: string[];
};

const CSV_PATH = path.join(process.cwd(), "data-source", "products.csv");
const PRODUCTS_PATH = path.join(process.cwd(), "src", "data", "products.json");

const COLUMNS = {
  slug: "Identificador URL",
  name: "Nome",
  categories: "Categorias",
  variationName: "Nome da variação 1",
  variationValue: "Valor da variação 1",
  price: "Preço",
  priceCompare: "Preço promocional",
  stock: "Estoque",
  description: "Descrição",
} as const;

async function main() {
  const csv = await readFile(CSV_PATH, "latin1").catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") {
      throw new Error(`CSV não encontrado em ${CSV_PATH}. Coloque o arquivo em data-source/products.csv.`);
    }

    throw error;
  });

  const parsed = Papa.parse<CsvRow>(csv, {
    delimiter: ";",
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (header) => header.replace(/^\uFEFF/, "").trim(),
  });

  if (parsed.errors.length > 0) {
    console.warn("Avisos ao ler CSV:");
    for (const error of parsed.errors) {
      console.warn(`- Linha ${error.row ?? "?"}: ${error.message}`);
    }
  }

  const groups = new Map<string, CsvRow[]>();

  for (const row of parsed.data) {
    const slug = cell(row, COLUMNS.slug);

    if (!slug) {
      continue;
    }

    const rows = groups.get(slug) ?? [];
    rows.push(row);
    groups.set(slug, rows);
  }

  const products = Array.from(groups.entries()).map(([slug, rows]) => buildProduct(slug, rows));
  const unavailable = products.filter((product) => !product.available).map((product) => product.slug);

  await mkdir(path.dirname(PRODUCTS_PATH), { recursive: true });
  await writeFile(PRODUCTS_PATH, `${JSON.stringify(products, null, 2)}\n`, "utf8");

  console.log(`Produtos gerados: ${products.length}`);
  console.log(`available=false: ${unavailable.length > 0 ? unavailable.join(", ") : "nenhum"}`);
}

function buildProduct(slug: string, rows: CsvRow[]): Product {
  const baseName = firstNonEmpty(rows, COLUMNS.name);
  const baseDescription = firstNonEmpty(rows, COLUMNS.description);
  const variants = buildVariants(rows);
  const stock = variants.length > 0 ? variants.reduce((total, variant) => total + variant.stock, 0) : parseStock(firstNonEmpty(rows, COLUMNS.stock));

  return {
    slug,
    name: decodeCell(baseName),
    price: parsePrice(firstNonEmpty(rows, COLUMNS.price)),
    priceCompare: parseNullablePrice(firstNonEmpty(rows, COLUMNS.priceCompare)),
    currency: "BRL",
    audience: parseAudience(firstNonEmpty(rows, COLUMNS.categories)),
    stock,
    available: stock > 0,
    description: parseDescription(baseDescription),
    variants,
    images: [],
  };
}

function buildVariants(rows: CsvRow[]): Product["variants"] {
  const variants = rows
    .map((row) => {
      const variationValue = decodeCell(cell(row, COLUMNS.variationValue));
      const variationName = decodeCell(cell(row, COLUMNS.variationName));
      const name = variationValue || variationName;

      if (!name) {
        return null;
      }

      return {
        name,
        stock: parseStock(cell(row, COLUMNS.stock)),
      };
    })
    .filter((variant): variant is { name: string; stock: number } => variant !== null);

  return dedupeVariants(variants);
}

function dedupeVariants(variants: Product["variants"]): Product["variants"] {
  const byName = new Map<string, { name: string; stock: number }>();

  for (const variant of variants) {
    const key = normalizeKey(variant.name);
    const current = byName.get(key);

    if (current) {
      current.stock += variant.stock;
    } else {
      byName.set(key, { ...variant });
    }
  }

  return Array.from(byName.values());
}

function parseDescription(rawDescription: string): ProductDescription {
  const html = decode(rawDescription).trim();

  if (!html) {
    return emptyDescription();
  }

  const $ = cheerio.load(html);
  $("script, style").remove();

  const experience = extractSectionAfterComment($, "RIVANO EXPERIENCE");
  const detailsText = extractSectionAfterComment($, "DETALHES");
  const fit = extractSectionAfterComment($, "COMO FICA");
  const testimonialText = extractSectionAfterComment($, "PROVA SOCIAL");
  const details = parseDetails(detailsText);
  const testimonial = parseTestimonial(testimonialText);
  const hasStructuredBlocks = Boolean(experience || detailsText || fit || testimonialText);

  return {
    experience,
    details,
    fit,
    testimonial,
    body: hasStructuredBlocks ? null : cleanText($.root().text()),
  };
}

function emptyDescription(): ProductDescription {
  return {
    experience: null,
    details: null,
    fit: null,
    testimonial: null,
    body: null,
  };
}

function extractSectionAfterComment($: cheerio.CheerioAPI, label: string): string | null {
  const comments = collectComments($.root().contents().toArray());
  const normalizedLabel = normalizeKey(label);

  for (const comment of comments) {
    if (!normalizeKey(String(comment.data ?? "")).includes(normalizedLabel)) {
      continue;
    }

    let next = comment.next;

    while (next && isIgnorableNode(next)) {
      next = next.next;
    }

    if (!next) {
      continue;
    }

    const text = cleanNodeText($, next);
    return text || null;
  }

  return null;
}

function collectComments(nodes: any[], comments: any[] = []): any[] {
  for (const node of nodes) {
    if (node.type === "comment") {
      comments.push(node);
    }

    if (Array.isArray(node.children)) {
      collectComments(node.children, comments);
    }
  }

  return comments;
}

function isIgnorableNode(node: any): boolean {
  return node.type === "comment" || (node.type === "text" && !String(node.data ?? "").trim());
}

function cleanNodeText($: cheerio.CheerioAPI, node: any): string {
  const clone = $(node).clone();
  clone.find("br").replaceWith("\n");
  clone.find("p, li, div").each((_, element) => {
    $(element).append("\n");
  });

  return cleanText(clone.text());
}

function parseDetails(text: string | null): Record<string, string> | null {
  if (!text) {
    return null;
  }

  const details: Record<string, string> = {};
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);

  for (const line of lines) {
    const match = line.match(/^([^:：]+)[:：]\s*(.+)$/);

    if (!match) {
      continue;
    }

    const key = cleanText(match[1]).replace(/[.-]+$/, "").trim();
    const value = cleanText(match[2]);

    if (key && value) {
      details[key] = value;
    }
  }

  return Object.keys(details).length > 0 ? details : null;
}

function parseTestimonial(text: string | null): ProductDescription["testimonial"] {
  if (!text) {
    return null;
  }

  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);

  if (lines.length === 0) {
    return null;
  }

  if (lines.length >= 2) {
    const author = cleanAuthor(lines.at(-1) ?? "");
    const quote = stripQuotes(lines.slice(0, -1).join("\n"));
    return quote ? { text: quote, author } : null;
  }

  const inlineMatch = lines[0].match(/^(.+?)\s[-–—]\s(.+)$/);

  if (inlineMatch) {
    return {
      text: stripQuotes(inlineMatch[1]),
      author: cleanAuthor(inlineMatch[2]),
    };
  }

  return {
    text: stripQuotes(lines[0]),
    author: "",
  };
}

function parseAudience(rawCategories: string): string[] {
  const categories = decodeCell(rawCategories)
    .split(/[,|/]+|\s>\s/g)
    .map((category) => cleanText(category))
    .filter(Boolean);

  const audience = categories
    .map((category) => {
      const normalized = normalizeKey(category);

      if (normalized.startsWith("para ")) {
        return normalized.replace(/^para\s+/, "");
      }

      if (["ela", "ele", "unissex"].includes(normalized)) {
        return normalized;
      }

      return "";
    })
    .filter(Boolean);

  return Array.from(new Set(audience));
}

function parsePrice(value: string): number {
  return parseDecimal(value) ?? 0;
}

function parseNullablePrice(value: string): number | null {
  return parseDecimal(value);
}

function parseStock(value: string): number {
  return Math.max(0, Math.trunc(parseDecimal(value) ?? 0));
}

function parseDecimal(value: string): number | null {
  const cleaned = cellValue(value).replace(/[^\d,.-]/g, "");

  if (!cleaned || !/\d/.test(cleaned)) {
    return null;
  }

  const normalized = cleaned.includes(",") ? cleaned.replace(/\./g, "").replace(",", ".") : cleaned;
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}

function firstNonEmpty(rows: CsvRow[], key: string): string {
  return rows.map((row) => cell(row, key)).find(Boolean) ?? "";
}

function cell(row: CsvRow, key: string): string {
  return cellValue(row[key]);
}

function cellValue(value: unknown): string {
  return String(value ?? "").replace(/\uFEFF/g, "").trim();
}

function decodeCell(value: string): string {
  return cleanText(decode(value));
}

function cleanText(value: string): string {
  return value
    .replace(/\r/g, "\n")
    .replace(/\u00A0/g, " ")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .filter(Boolean)
    .join("\n")
    .trim();
}

function normalizeKey(value: string): string {
  return decode(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function stripQuotes(value: string): string {
  return cleanText(value).replace(/^[“”"']+|[“”"']+$/g, "");
}

function cleanAuthor(value: string): string {
  return cleanText(value).replace(/^(?:[-–—]\s*|por\s+)/i, "");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
