import {Link} from '~/components/Link';
import {VOID_COLLECTION_PATH} from '~/data/void-catalog';

const JOURNAL_LEAD =
  'Field notes, process, and lookbooks. Editorial releases ship when the collection is ready — no filler, no noise.';

/**
 * VØID Journal — placeholder until Shopify blog content is live.
 */
export function VoidJournalPage() {
  return (
    <div className="void-journal w-full min-w-0 overflow-x-hidden">
      <div className="void-collection-top px-4 pt-6 sm:px-6 sm:pt-8 md:px-14 lg:px-20">
        <Link
          to="/"
          prefetch="intent"
          className="void-pdp-back inline-block min-h-11 py-2 font-sans text-fine uppercase"
        >
          ← Home
        </Link>
      </div>

      <section className="void-manifesto relative overflow-hidden border-t border-primary/[0.06]">
        <div className="void-manifesto-bg absolute inset-0" aria-hidden />

        <div className="relative mx-auto max-w-[88rem] px-4 py-20 sm:px-6 sm:py-28 md:px-14 md:py-40 lg:px-20 lg:py-48">
          <p className="void-eyebrow mb-8 sm:mb-10 md:mb-14">Journal</p>

          <div className="grid gap-12 sm:gap-16 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <h1 className="void-manifesto-quote">Editorial</h1>
            </div>

            <div className="flex flex-col justify-end gap-10 lg:col-span-7 lg:pl-8">
              <p className="void-manifesto-line">{JOURNAL_LEAD}</p>
              <p className="void-manifesto-closer">
                First drop: Core Collection — five pieces, one palette.
              </p>
              <Link
                to={VOID_COLLECTION_PATH}
                prefetch="intent"
                className="void-pdp-back inline-block min-h-11 py-2 font-sans text-fine uppercase"
              >
                View Core Collection →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
