export type ProductDescription = {
  experience: string | null;
  details: Record<string, string> | null;
  fit: string | null;
  testimonial: { text: string; author: string } | null;
  body: string | null;
};

export type ProductVariant = {
  name: string;
  stock: number;
};

export type Product = {
  slug: string;
  name: string;
  price: number;
  priceCompare: number | null;
  currency: "BRL";
  audience: string[];
  faceShape?: string[];
  vibe?: string[];
  stock?: number;
  available: boolean;
  description: ProductDescription;
  variants: ProductVariant[];
  images: string[];
};

export type ProductImageSet = {
  index: number;
  src: string;
  src600: string | null;
  src1200: string | null;
  src2000: string | null;
};

export type CardProduct = {
  slug: string;
  name: string;
  price: number;
  stock?: number;
  image: string;
  hoverImage?: string;
  available?: boolean;
  audience?: string[];
  faceShape?: string[];
  vibe?: string[];
};

const imageIndexRegex = /\/(\d+)-(\d+)\.webp$/i;

export function formatPriceBRL(value: number): string {
  const hasDecimals = value % 1 !== 0;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(value);
}

export function toSingleLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function toParagraphs(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function getProductDescription(product: Product): string {
  const body =
    product.description.body ??
    product.description.experience ??
    product.description.fit ??
    product.description.testimonial?.text ??
    "";

  if (!body) {
    return "Óculos premium-acessíveis da Rivano. Nascida em Salvador. Inspirada no verão europeu.";
  }

  const compact = toSingleLine(body);
  return compact.length > 156 ? `${compact.slice(0, 153)}...` : compact;
}

export function getImageSets(images: string[]): ProductImageSet[] {
  const map = new Map<number, ProductImageSet>();

  for (const image of images) {
    const match = image.match(imageIndexRegex);

    if (!match) {
      continue;
    }

    const index = Number(match[1]);
    const width = Number(match[2]);
    const current = map.get(index) ?? {
      index,
      src: image,
      src600: null,
      src1200: null,
      src2000: null,
    };

    if (width === 600) {
      current.src600 = image;
    }
    if (width === 1200) {
      current.src1200 = image;
    }
    if (width === 2000) {
      current.src2000 = image;
    }

    current.src = current.src1200 ?? current.src2000 ?? current.src600 ?? image;
    map.set(index, current);
  }

  return Array.from(map.values()).sort((a, b) => a.index - b.index);
}

export function buildSrcset(set: ProductImageSet): string {
  const entries = [
    set.src600 ? `/${set.src600} 600w` : "",
    set.src1200 ? `/${set.src1200} 1200w` : "",
    set.src2000 ? `/${set.src2000} 2000w` : "",
  ].filter(Boolean);

  return entries.join(", ");
}

export function toPublicPath(image: string | null | undefined): string {
  if (!image) {
    return "";
  }

  return image.startsWith("/") ? image : `/${image}`;
}

export function toCardProduct(product: Product): CardProduct {
  const imageSets = getImageSets(product.images);
  const primaryImage = imageSets[0];
  const hoverImage = imageSets[1];

  return {
    slug: product.slug,
    name: product.name,
    price: product.price,
    stock: product.stock,
    image: toPublicPath(primaryImage?.src),
    hoverImage: hoverImage ? toPublicPath(hoverImage.src) : undefined,
    available: product.available,
    audience: product.audience,
    faceShape: product.faceShape,
    vibe: product.vibe,
  };
}

export function pickRelatedProducts(products: Product[], slug: string, count: number): Product[] {
  const candidates = products.filter((product) => product.slug !== slug && product.available);
  const seed = hash(slug);

  const ranked = [...candidates].sort((a, b) => {
    const aScore = hash(`${a.slug}-${seed}`);
    const bScore = hash(`${b.slug}-${seed}`);
    return aScore - bScore;
  });

  return ranked.slice(0, count);
}

function hash(value: string): number {
  let hashed = 0;

  for (let index = 0; index < value.length; index += 1) {
    hashed = (hashed << 5) - hashed + value.charCodeAt(index);
    hashed |= 0;
  }

  return Math.abs(hashed);
}
