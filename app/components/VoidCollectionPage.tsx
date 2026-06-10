import {Link} from '~/components/Link';
import {FeaturedProductsGrid} from '~/components/FeaturedProductsGrid';
import {
  VOID_COLLECTION_LEAD,
  VOID_COLLECTION_TITLE,
  VOID_PRODUCTS,
} from '~/data/void-catalog';

/**
 * Full Core Collection listing — all VØID editorial products.
 */
export function VoidCollectionPage() {
  return (
    <div className="void-collection w-full min-w-0 overflow-x-hidden">
      <div className="void-collection-top px-4 pt-6 sm:px-6 sm:pt-8 md:px-14 lg:px-20">
        <Link
          to="/"
          prefetch="intent"
          className="void-pdp-back inline-block min-h-11 py-2 font-sans text-fine uppercase"
        >
          ← Home
        </Link>
      </div>

      <FeaturedProductsGrid
        variant="page"
        title={VOID_COLLECTION_TITLE}
        lead={VOID_COLLECTION_LEAD}
        products={VOID_PRODUCTS}
      />
    </div>
  );
}
