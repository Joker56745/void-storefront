import {Link} from '~/components/Link';
import type {VoidPlaceholderProduct} from '~/data/void-catalog';

type VoidSearchResultRowProps = {
  product: VoidPlaceholderProduct;
  onSelect?: () => void;
};

export function VoidSearchResultRow({product, onSelect}: VoidSearchResultRowProps) {
  return (
    <Link
      to={product.handle}
      prefetch="intent"
      onClick={onSelect}
      className="void-search-result flex items-start gap-4 border-b border-primary/[0.06] px-4 py-5 transition-colors last:border-b-0 hover:bg-primary/[0.04] sm:gap-5 sm:px-5"
    >
      <div className="void-search-result-media">
        <img
          src={product.image}
          alt={product.imageAlt}
          loading="eager"
          decoding="async"
          width={80}
          height={96}
          style={{objectPosition: product.imagePosition}}
          className="void-search-result-img"
        />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="void-search-result-eyebrow">Core Collection</p>
        <p className="void-search-result-title mt-2">{product.title}</p>
        <p className="void-search-result-price mt-3">{product.price}</p>
        <p className="void-search-result-desc mt-4">{product.description}</p>
        <p className="void-search-result-material mt-3">{product.material}</p>
      </div>
    </Link>
  );
}
