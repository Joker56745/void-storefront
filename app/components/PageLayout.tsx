import {useParams, Form, Await, useRouteLoaderData} from '@remix-run/react';
import {Disclosure} from '@headlessui/react';
import {Suspense, useEffect, useMemo} from 'react';
import {CartForm} from '@shopify/hydrogen';

import {type LayoutQuery} from 'storefrontapi.generated';
import {
  VOID_FALLBACK_HEADER_MENU,
  resolveVoidFooterMenu,
} from '~/data/void-nav-fallback';
import {BRAND_NAME} from '~/lib/brand';
import {Text, Heading, Section} from '~/components/Text';
import {Link} from '~/components/Link';
import {Cart} from '~/components/Cart';
import {CartLoading} from '~/components/CartLoading';
import {Input} from '~/components/Input';
import {VoidSearchField} from '~/components/VoidSearchField';
import {Drawer, useDrawer} from '~/components/Drawer';
import {CountrySelector} from '~/components/CountrySelector';
import {
  IconMenu,
  IconCaret,
  IconLogin,
  IconAccount,
  IconBag,
  IconSearch,
} from '~/components/Icon';
import {
  type EnhancedMenu,
  type ChildEnhancedMenuItem,
  useIsHomePath,
} from '~/lib/utils';
import {useIsHydrated} from '~/hooks/useIsHydrated';
import {useCartFetchers} from '~/hooks/useCartFetchers';
import type {RootLoader} from '~/root';

type LayoutProps = {
  children: React.ReactNode;
  layout?: LayoutQuery & {
    headerMenu?: EnhancedMenu | null;
    footerMenu?: EnhancedMenu | null;
  };
};

export function PageLayout({children, layout}: LayoutProps) {
  const {headerMenu, footerMenu} = layout || {};
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        <Header
          title={BRAND_NAME}
          menu={headerMenu ?? VOID_FALLBACK_HEADER_MENU}
        />
        <main role="main" id="mainContent" className="flex-grow">
          {children}
        </main>
        <Footer menu={resolveVoidFooterMenu(footerMenu)} />
      </div>
    </>
  );
}

function Header({title, menu}: {title: string; menu?: EnhancedMenu}) {
  const isHome = useIsHomePath();

  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);

  // toggle cart drawer when adding to cart
  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      {menu && (
        <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={menu} />
      )}
      <DesktopHeader
        isHome={isHome}
        title={title}
        menu={menu}
        openCart={openCart}
      />
      <MobileHeader
        isHome={isHome}
        title={title}
        openCart={openCart}
        openMenu={openMenu}
      />
    </>
  );
}

function CartDrawer({isOpen, onClose}: {isOpen: boolean; onClose: () => void}) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  if (!rootData) return null;

  return (
    <Drawer open={isOpen} onClose={onClose} heading="Cart" openFrom="right">
      <div className="grid">
        <Suspense fallback={<CartLoading />}>
          <Await resolve={rootData?.cart}>
            {(cart) => <Cart layout="drawer" onClose={onClose} cart={cart} />}
          </Await>
        </Suspense>
      </div>
    </Drawer>
  );
}

export function MenuDrawer({
  isOpen,
  onClose,
  menu,
}: {
  isOpen: boolean;
  onClose: () => void;
  menu: EnhancedMenu;
}) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom="left" heading="Menu">
      <div className="grid">
        <MenuMobileNav menu={menu} onClose={onClose} />
      </div>
    </Drawer>
  );
}

function MenuMobileNav({
  menu,
  onClose,
}: {
  menu: EnhancedMenu;
  onClose: () => void;
}) {
  return (
    <nav className="grid gap-5 p-6 sm:gap-6 sm:px-12 sm:py-10">
      {(menu?.items || []).map((item) => (
        <span key={item.id} className="block">
          <Link
            to={item.to}
            target={item.target}
            onClick={onClose}
            className={({isActive}) =>
              isActive
                ? 'void-nav-link void-nav-link--drawer text-primary border-b border-accent pb-1 -mb-px'
                : 'void-nav-link void-nav-link--drawer pb-1'
            }
          >
            {item.title}
          </Link>
        </span>
      ))}
    </nav>
  );
}

function BrandMark({
  title,
  as = 'span',
}: {
  title: string;
  as?: 'h1' | 'h2' | 'span';
}) {
  const Tag = as;
  return (
    <Tag className="void-brand leading-none select-none">{title}</Tag>
  );
}

function MobileHeader({
  title,
  isHome,
  openCart,
  openMenu,
}: {
  title: string;
  isHome: boolean;
  openCart: () => void;
  openMenu: () => void;
}) {
  const params = useParams();

  return (
    <header
      role="banner"
      className="void-header void-header--mobile flex lg:hidden items-center h-nav sticky z-40 top-0 justify-between w-full leading-none gap-2 px-4 sm:gap-3 sm:px-6 md:px-8"
    >
      <div className="flex min-w-[2.75rem] items-center justify-start">
        <button
          type="button"
          onClick={openMenu}
          aria-label="Open menu"
          className="flex h-11 w-11 items-center justify-center text-primary/70 transition-colors hover:text-primary active:text-primary"
        >
          <IconMenu />
        </button>
      </div>

      <Link
        className="absolute left-1/2 flex max-w-[52vw] -translate-x-1/2 items-center justify-center sm:max-w-none"
        to="/"
        prefetch="intent"
      >
        <BrandMark title={title} as={isHome ? 'h1' : 'h2'} />
      </Link>

      <div className="flex min-w-[10.5rem] items-center justify-end gap-0.5 sm:gap-1">
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="hidden"
        >
          <Input type="search" variant="minisearch" placeholder="Search" name="q" />
        </Form>
        <Link
          to={params.locale ? `/${params.locale}/search` : '/search'}
          prefetch="intent"
          aria-label="Search"
          className="void-header-icon-btn"
        >
          <IconSearch className="void-header-icon" />
        </Link>
        <AccountLink className="void-header-icon-btn" />
        <CartCount openCart={openCart} />
      </div>
    </header>
  );
}

function DesktopHeader({
  isHome,
  menu,
  openCart,
  title,
}: {
  isHome: boolean;
  openCart: () => void;
  menu?: EnhancedMenu;
  title: string;
}) {
  const params = useParams();
  return (
    <header
      role="banner"
      className="void-header hidden h-nav lg:flex items-center sticky z-40 top-0 justify-between w-full leading-none px-10 xl:px-14"
    >
      <Link to="/" prefetch="intent" className="shrink-0">
        <BrandMark title={title} as={isHome ? 'h1' : 'h2'} />
      </Link>

      <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-12 xl:gap-14">
        {(menu?.items || []).map((item) => (
          <Link
            key={item.id}
            to={item.to}
            target={item.target}
            prefetch="intent"
            className={({isActive}) =>
              isActive
                ? 'void-nav-link text-primary border-b border-accent pb-0.5 -mb-0.5'
                : 'void-nav-link'
            }
          >
            {item.title}
          </Link>
        ))}
      </nav>

      <div className="void-header-utilities flex shrink-0 items-center gap-1.5 xl:gap-3">
        <div className="void-header-search w-40 xl:w-48">
          <VoidSearchField
            placeholder="Search"
            variant="minisearch"
            panelMode="overlay"
            syncUrl={false}
            inputClassName="void-header-search-input focus:border-accent/40 w-full border-primary/15 bg-transparent text-left"
          />
        </div>
        <AccountLink className="void-header-icon-btn" />
        <CartCount openCart={openCart} />
      </div>
    </header>
  );
}

function AccountLink({className}: {className?: string}) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const isLoggedIn = rootData?.isLoggedIn;

  return (
    <Link to="/account" className={className}>
      <Suspense fallback={<IconLogin className="void-header-icon-action" />}>
        <Await
          resolve={isLoggedIn}
          errorElement={<IconLogin className="void-header-icon-action" />}
        >
          {(isLoggedIn) =>
            isLoggedIn ? (
              <IconAccount className="void-header-icon-action" />
            ) : (
              <IconLogin className="void-header-icon-action" />
            )
          }
        </Await>
      </Suspense>
    </Link>
  );
}

function CartCount({openCart}: {openCart: () => void}) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  if (!rootData) return null;

  return (
    <Suspense fallback={<Badge count={0} openCart={openCart} />}>
      <Await resolve={rootData?.cart}>
        {(cart) => (
          <Badge openCart={openCart} count={cart?.totalQuantity || 0} />
        )}
      </Await>
    </Suspense>
  );
}

function Badge({
  openCart,
  count,
}: {
  count: number;
  openCart: () => void;
}) {
  const isHydrated = useIsHydrated();

  const BadgeCounter = useMemo(
    () => (
      <>
        <IconBag className="void-header-icon-action" />
        {count > 0 && (
          <div className="void-header-cart-count" aria-hidden>
            <span>{count}</span>
          </div>
        )}
      </>
    ),
    [count],
  );

  const className = 'void-header-icon-btn relative';

  return isHydrated ? (
    <button type="button" onClick={openCart} aria-label="Cart" className={className}>
      {BadgeCounter}
    </button>
  ) : (
    <Link to="/cart" aria-label="Cart" className={className}>
      {BadgeCounter}
    </Link>
  );
}

function Footer({menu}: {menu?: EnhancedMenu}) {
  const isHome = useIsHomePath();
  const itemsCount = menu
    ? menu?.items?.length + 1 > 4
      ? 4
      : menu?.items?.length + 1
    : [];

  return (
    <Section
      divider={isHome ? 'none' : 'top'}
      as="footer"
      role="contentinfo"
      className={`grid items-start grid-flow-row w-full gap-6 px-6 md:px-8 lg:px-12 md:gap-8 lg:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-${itemsCount}
        bg-surface text-primary/70 border-t border-primary/[0.06] overflow-visible
        ${isHome ? 'void-footer-home py-10 md:py-12' : 'min-h-[25rem] py-8'}`}
    >
      <FooterMenu menu={menu} />
      <CountrySelector />
      <div
        className={`self-end pt-8 opacity-50 md:col-span-2 lg:col-span-${itemsCount}`}
      >
        &copy; {new Date().getFullYear()} {BRAND_NAME}
      </div>
    </Section>
  );
}

function FooterLink({item}: {item: ChildEnhancedMenuItem}) {
  if (item.to.startsWith('http')) {
    return (
      <a href={item.to} target={item.target} rel="noopener noreferrer">
        {item.title}
      </a>
    );
  }

  return (
    <Link to={item.to} target={item.target} prefetch="intent">
      {item.title}
    </Link>
  );
}

function FooterMenu({menu}: {menu?: EnhancedMenu}) {
  const styles = {
    section: 'grid gap-4',
    nav: 'grid gap-2 pb-6',
  };

  return (
    <>
      {(menu?.items || []).map((item) => (
        <section key={item.id} className={styles.section}>
          <Disclosure>
            {({open}) => (
              <>
                <Disclosure.Button className="text-left md:cursor-default">
                  <Heading className="flex justify-between" size="lead" as="h3">
                    {item.title}
                    {item?.items?.length > 0 && (
                      <span className="md:hidden">
                        <IconCaret direction={open ? 'up' : 'down'} />
                      </span>
                    )}
                  </Heading>
                </Disclosure.Button>
                {item?.items?.length > 0 ? (
                  <div
                    className={`${
                      open ? `max-h-48 h-fit` : `max-h-0 md:max-h-fit`
                    } overflow-hidden transition-all duration-300`}
                  >
                    <Suspense data-comment="This suspense fixes a hydration bug in Disclosure.Panel with static prop">
                      <Disclosure.Panel static>
                        <nav className={styles.nav}>
                          {item.items.map((subItem: ChildEnhancedMenuItem) => (
                            <FooterLink key={subItem.id} item={subItem} />
                          ))}
                        </nav>
                      </Disclosure.Panel>
                    </Suspense>
                  </div>
                ) : null}
              </>
            )}
          </Disclosure>
        </section>
      ))}
    </>
  );
}
