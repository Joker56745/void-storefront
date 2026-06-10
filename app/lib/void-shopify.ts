export type VoidShopifyVariant = {
  id: string;
  availableForSale: boolean;
  selectedOptions: Array<{name: string; value: string}>;
};

/** Match editorial size to a Shopify variant on the preview store. */
export function findVoidVariantForSize(
  variants: VoidShopifyVariant[],
  size: string,
): VoidShopifyVariant | undefined {
  const normalized = size.trim();
  const inStock = variants.filter((v) => v.availableForSale);
  // Demo stores often ship with zero inventory — still map sizes when options match.
  const available = inStock.length > 0 ? inStock : variants;
  if (!available.length) return undefined;

  const exact = available.find((variant) =>
    variant.selectedOptions.some((option) => option.value.trim() === normalized),
  );
  if (exact) return exact;

  const sizeOption = available.find((variant) =>
    variant.selectedOptions.some(
      (option) =>
        option.name.toLowerCase() === 'size' &&
        option.value.trim() === normalized,
    ),
  );
  if (sizeOption) return sizeOption;

  const index = demoSizeIndex(normalized);
  return available[index % available.length];
}

/** Stable index for apparel / numeric sizes when preview catalog uses different labels. */
function demoSizeIndex(size: string): number {
  const apparel = ['XS', 'S', 'M', 'L', 'XL'];
  const apparelHit = apparel.indexOf(size.toUpperCase());
  if (apparelHit >= 0) return apparelHit;

  const numeric = Number.parseInt(size, 10);
  if (!Number.isNaN(numeric)) {
    if (numeric >= 28 && numeric <= 36) return numeric - 28;
    if (numeric >= 40 && numeric <= 45) return numeric - 40;
  }

  return 0;
}
