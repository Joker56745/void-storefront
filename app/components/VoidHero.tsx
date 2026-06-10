import {Button} from '~/components/Button';
import {BRAND_NAME} from '~/lib/brand';
import {VOID_COLLECTION_PATH, VOID_HERO_IMAGE} from '~/data/void-catalog';

/**
 * Fullscreen hero — pinned while the hero section is in view (no scroll drift).
 */
export function VoidHero() {
  return (
    <section
      className="void-hero relative -mt-nav"
      aria-label="Hero"
    >
      <div className="void-hero-pin">
        <div className="void-hero-media absolute inset-0" aria-hidden>
          <div className="void-hero-bg absolute inset-0" />
          <img
            src={VOID_HERO_IMAGE}
            alt=""
            className="void-hero-figure absolute inset-0 h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="void-hero-scrim absolute inset-0" />
          <div className="void-hero-vignette absolute inset-0" />
          <div className="void-hero-grain absolute inset-0" />
        </div>

        <div className="void-hero-frame relative h-full w-full">
          <header className="void-hero-top absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-6 sm:px-6 sm:pt-8 md:px-14 md:pt-32 lg:px-20">
            <p className="void-hero-eyebrow">Fall / Winter — 01</p>
            <p className="void-hero-scroll md:block">
              Scroll
            </p>
          </header>

          <div className="void-hero-inner absolute inset-x-0 bottom-0 z-10 mx-auto w-full max-w-[104rem] px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-20 md:px-14 md:pb-24 lg:px-20 lg:pb-28">
            <div className="void-hero-title-wrap">
              <h1 className="void-hero-title" aria-label={BRAND_NAME}>
                <span className="void-hero-title-text">{BRAND_NAME}</span>
              </h1>
              <div className="void-hero-title-rule" aria-hidden />
            </div>

            <p className="void-hero-subtitle mt-8 max-w-[20rem] sm:mt-10 sm:max-w-xl md:mt-14 lg:max-w-2xl">
              Brutalist silhouettes. Technical layering. Designed for the
              underground.
            </p>

            <div className="void-hero-actions mt-10 flex flex-col gap-6 sm:mt-14 sm:flex-row sm:items-center sm:gap-8 md:mt-16">
              <Button
                variant="void"
                to={VOID_COLLECTION_PATH}
                prefetch="intent"
                className="void-cta void-cta--hero w-full sm:w-auto"
              >
                EXPLORE COLLECTION
              </Button>
              <span className="void-hero-coord uppercase sm:shrink-0">
                52.52° N · 13.40° E
              </span>
            </div>
          </div>

          <div className="void-hero-index hidden lg:flex" aria-hidden>
            <span>001</span>
            <span className="void-hero-index-line" />
            <span>VOID</span>
          </div>

          <div className="void-hero-bottom absolute inset-x-0 bottom-0 z-10 hidden px-4 pb-6 sm:block sm:px-6 md:px-14 lg:px-20">
            <div className="void-hero-bottom-rule" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
