import {useMemo} from 'react';
import {CartForm} from '@shopify/hydrogen';
import type {FetcherWithComponents} from '@remix-run/react';

import {Button} from '~/components/Button';
import type {VoidProductDetail} from '~/data/void-catalog';
import {voidCartLineAttributes} from '~/lib/void-cart-display';
import {
  findVoidVariantForSize,
  type VoidShopifyVariant,
} from '~/lib/void-shopify';

type VoidPdpCartProps = {
  product: VoidProductDetail;
  selectedSize: string | null;
  shopifyVariants: VoidShopifyVariant[];
  className?: string;
};

export function VoidPdpCart({
  product,
  selectedSize,
  shopifyVariants,
  className = '',
}: VoidPdpCartProps) {
  const canAdd = selectedSize !== null;

  const selectedVariant = useMemo(() => {
    if (!selectedSize || shopifyVariants.length === 0) return undefined;
    return findVoidVariantForSize(shopifyVariants, selectedSize);
  }, [selectedSize, shopifyVariants]);

  if (!canAdd || !selectedVariant) {
    return (
      <>
        <Button
          as="button"
          type="button"
          variant="accent"
          width="full"
          className={`void-pdp-cart ${className}`.trim()}
          disabled
        >
          Add to cart
        </Button>
        {!canAdd ? (
          <p className="void-pdp-cart-note mt-4 font-sans text-fine uppercase">
            Select size to continue
          </p>
        ) : null}
      </>
    );
  }

  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesAdd}
      inputs={{
        lines: [
          {
            merchandiseId: selectedVariant.id,
            quantity: 1,
            attributes: voidCartLineAttributes(product, selectedSize),
          },
        ],
      }}
    >
      {(fetcher: FetcherWithComponents<unknown>) => (
        <Button
          as="button"
          type="submit"
          variant="accent"
          width="full"
          className={`void-pdp-cart ${className}`.trim()}
          disabled={fetcher.state !== 'idle'}
        >
          {fetcher.state !== 'idle' ? 'Adding…' : 'Add to cart'}
        </Button>
      )}
    </CartForm>
  );
}
