import {useState} from 'react';

import {Link} from '~/components/Link';
import {VoidProductCard} from '~/components/VoidProductCard';
import {VoidSearchField} from '~/components/VoidSearchField';
import {VOID_COLLECTION_PATH, VOID_FEATURED_PRODUCTS} from '~/data/void-catalog';

type VoidLiveSearchProps = {
  initialQuery?: string;
};

export function VoidLiveSearch({initialQuery = ''}: VoidLiveSearchProps) {
  const [showBrowseAll, setShowBrowseAll] = useState(!initialQuery.trim());

  return (
    <>
      <div className="void-collection-top border-b border-primary/[0.06] px-4 pb-8 pt-6 sm:px-6 sm:pt-8 md:px-14 lg:px-20">
        <Link
          to="/"
          prefetch="intent"
          className="void-pdp-back inline-block min-h-11 py-2 font-sans text-fine uppercase"
        >
          ← Home
        </Link>

        <h1 className="void-heading void-heading--page mt-8">Search</h1>

        <div className="mt-8 w-full max-w-xl">
          <VoidSearchField
            initialQuery={initialQuery}
            syncUrl
            onQueryChange={(value) => setShowBrowseAll(!value.trim())}
          />
        </div>
      </div>

      {showBrowseAll && (
        <section
          className="void-featured px-4 py-16 sm:px-6 sm:py-24 md:px-14 lg:px-20"
          aria-labelledby="void-search-suggestions"
        >
          <p className="void-eyebrow void-eyebrow--featured mb-4 sm:mb-5">
            Core Collection
          </p>
          <h2
            id="void-search-suggestions"
            className="void-heading void-heading--large mb-10 sm:mb-16"
          >
            Start with the collection
          </h2>
          <div className="void-featured-grid">
            {VOID_FEATURED_PRODUCTS.map((product, index) => (
              <VoidProductCard
                key={product.id}
                product={product}
                index={index}
                loading={index < 2 ? 'eager' : 'lazy'}
              />
            ))}
          </div>
          <Link
            to={VOID_COLLECTION_PATH}
            prefetch="intent"
            className="void-pdp-back mt-12 inline-block min-h-11 py-2 font-sans text-fine uppercase"
          >
            View Core Collection →
          </Link>
        </section>
      )}
    </>
  );
}
