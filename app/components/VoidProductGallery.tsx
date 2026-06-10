import {useCallback, useEffect, useRef, useState} from 'react';

import type {VoidGalleryImage} from '~/data/void-catalog';

type VoidProductGalleryProps = {
  images: VoidGalleryImage[];
};

const SWIPE_THRESHOLD_PX = 44;

function useHorizontalSwipe(
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  enabled: boolean,
) {
  const start = useRef<{x: number; y: number} | null>(null);
  const swiped = useRef(false);

  const onTouchStart = useCallback(
    (event: React.TouchEvent) => {
      if (!enabled || event.touches.length !== 1) return;
      const touch = event.touches[0];
      start.current = {x: touch.clientX, y: touch.clientY};
      swiped.current = false;
    },
    [enabled],
  );

  const onTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      if (!enabled || !start.current) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - start.current.x;
      const dy = touch.clientY - start.current.y;
      start.current = null;

      if (
        Math.abs(dx) >= SWIPE_THRESHOLD_PX &&
        Math.abs(dx) > Math.abs(dy) * 1.25
      ) {
        swiped.current = true;
        if (dx < 0) onSwipeLeft();
        else onSwipeRight();
      }
    },
    [enabled, onSwipeLeft, onSwipeRight],
  );

  const onTouchCancel = useCallback(() => {
    start.current = null;
  }, []);

  const consumeSwipe = useCallback(() => {
    const did = swiped.current;
    swiped.current = false;
    return did;
  }, []);

  return {onTouchStart, onTouchEnd, onTouchCancel, consumeSwipe};
}

export function VoidProductGallery({images}: VoidProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const count = images.length;
  const current = images[active] ?? images[0];

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActive((index + count) % count);
    },
    [count],
  );

  const goNext = useCallback(() => goTo(active + 1), [active, goTo]);
  const goPrev = useCallback(() => goTo(active - 1), [active, goTo]);

  const openLightbox = useCallback((index: number) => {
    setActive(index);
    setLightbox(true);
  }, []);

  const closeLightbox = useCallback(() => setLightbox(false), []);

  const canSwipe = count > 1;

  const mainSwipe = useHorizontalSwipe(goNext, goPrev, canSwipe);
  const lightboxSwipe = useHorizontalSwipe(goNext, goPrev, canSwipe && lightbox);

  useEffect(() => {
    if (!lightbox) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowRight') goNext();
      if (event.key === 'ArrowLeft') goPrev();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [lightbox, closeLightbox, goNext, goPrev]);

  if (!current) return null;

  return (
    <>
      <div className="void-pdp-gallery">
        <button
          type="button"
          className="void-pdp-gallery-main void-pdp-gallery-main--swipe relative aspect-[4/5] w-full touch-pan-y overflow-hidden sm:aspect-[3/4]"
          onClick={() => {
            if (mainSwipe.consumeSwipe()) return;
            openLightbox(active);
          }}
          onTouchStart={mainSwipe.onTouchStart}
          onTouchEnd={mainSwipe.onTouchEnd}
          onTouchCancel={mainSwipe.onTouchCancel}
          aria-label={`Product image ${active + 1} of ${count}. Swipe left or right to change.`}
        >
          {images.map((image, index) => (
            <img
              key={image.id}
              src={image.src}
              alt={image.alt}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              draggable={false}
              style={{objectPosition: image.position}}
              className={`void-pdp-gallery-photo pointer-events-none absolute inset-0 h-full w-full select-none object-cover transition-opacity duration-500 ${
                index === active ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          {canSwipe && (
            <span
              className="void-pdp-gallery-swipe-hint font-sans text-fine uppercase sm:hidden"
              aria-hidden
            >
              Swipe
            </span>
          )}
          <span className="void-pdp-gallery-expand pointer-events-none font-sans text-fine uppercase">
            View
          </span>
          <span className="void-pdp-gallery-index pointer-events-none font-sans text-fine uppercase">
            {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
        </button>

        {canSwipe && (
          <ul className="void-pdp-gallery-thumbs mt-3 flex gap-2 overflow-x-auto overscroll-x-contain pb-1 [-webkit-overflow-scrolling:touch] sm:mt-4 sm:grid sm:grid-cols-3 sm:overflow-visible md:mt-5 md:grid-cols-6 md:gap-2.5">
            {images.map((image, index) => (
              <li
                key={image.id}
                className="w-[4.75rem] shrink-0 snap-start sm:w-auto"
              >
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  onDoubleClick={() => openLightbox(index)}
                  className={`void-pdp-gallery-thumb relative aspect-[3/4] h-full w-full overflow-hidden ${
                    index === active ? 'void-pdp-gallery-thumb--active' : ''
                  }`}
                  aria-label={image.alt}
                  aria-current={index === active}
                >
                  <img
                    src={image.src}
                    alt=""
                    loading="lazy"
                    draggable={false}
                    style={{
                      objectPosition: image.thumbPosition ?? image.position,
                    }}
                    className="void-pdp-gallery-thumb-img absolute inset-0 h-full w-full object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {lightbox && (
        <div
          className="void-lightbox px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 sm:py-6"
          role="dialog"
          aria-modal="true"
          aria-label="Product gallery lightbox"
        >
          <button
            type="button"
            className="void-lightbox-backdrop"
            onClick={closeLightbox}
            aria-label="Close gallery"
          />

          <div className="void-lightbox-inner">
            <button
              type="button"
              className="void-lightbox-close void-lightbox-close--mobile font-sans text-fine uppercase"
              onClick={closeLightbox}
            >
              Close
            </button>

            <button
              type="button"
              className="void-lightbox-nav void-lightbox-nav--prev"
              onClick={goPrev}
              aria-label="Previous image"
            >
              ←
            </button>

            <figure
              className="void-lightbox-figure void-lightbox-figure--swipe touch-pan-y"
              onTouchStart={lightboxSwipe.onTouchStart}
              onTouchEnd={lightboxSwipe.onTouchEnd}
              onTouchCancel={lightboxSwipe.onTouchCancel}
            >
              <img
                src={current.src}
                alt={current.alt}
                draggable={false}
                style={{objectPosition: current.position}}
                className="void-lightbox-image max-h-[85vh] w-auto max-w-full select-none object-contain"
              />
              <figcaption className="void-lightbox-caption font-sans text-fine uppercase">
                {current.alt}
              </figcaption>
            </figure>

            <button
              type="button"
              className="void-lightbox-nav void-lightbox-nav--next"
              onClick={goNext}
              aria-label="Next image"
            >
              →
            </button>

            <p className="void-lightbox-counter font-sans text-fine uppercase">
              {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </p>

            <ul className="void-lightbox-thumbs">
              {images.map((image, index) => (
                <li key={`lb-${image.id}`}>
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    className={`void-lightbox-thumb ${
                      index === active ? 'void-lightbox-thumb--active' : ''
                    }`}
                    aria-label={image.alt}
                    aria-current={index === active}
                  >
                    <img src={image.src} alt="" loading="lazy" draggable={false} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
