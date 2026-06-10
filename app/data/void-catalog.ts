/**
 * VØID Core Collection — editorial catalog + PDP data.
 * Replace with Shopify Storefront API when catalog is live.
 */

export type VoidPlaceholderProduct = {
  id: string;
  title: string;
  description: string;
  material: string;
  price: string;
  handle: string;
  image: string;
  imageAlt: string;
  imagePosition: string;
};

export type VoidGalleryImage = {
  id: string;
  src: string;
  alt: string;
  position: string;
  thumbPosition?: string;
};

export type VoidProductSpec = {
  label: string;
  value: string;
};

export type VoidProductDetail = VoidPlaceholderProduct & {
  slug: string;
  /** Shopify product handle for cart/checkout (defaults to slug). */
  shopifyHandle?: string;
  longDescription: string;
  gallery: VoidGalleryImage[];
  sizes: string[];
  details: string[];
  specs: VoidProductSpec[];
};

const asset = (file: string) => `/images/void/${file}`;

const CACHE = '?v=5';

const img = (file: string) => `${asset(file)}${CACHE}`;

function slide(
  id: string,
  file: string,
  alt: string,
  position: string,
  thumbPosition?: string,
): VoidGalleryImage {
  return {
    id,
    src: img(file),
    alt,
    position,
    thumbPosition: thumbPosition ?? position,
  };
}

export const VOID_COLLECTION_TITLE = 'Core Collection';

/** Public route for the editorial Core Collection listing */
export const VOID_COLLECTION_PATH = '/collections/core';

export const VOID_COLLECTION_LEAD =
  'Black and charcoal palette. Technical materials. Brutalist proportion. Five pieces — shell, fleece, cargo, boots, tee.';

export const VOID_HERO_IMAGE = `${asset('hero.jpg')}?v=3`;

const galleryFrom = (
  file: string,
  alt: string,
  positions: string[],
): VoidGalleryImage[] =>
  positions.map((position, index) => ({
    id: `${file}-${index}`,
    src: file.includes('?') ? file : asset(file),
    alt,
    position,
    thumbPosition: position,
  }));

export const VOID_PRODUCTS: VoidProductDetail[] = [
  {
    id: 'void-shell-jacket',
    slug: 'shell-jacket',
    title: 'Black Technical Shell Jacket',
    description: 'Waterproof 3L shell. Taped seams. Storm hood.',
    longDescription:
      'Three-layer waterproof shell engineered for urban transit and alpine egress. Matte ripstop face with welded construction and storm-rated hood geometry.',
    material: 'Nylon ripstop · DWR',
    price: '$1,890',
    handle: '/void/shell-jacket',
    image: `${asset('shell-01-front.jpg')}?v=5`,
    imageAlt:
      'Black technical shell jacket, front view, matte ripstop nylon, storm hood',
    imagePosition: '50% 35%',
    gallery: [
      {
        id: 'shell-front',
        src: `${asset('shell-01-front.jpg')}?v=5`,
        alt: 'Black technical shell jacket — front view',
        position: '50% 40%',
        thumbPosition: '50% 35%',
      },
      {
        id: 'shell-back',
        src: `${asset('shell-02-back.jpg')}?v=5`,
        alt: 'Black technical shell jacket — back view, hood and seams',
        position: '50% 50%',
        thumbPosition: '50% 20%',
      },
      {
        id: 'shell-hood',
        src: `${asset('shell-03-hood.jpg')}?v=5`,
        alt: 'Close-up storm hood, collar and zip guard detail',
        position: '50% 45%',
        thumbPosition: '50% 30%',
      },
      {
        id: 'shell-zip',
        src: `${asset('shell-04-detail.jpg')}?v=5`,
        alt: 'Close-up pockets, waterproof zippers and welded seams',
        position: '50% 55%',
        thumbPosition: '60% 50%',
      },
      {
        id: 'shell-on-body',
        src: `${asset('shell-05-on-body.jpg')}?v=5`,
        alt: 'Model in motion wearing black technical shell jacket',
        position: '50% 30%',
        thumbPosition: '50% 25%',
      },
      {
        id: 'shell-fabric',
        src: `${asset('shell-06-fabric.jpg')}?v=5`,
        alt: 'Macro ripstop nylon fabric texture and DWR finish',
        position: '50% 50%',
        thumbPosition: '50% 50%',
      },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    details: [
      '3-layer waterproof membrane · 20,000mm hydrostatic head',
      'Fully taped seams · welded zip guard',
      'Articulated sleeve · underarm venting',
      'Storm hood with laminated brim · adjustable hem',
    ],
    specs: [
      {label: 'Shell', value: 'Nylon ripstop 40D'},
      {label: 'Membrane', value: '3L ePTFE laminate'},
      {label: 'Finish', value: 'DWR C0 durable'},
      {label: 'Weight', value: '680g (M)'},
      {label: 'Origin', value: 'Portugal'},
    ],
  },
  {
    id: 'void-heavy-hoodie',
    slug: 'heavy-hoodie',
    title: 'Oversized Heavy Hoodie',
    description: '480gsm cotton fleece. Dropped shoulder. Raw edge hem.',
    longDescription:
      'Garment-dyed heavyweight fleece with dropped shoulder block and raw-edge hem. Built for layering under shell systems without bulk at the neckline.',
    material: 'Heavy cotton · Garment dyed',
    price: '$480',
    handle: '/void/heavy-hoodie',
    image: `${asset('hoodie-01-front.jpg')}?v=5`,
    imageAlt:
      'Oversized black hoodie, garment dyed fleece, front view, boxy fit',
    imagePosition: '50% 40%',
    gallery: [
      slide(
        'hoodie-front',
        'hoodie-01-front.jpg',
        'Oversized heavy hoodie — front view, dropped shoulder',
        '50% 40%',
        '50% 35%',
      ),
      slide(
        'hoodie-back',
        'hoodie-02-back.jpg',
        'Oversized black hoodie — back view, hood and raw hem',
        '50% 45%',
        '50% 30%',
      ),
      slide(
        'hoodie-hood',
        'hoodie-03-hood.jpg',
        'Close-up double-layer hood and drawcord detail',
        '50% 50%',
        '50% 40%',
      ),
      slide(
        'hoodie-pocket',
        'hoodie-04-detail.jpg',
        'Kangaroo pocket and raw edge hem — fleece texture',
        '50% 55%',
        '55% 50%',
      ),
      slide(
        'hoodie-on-body',
        'hoodie-05-on-body.jpg',
        'Model wearing oversized black hoodie — street editorial',
        '50% 35%',
        '50% 25%',
      ),
      slide(
        'hoodie-fabric',
        'hoodie-06-fabric.jpg',
        'Macro garment-dyed cotton fleece fabric texture',
        '50% 50%',
        '50% 50%',
      ),
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    details: [
      '480gsm cotton fleece · enzyme washed',
      'Dropped shoulder · boxy torso block',
      'Double-layer hood · flat drawcord',
      'Raw edge hem · no exterior branding',
    ],
    specs: [
      {label: 'Fabric', value: '100% cotton fleece'},
      {label: 'Weight', value: '480gsm'},
      {label: 'Dye', value: 'Garment dyed black'},
      {label: 'Fit', value: 'Oversized'},
      {label: 'Origin', value: 'Japan'},
    ],
  },
  {
    id: 'void-cargo-pant',
    slug: 'cargo-pant',
    title: 'Tactical Cargo Pants',
    description: 'Articulated knee. Concealed cargo. Matte hardware.',
    longDescription:
      'Slim-straight tactical pant with articulated knee panel and concealed cargo volume. Cotton-nylon canvas with matte oxide hardware throughout.',
    material: 'Cotton-nylon canvas',
    price: '$620',
    handle: '/void/cargo-pant',
    image: img('cargo-01-front.jpg'),
    imageAlt:
      'Black tactical cargo pants, front view, articulated knees, utility pockets',
    imagePosition: '50% 70%',
    gallery: [
      slide(
        'cargo-front',
        'cargo-01-front.jpg',
        'Tactical cargo pants — front view, slim-straight fit',
        '50% 70%',
        '50% 55%',
      ),
      slide(
        'cargo-back',
        'cargo-02-back.jpg',
        'Black tactical cargo pants — back view, knee panels',
        '50% 55%',
        '50% 40%',
      ),
      slide(
        'cargo-pocket',
        'cargo-03-pocket.jpg',
        'Concealed cargo pocket and matte snap hardware detail',
        '50% 50%',
        '50% 45%',
      ),
      slide(
        'cargo-knee',
        'cargo-04-knee.jpg',
        'Articulated knee panel and reinforced seam detail',
        '50% 60%',
        '55% 50%',
      ),
      slide(
        'cargo-on-body',
        'cargo-05-on-body.jpg',
        'Model wearing black tactical cargo pants — street editorial',
        '50% 65%',
        '50% 50%',
      ),
      slide(
        'cargo-fabric',
        'cargo-06-fabric.jpg',
        'Macro cotton-nylon canvas fabric texture',
        '50% 50%',
        '50% 50%',
      ),
    ],
    sizes: ['28', '30', '32', '34', '36'],
    details: [
      'Articulated knee · gusseted crotch',
      'Concealed cargo · matte snap closure',
      'Reinforced seat · bar-tack stress points',
      'Slim-straight leg · 32" inseam (32)',
    ],
    specs: [
      {label: 'Fabric', value: 'Cotton-nylon canvas'},
      {label: 'Ratio', value: '65/35'},
      {label: 'Hardware', value: 'Matte black oxide'},
      {label: 'Weight', value: '410g (32)'},
      {label: 'Origin', value: 'Italy'},
    ],
  },
  {
    id: 'void-combat-boot',
    slug: 'combat-boot',
    title: 'Leather Combat Boots',
    description: 'Full-grain leather. Goodyear welt. Matte black hardware.',
    longDescription:
      'Full-grain leather combat boot on commando rubber unit. Goodyear welted for resole cycles. Matte hardware and blind eyelets.',
    material: 'Leather · Rubber commando sole',
    price: '$740',
    handle: '/void/combat-boot',
    image: img('boot-01-front.jpg'),
    imageAlt:
      'Black leather combat boots, pair front view, commando sole, Goodyear welt',
    imagePosition: '50% 55%',
    gallery: [
      slide(
        'boot-front',
        'boot-01-front.jpg',
        'Leather combat boots — front three-quarter, commando sole',
        '50% 55%',
        '50% 45%',
      ),
      slide(
        'boot-side',
        'boot-02-side.jpg',
        'Combat boot — side profile, welt and heel stack',
        '50% 50%',
        '45% 50%',
      ),
      slide(
        'boot-lace',
        'boot-03-lace.jpg',
        'Matte eyelets, laces and leather grain close-up',
        '50% 45%',
        '50% 40%',
      ),
      slide(
        'boot-sole',
        'boot-04-sole.jpg',
        'Commando rubber outsole tread and Goodyear welt detail',
        '50% 70%',
        '50% 65%',
      ),
      slide(
        'boot-lifestyle',
        'boot-05-lifestyle.jpg',
        'Combat boots on dark concrete — low-angle editorial',
        '50% 60%',
        '50% 55%',
      ),
      slide(
        'boot-leather',
        'boot-06-leather.jpg',
        'Macro full-grain vegetable-tanned leather texture',
        '50% 50%',
        '50% 50%',
      ),
    ],
    sizes: ['40', '41', '42', '43', '44', '45'],
    details: [
      'Full-grain leather upper · vegetable tanned',
      'Goodyear welt · resoleable unit',
      'Commando rubber outsole · 25mm stack',
      'Leather footbed · matte black eyelets',
    ],
    specs: [
      {label: 'Upper', value: 'Full-grain leather'},
      {label: 'Construction', value: 'Goodyear welt'},
      {label: 'Sole', value: 'Rubber commando'},
      {label: 'Weight', value: '1.2kg (pair, 42)'},
      {label: 'Origin', value: 'Portugal'},
    ],
  },
  {
    id: 'void-black-tee',
    slug: 'black-tee',
    title: 'Minimalist Black Tee',
    description: 'Relaxed fit. Bound neckline. No exterior branding.',
    longDescription:
      'Supima cotton tee with relaxed block and bound neckline. Enzyme washed for a muted hand-feel. Zero exterior branding.',
    material: 'Supima cotton · Enzyme wash',
    price: '$180',
    handle: '/void/black-tee',
    image: img('tee-01-front.jpg'),
    imageAlt:
      'Minimalist black t-shirt on hanger, relaxed fit, bound crew neck',
    imagePosition: '50% 38%',
    gallery: [
      slide(
        'tee-front',
        'tee-01-front.jpg',
        'Minimalist black tee — front on hanger, supima cotton',
        '50% 38%',
        '50% 35%',
      ),
      slide(
        'tee-back',
        'tee-02-back.jpg',
        'Black t-shirt — back view, shoulder seams and hem',
        '50% 45%',
        '50% 40%',
      ),
      slide(
        'tee-neckline',
        'tee-03-neckline.jpg',
        'Bound crew neckline and double-needle stitching detail',
        '50% 48%',
        '50% 42%',
      ),
      slide(
        'tee-hem',
        'tee-04-hem.jpg',
        'Double-needle hem and side seam detail',
        '50% 55%',
        '55% 50%',
      ),
      slide(
        'tee-on-body',
        'tee-05-on-body.jpg',
        'Model wearing relaxed black minimalist tee — editorial',
        '50% 40%',
        '50% 35%',
      ),
      slide(
        'tee-fabric',
        'tee-06-fabric.jpg',
        'Macro enzyme-washed supima cotton knit texture',
        '50% 50%',
        '50% 50%',
      ),
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    details: [
      'Supima cotton · enzyme washed',
      'Relaxed fit · bound crew neck',
      'Double-needle hem · taped shoulder',
      'No exterior branding · packable',
    ],
    specs: [
      {label: 'Fabric', value: '100% Supima cotton'},
      {label: 'Weight', value: '180gsm'},
      {label: 'Fit', value: 'Relaxed'},
      {label: 'Finish', value: 'Enzyme wash'},
      {label: 'Origin', value: 'Portugal'},
    ],
  },
];

export const VOID_FEATURED_PRODUCTS: VoidPlaceholderProduct[] = VOID_PRODUCTS;

export function getVoidProductBySlug(
  slug: string,
): VoidProductDetail | undefined {
  return VOID_PRODUCTS.find((p) => p.slug === slug);
}

export function getRelatedVoidProducts(
  slug: string,
  limit = 4,
): VoidProductDetail[] {
  return VOID_PRODUCTS.filter((p) => p.slug !== slug).slice(0, limit);
}

/** Client-side search over the editorial catalog (no Shopify demo products). */
export function searchVoidProducts(query: string): VoidProductDetail[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const terms = trimmed.split(/\s+/).filter(Boolean);

  return VOID_PRODUCTS.filter((product) => {
    const haystack = [
      product.title,
      product.description,
      product.longDescription,
      product.material,
      product.slug,
      product.price,
      ...product.details,
      ...product.sizes,
      ...product.specs.map((row) => `${row.label} ${row.value}`),
    ]
      .join(' ')
      .toLowerCase();

    return terms.every((term) => haystack.includes(term));
  });
}
