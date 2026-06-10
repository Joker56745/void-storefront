import {BRAND_NAME} from '~/lib/brand';

const MANIFESTO_LINES = [
  'We do not decorate the body.',
  'We arm it for silence, weight, and shadow.',
];

const MANIFESTO_CLOSER =
  'No spectacle. No logo. Only proportion, material, and the void between seams.';

/**
 * Philosophy block — laconic Rick Owens register.
 */
export function Manifesto() {
  return (
    <section
      className="void-manifesto relative overflow-hidden border-t border-primary/[0.06]"
      aria-labelledby="manifesto-heading"
    >
      <div className="void-manifesto-bg absolute inset-0" aria-hidden />

      <div className="relative mx-auto max-w-[88rem] px-4 py-20 sm:px-6 sm:py-28 md:px-14 md:py-40 lg:px-20 lg:py-48">
        <p className="void-eyebrow mb-8 sm:mb-10 md:mb-14">Manifesto</p>

        <div className="grid gap-12 sm:gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 id="manifesto-heading" className="void-manifesto-quote">
              Built
              <br />
              for the
              <br />
              void.
            </h2>
          </div>

          <div className="flex flex-col justify-end gap-10 lg:col-span-7 lg:pl-8">
            {MANIFESTO_LINES.map((line) => (
              <p key={line} className="void-manifesto-line">
                {line}
              </p>
            ))}
            <p className="void-manifesto-closer">{MANIFESTO_CLOSER}</p>
            <p className="void-manifesto-sign">{BRAND_NAME}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
