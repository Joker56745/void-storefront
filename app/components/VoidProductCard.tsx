import {Link} from '~/components/Link';

import type {VoidPlaceholderProduct} from '~/data/void-catalog';
import {useVoidPrice} from '~/lib/void-pricing';

type VoidProductCardProps = {
  product: VoidPlaceholderProduct;
  index: number;
  loading?: 'eager' | 'lazy';
  /** Called when the card link is clicked (e.g. close cart drawer). */
  onNavigate?: () => void;
  /** Tighter layout for cart drawer / small grids. */
  compact?: boolean;
};

/** Editorial product card — premium dark techwear, not retail grid. */
export function VoidProductCard({
  product,
  index,
  loading = 'lazy',
  onNavigate,
  compact = false,
}: VoidProductCardProps) {
  const indexLabel = String(index + 1).padStart(2, '0');
  const formattedPrice = useVoidPrice(product.priceUsd);

  return (
    <article
      className={`void-product-card group${compact ? ' void-product-card--compact' : ''}`}
    >
      <Link
        to={product.handle}
        prefetch="intent"
        onClick={onNavigate}
        className="void-product-card-link block"
        aria-label={`${product.title}, ${formattedPrice}. ${product.description}`}
      >
        <div className="void-product-media relative aspect-[3/4] overflow-hidden">
          <span className="void-product-index" aria-hidden>
            {indexLabel}
          </span>
          <img
            src={product.image}
            alt={product.imageAlt}
            loading={loading}
            decoding="async"
            style={{objectPosition: product.imagePosition}}
            className="void-product-photo absolute inset-0 h-full w-full object-cover"
          />
          <span className="void-product-media-line" aria-hidden />
        </div>

        <div className="void-product-meta">
          <div className="void-product-meta-head flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <h3 className="void-product-title">{product.title}</h3>
            <p className="void-product-price sm:pt-0.5">{formattedPrice}</p>
          </div>
          <p className="void-product-material">{product.material}</p>
          <p className="void-product-desc">{product.description}</p>
        </div>
      </Link>
    </article>
  );
}
