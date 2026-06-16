import {useLocation, useRouteLoaderData} from '@remix-run/react';
import {useCallback, useRef} from 'react';
import clsx from 'clsx';
import type {CartBuyerIdentityInput} from '@shopify/hydrogen/storefront-api-types';
import {CartForm} from '@shopify/hydrogen';

import {Button} from '~/components/Button';
import {Heading} from '~/components/Text';
import {IconCheck} from '~/components/Icon';
import type {Locale} from '~/lib/type';
import {countries} from '~/data/countries';
import {DEFAULT_LOCALE} from '~/lib/utils';
import type {RootLoader} from '~/root';

export function CountrySelector() {
  const closeRef = useRef<HTMLDetailsElement>(null);
  const rootData = useRouteLoaderData<RootLoader>('root');
  const selectedLocale = rootData?.selectedLocale ?? DEFAULT_LOCALE;
  const {pathname, search} = useLocation();
  const pathWithoutLocale = `${pathname.replace(
    selectedLocale.pathPrefix,
    '',
  )}${search}`;

  const closeDropdown = useCallback(() => {
    closeRef.current?.removeAttribute('open');
  }, []);

  const currencyOptions = Object.entries(countries);

  return (
    <section
      className="void-country-selector relative z-20 grid w-full gap-4 overflow-visible"
      onMouseLeave={closeDropdown}
    >
      <Heading size="lead" className="cursor-default" as="h3">
        Currency
      </Heading>
      <div className="relative w-full">
        <details
          className="group relative w-full overflow-visible"
          ref={closeRef}
        >
          <summary className="void-country-selector-trigger flex w-full cursor-pointer list-none items-center justify-between rounded border border-primary/15 bg-primary/[0.03] px-4 py-3 font-sans text-sm text-primary/85 transition-colors hover:border-primary/25 [&::-webkit-details-marker]:hidden">
            {selectedLocale.label}
          </summary>
          <div className="void-country-selector-panel absolute bottom-full left-0 right-0 z-50 mb-2 max-h-[min(14rem,45vh)] w-full overflow-auto rounded border border-primary/15 bg-[#0a0a0a] shadow-[0_-8px_32px_rgb(0_0_0/0.55)]">
            {currencyOptions.map(([countryPath, countryLocale]) => {
              const isSelected =
                countryPath === 'default'
                  ? selectedLocale.pathPrefix === ''
                  : selectedLocale.pathPrefix === countryPath;

              const countryUrlPath = getCountryUrlPath({
                countryPath,
                pathWithoutLocale,
              });

              return (
                <Country
                  key={countryPath}
                  closeDropdown={closeDropdown}
                  countryUrlPath={countryUrlPath}
                  isSelected={isSelected}
                  countryLocale={countryLocale}
                />
              );
            })}
          </div>
        </details>
      </div>
    </section>
  );
}

function Country({
  closeDropdown,
  countryLocale,
  countryUrlPath,
  isSelected,
}: {
  closeDropdown: () => void;
  countryLocale: Locale;
  countryUrlPath: string;
  isSelected: boolean;
}) {
  return (
    <ChangeLocaleForm
      redirectTo={countryUrlPath}
      buyerIdentity={{
        countryCode: countryLocale.country,
      }}
    >
      <Button
        className={clsx([
          'text-contrast dark:text-primary',
          'bg-primary dark:bg-contrast w-full p-2 transition rounded flex justify-start',
          'items-center text-left cursor-pointer py-2 px-4',
        ])}
        type="submit"
        variant="primary"
        onClick={closeDropdown}
      >
        {countryLocale.label}
        {isSelected ? (
          <span className="ml-2">
            <IconCheck />
          </span>
        ) : null}
      </Button>
    </ChangeLocaleForm>
  );
}

function ChangeLocaleForm({
  children,
  buyerIdentity,
  redirectTo,
}: {
  children: React.ReactNode;
  buyerIdentity: CartBuyerIdentityInput;
  redirectTo: string;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.BuyerIdentityUpdate}
      inputs={{
        buyerIdentity,
      }}
    >
      <>
        <input type="hidden" name="redirectTo" value={redirectTo} />
        {children}
      </>
    </CartForm>
  );
}

function getCountryUrlPath({
  countryPath,
  pathWithoutLocale,
}: {
  countryPath: string;
  pathWithoutLocale: string;
}) {
  if (countryPath === 'default') {
    return pathWithoutLocale || '/';
  }

  return `${countryPath}${pathWithoutLocale || ''}`;
}
