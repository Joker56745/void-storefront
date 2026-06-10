import type {
  ChildEnhancedMenuItem,
  EnhancedMenu,
  ParentEnhancedMenuItem,
} from '~/lib/utils';

import {VOID_COLLECTION_PATH} from '~/data/void-catalog';

function navItem(title: string, to: string): ParentEnhancedMenuItem {
  return {
    id: `void-fallback-${title.toLowerCase().replace(/\s+/g, '-')}`,
    title,
    to,
    target: '',
    url: to,
    type: 'HTTP',
    resourceId: null,
    tags: [],
    items: [],
  } as ParentEnhancedMenuItem;
}

function footerChild(title: string, to: string): ChildEnhancedMenuItem {
  const item = navItem(title, to);
  return item as unknown as ChildEnhancedMenuItem;
}

function footerSection(
  title: string,
  links: {title: string; to: string}[],
): ParentEnhancedMenuItem {
  return {
    ...navItem(title, links[0]?.to ?? '#'),
    id: `void-footer-${title.toLowerCase().replace(/\s+/g, '-')}`,
    title,
    items: links.map((link) => footerChild(link.title, link.to)),
  };
}

/** Used when Storefront API cannot read Admin menus (missing scopes or empty navigation). */
export const VOID_FALLBACK_HEADER_MENU: EnhancedMenu = {
  id: 'void-fallback-header',
  items: [
    navItem('Collections', VOID_COLLECTION_PATH),
    navItem('Products', VOID_COLLECTION_PATH),
    navItem('Journal', '/journal'),
  ],
};

/** Footer links when Shopify `footer` menu is missing or empty. */
export const VOID_FALLBACK_FOOTER_MENU: EnhancedMenu = {
  id: 'void-fallback-footer',
  items: [
    footerSection('Shop', [
      {title: 'Core Collection', to: VOID_COLLECTION_PATH},
      {title: 'Search', to: '/search'},
      {title: 'Journal', to: '/journal'},
    ]),
    footerSection('Company', [{title: 'Journal', to: '/journal'}]),
    footerSection('Legal', [
      {title: 'Privacy Policy', to: '/policies/privacy-policy'},
      {title: 'Terms of Service', to: '/policies/terms-of-service'},
      {title: 'Refund Policy', to: '/policies/refund-policy'},
    ]),
  ],
};

export function resolveVoidFooterMenu(
  menu: EnhancedMenu | null | undefined,
): EnhancedMenu {
  return menu?.items?.length ? menu : VOID_FALLBACK_FOOTER_MENU;
}
