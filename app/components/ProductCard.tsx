import clsx from 'clsx';
import {flattenConnection, Image, Money, useMoney} from '@shopify/hydrogen';
import type {MoneyV2, Product} from '@shopify/hydrogen/storefront-api-types';

import type {ProductCardFragment} from 'storefrontapi.generated';
import {Link} from '~/components/Link';
import {Button} from '~/components/Button';
import {AddToCartButton} from '~/components/AddToCartButton';
import {isDiscounted, isNewArrival} from '~/lib/utils';
import {getProductPlaceholder} from '~/lib/placeholders';

export function ProductCard({
  product,
  label,
  className,
  loading,
  onClick,
  quickAdd,
}: {
  product: ProductCardFragment;
  label?: string;
  className?: string;
  loading?: HTMLImageElement['loading'];
  onClick?: () => void;
  quickAdd?: boolean;
}) {
  let cardLabel;

  const cardProduct: Product = product?.variants
    ? (product as Product)
    : getProductPlaceholder();
  if (!cardProduct?.variants?.nodes?.length) return null;

  const firstVariant = flattenConnection(cardProduct.variants)[0];

  if (!firstVariant) return null;
  const {image, price, compareAtPrice} = firstVariant;

  if (label) {
    cardLabel = label;
  } else if (isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2)) {
    cardLabel = 'Sale';
  } else if (isNewArrival(product.publishedAt)) {
    cardLabel = 'New';
  }

  return (
    <article className={clsx('void-product-card group', className)}>
      <Link
        onClick={onClick}
        to={`/products/${product.handle}`}
        prefetch="viewport"
        className="block"
      >
        <div className="void-product-media relative aspect-[4/5] overflow-hidden bg-[#0A0A0A]">
          {image ? (
            <Image
              className="absolute inset-0 h-full w-full object-cover object-center"
              sizes="(min-width: 64em) 22vw, (min-width: 48em) 30vw, 46vw"
              data={image}
              alt={image.altText || product.title}
              loading={loading}
              width={image.width ?? undefined}
              height={image.height ?? undefined}
            />
          ) : (
            <div className="h-full w-full bg-primary/[0.02]" />
          )}
          {cardLabel && (
            <span className="void-product-label absolute left-0 top-0 px-3 py-3">
              {cardLabel}
            </span>
          )}
        </div>

        <div className="void-product-meta mt-6 md:mt-8">
          <h3 className="void-product-title">{product.title}</h3>
          <div className="mt-2 flex items-baseline gap-4">
            <span className="void-product-price">
              <Money withoutTrailingZeros data={price!} />
            </span>
            {isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2) && (
              <CompareAtPrice
                className="void-product-price void-product-price--struck"
                data={compareAtPrice as MoneyV2}
              />
            )}
          </div>
        </div>
      </Link>

      {quickAdd && firstVariant.availableForSale && (
        <AddToCartButton
          lines={[{quantity: 1, merchandiseId: firstVariant.id}]}
          variant="secondary"
          className="mt-5 w-full rounded-none border-primary/[0.08] bg-transparent text-fine uppercase tracking-[0.2em] text-primary/50 hover:border-primary/20 hover:text-primary/80"
        >
          Add to Cart
        </AddToCartButton>
      )}
      {quickAdd && !firstVariant.availableForSale && (
        <Button
          variant="secondary"
          className="mt-5 w-full rounded-none border-primary/[0.08] bg-transparent text-fine uppercase tracking-[0.2em] text-primary/30"
          disabled
        >
          Sold out
        </Button>
      )}
    </article>
  );
}

function CompareAtPrice({
  data,
  className,
}: {
  data: MoneyV2;
  className?: string;
}) {
  const {currencyNarrowSymbol, withoutTrailingZerosAndCurrency} =
    useMoney(data);

  return (
    <span className={clsx('void-price-strike', className)}>
      {currencyNarrowSymbol}
      {withoutTrailingZerosAndCurrency}
    </span>
  );
}
