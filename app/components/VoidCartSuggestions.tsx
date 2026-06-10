import clsx from 'clsx';

import {Heading} from '~/components/Text';
import {Link} from '~/components/Link';
import {VoidProductCard} from '~/components/VoidProductCard';
import {VOID_COLLECTION_PATH, VOID_FEATURED_PRODUCTS} from '~/data/void-catalog';

type VoidCartSuggestionsProps = {
  count?: number;
  layout?: 'drawer' | 'page';
  onClose?: () => void;
};

export function VoidCartSuggestions({
  count = 4,
  layout = 'drawer',
  onClose,
}: VoidCartSuggestionsProps) {
  const items = VOID_FEATURED_PRODUCTS.slice(0, count);

  return (
    <div className="void-cart-suggestions">
      <Heading format size="copy" className="t-4">
        Core Collection
      </Heading>
      <div
        className={clsx(
          'void-cart-suggestions-grid mt-6 grid grid-cols-2 gap-x-4 gap-y-6',
          layout === 'page' && 'md:grid-cols-4',
        )}
      >
        {items.map((product, index) => (
          <VoidProductCard
            key={product.id}
            product={product}
            index={index}
            onNavigate={onClose}
            compact
          />
        ))}
      </div>
      <Link
        to={VOID_COLLECTION_PATH}
        prefetch="intent"
        onClick={onClose}
        className="void-pdp-back mt-8 inline-block font-sans text-fine uppercase"
      >
        View all pieces →
      </Link>
    </div>
  );
}
