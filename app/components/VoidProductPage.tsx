import {useState} from 'react';

import {Link} from '~/components/Link';
import {VoidPdpCart} from '~/components/VoidPdpCart';
import {VoidProductGallery} from '~/components/VoidProductGallery';
import {VoidProductCard} from '~/components/VoidProductCard';
import type {VoidProductDetail} from '~/data/void-catalog';
import {
  getRelatedVoidProducts,
  VOID_COLLECTION_PATH,
} from '~/data/void-catalog';
import type {VoidShopifyVariant} from '~/lib/void-shopify';

type VoidProductPageProps = {
  product: VoidProductDetail;
  shopifyVariants: VoidShopifyVariant[];
};

export function VoidProductPage({
  product,
  shopifyVariants,
}: VoidProductPageProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const related = getRelatedVoidProducts(product.slug);
  const canAdd = selectedSize !== null;

  return (
    <div className="void-pdp w-full min-w-0 overflow-x-hidden pb-24 lg:pb-0">
      <div className="void-pdp-breadcrumb px-4 pt-5 sm:px-6 sm:pt-8 md:px-14 lg:px-20">
        <Link
          to={VOID_COLLECTION_PATH}
          prefetch="intent"
          className="void-pdp-back inline-block min-h-11 py-2 font-sans text-fine uppercase"
        >
          ← Core Collection
        </Link>
      </div>

      <div className="void-pdp-grid px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-10 md:px-14 md:pb-28 lg:px-20 lg:pb-36">
        <div className="void-pdp-media min-w-0">
          <VoidProductGallery images={product.gallery} />
        </div>

        <div className="void-pdp-buy min-w-0">
          <div className="void-pdp-buy-sticky">
            <p className="void-eyebrow void-eyebrow--pdp mb-4 sm:mb-6">
              Core Collection
            </p>

            <h1 className="void-pdp-title">{product.title}</h1>

            <p className="void-pdp-price mt-4 sm:mt-6">{product.price}</p>

            <p className="void-pdp-lead mt-6 sm:mt-8">{product.longDescription}</p>

            <p className="void-pdp-material mt-4 sm:mt-6">{product.material}</p>

            <div className="void-pdp-size mt-8 sm:mt-12">
              <div className="void-pdp-size-head">
                <span className="void-pdp-size-label font-sans uppercase">
                  Size
                </span>
                <span className="void-pdp-size-hint font-sans uppercase">
                  {selectedSize ? `Selected · ${selectedSize}` : 'Select'}
                </span>
              </div>
              <div
                className="void-pdp-size-grid mt-5 sm:mt-6"
                role="listbox"
                aria-label="Size"
              >
                {product.sizes.map((size) => {
                  const selected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => setSelectedSize(size)}
                      className={`void-pdp-size-btn font-sans uppercase ${
                        selected ? 'void-pdp-size-btn--active' : ''
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="void-pdp-cart-wrap mt-8 hidden sm:mt-10 lg:block">
              <VoidPdpCart
                product={product}
                selectedSize={selectedSize}
                shopifyVariants={shopifyVariants}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="void-pdp-specs px-4 pb-20 sm:px-6 sm:pb-24 md:px-14 lg:px-20">
        <div className="void-pdp-specs-grid">
          <section className="void-pdp-panel" aria-labelledby="void-pdp-details">
            <h2 id="void-pdp-details" className="void-pdp-panel-title">
              Details
            </h2>
            <ul className="void-pdp-list mt-6 sm:mt-8">
              {product.details.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>

          <section
            className="void-pdp-panel"
            aria-labelledby="void-pdp-technical"
          >
            <h2 id="void-pdp-technical" className="void-pdp-panel-title">
              Technical Specifications
            </h2>
            <dl className="void-pdp-spec-table mt-6 sm:mt-8">
              {product.specs.map((row) => (
                <div key={row.label} className="void-pdp-spec-row">
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>

      {related.length > 0 && (
        <section
          className="void-pdp-related border-t border-primary/[0.06] px-4 py-16 sm:px-6 sm:py-24 md:px-14 md:py-32 lg:px-20"
          aria-labelledby="void-pdp-related-heading"
        >
          <p className="void-eyebrow void-eyebrow--featured mb-4 sm:mb-5">
            Continue
          </p>
          <h2
            id="void-pdp-related-heading"
            className="void-heading void-heading--large mb-10 sm:mb-16"
          >
            Related Pieces
          </h2>
          <div className="void-featured-grid void-pdp-related-grid">
            {related.map((item, index) => (
              <VoidProductCard
                key={item.id}
                product={item}
                index={index}
                loading="lazy"
              />
            ))}
          </div>
        </section>
      )}

      <div
        className="void-pdp-mobile-bar fixed inset-x-0 bottom-0 z-30 border-t border-primary/[0.08] bg-surface/95 px-4 py-3 backdrop-blur-md sm:px-6 lg:hidden"
        style={{paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))'}}
      >
        <div className="mx-auto flex max-w-lg flex-col gap-2">
          {!canAdd && (
            <p className="void-pdp-cart-note text-center font-sans text-fine uppercase">
              Select size to continue
            </p>
          )}
          <VoidPdpCart
            product={product}
            selectedSize={selectedSize}
            shopifyVariants={shopifyVariants}
            className="void-pdp-cart--mobile"
          />
        </div>
      </div>
    </div>
  );
}
