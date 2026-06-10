import type {VoidPlaceholderProduct} from '~/data/void-catalog';
import {
  VOID_COLLECTION_LEAD,
  VOID_COLLECTION_TITLE,
  VOID_FEATURED_PRODUCTS,
} from '~/data/void-catalog';
import {VoidProductCard} from '~/components/VoidProductCard';

type FeaturedProductsGridProps = {
  title?: string;
  lead?: string;
  products?: VoidPlaceholderProduct[];
  /** Homepage section (h2) vs dedicated collection page (h1) */
  variant?: 'section' | 'page';
};

export function FeaturedProductsGrid({
  title = VOID_COLLECTION_TITLE,
  lead = VOID_COLLECTION_LEAD,
  products = VOID_FEATURED_PRODUCTS,
  variant = 'section',
}: FeaturedProductsGridProps) {
  const isPage = variant === 'page';
  const headingId = isPage ? 'collection-heading' : 'featured-heading';
  const HeadingTag = isPage ? 'h1' : 'h2';

  return (
    <section
      className={`void-featured relative px-4 sm:px-6 md:px-14 lg:px-20 ${
        isPage ? 'pb-20 pt-4 sm:pb-28 sm:pt-6 md:pb-36 md:pt-8' : 'py-20 sm:py-28 md:py-40 lg:py-48'
      }`}
      aria-labelledby={headingId}
    >
      <div className="void-featured-film pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative z-[1] mx-auto max-w-[104rem]">
        <header
          className={`void-featured-header ${isPage ? 'mb-10 sm:mb-16' : 'mb-12 sm:mb-20 md:mb-28'}`}
        >
          <div className="void-featured-rule mb-6 sm:mb-8" aria-hidden />
          <p className="void-eyebrow void-eyebrow--featured mb-4 sm:mb-5">
            {isPage ? 'Collection' : 'Selection'}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-6">
            <HeadingTag
              id={headingId}
              className={`void-heading void-heading--large ${
                isPage ? 'void-heading--page' : ''
              }`}
            >
              {title}
            </HeadingTag>
            <p className="void-featured-count shrink-0">
              {String(products.length).padStart(2, '0')} Pieces · Dark Techwear
            </p>
          </div>
          <p className="void-featured-lead mt-6 max-w-xl sm:mt-8">{lead}</p>
        </header>

        <div className="void-featured-grid">
          {products.map((product, index) => (
            <VoidProductCard
              key={product.id}
              product={product}
              index={index}
              loading={index < 2 ? 'eager' : 'lazy'}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
