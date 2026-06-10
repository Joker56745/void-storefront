# VØID — Hydrogen demo storefront

Референс-витрина для показа клиентам: **headless Shopify (Hydrogen + Remix)** с editorial UI, без темы Dawn. Каталог на демо — статический; один PDP подключён к реальной корзине preview-стора.

## Быстрый старт

```bash
npm install
cp .env.example .env
# Заполните .env через Shopify CLI или Hydrogen link
npm run dev
```

Локально в сети (телефон): `npm run dev:host` → `http://<ваш-LAN-IP>:3000`

## Что показать клиенту (60 сек)

1. **Home** — hero, бренд VØID  
2. **Core Collection** — `/collections/core` (5 editorial карточек)  
3. **PDP** — любой `/void/shell-jacket` … галерея, размеры, specs  
4. **Живой checkout** — любой `/void/...` → размер → **Add to Cart** → drawer → checkout (Hydrogen preview)  
5. **Поиск** — `/search`, ввод `tee` / `hoodie`, превью с фото под полем  

## Стек

| Слой | Технология |
|------|------------|
| Фронт | Hydrogen 2024+, Remix, React |
| Стили | Tailwind + `app/styles/app.css` (VØID tokens) |
| Каталог (демо) | `app/data/void-catalog.ts` |
| Shopify | Storefront API, Cart, Checkout |
| Деплой | Oxygen (по умолчанию в шаблоне) |

## Что кастом (не из коробки Hydrogen)

- Бренд **VØID** — тёмный luxury techwear UI  
- Статический **Core Collection** + маршруты `/void/:slug`  
- Редиректы с демо-сноубордов: `/products`, `/collections`, `/journal`  
- **Живой поиск** по локальному каталогу (`VoidSearchField`)  
- **SEO**: og:image, Product / Collection JSON-LD (`app/lib/seo.server.ts`)  
- **Live cart** на всех PDP Core Collection (маппинг на preview-каталог Shopify)  

## Демо-корзина (Shopify)

| Файл | Назначение |
|------|------------|
| `app/data/void-shopify-demo.ts` | Slug → Shopify handle (все 5 PDP) |
| `app/lib/void-shopify.server.ts` | Загрузка variants из Storefront API |
| `app/lib/void-shopify.ts` | Сопоставление размера editorial → variant |
| `app/components/VoidPdpCart.tsx` | CartForm + line attributes |

Маппинг на hydrogen-preview (смените в `VOID_SHOPIFY_BY_SLUG`):

| Editorial slug | Shopify handle |
|----------------|----------------|
| `shell-jacket` | `the-apex` |
| `heavy-hoodie` | `the-ascend` |
| `cargo-pant` | `the-atlas` |
| `combat-boot` | `the-blaze-x` |
| `black-tee` | `the-carbon` |

В корзину уходит реальный variant (preview SKU); в attributes — название VØID, размер и slug. **В drawer** показываются editorial фото и название; на **Shopify Checkout** всё ещё будет preview-товар, пока в Admin нет реальных SKU клиента.

### Подключить магазин клиента

1. Создайте товары в Admin с handles как `slug` (или обновите `VOID_SHOPIFY_BY_SLUG`).  
2. Варианты с опцией **Size** и значениями как на PDP.  
3. Валидный `.env` + `npm run dev`.

## Клон под клиента (чеклист)

1. `npx shopify hydrogen link` — новый shop  
2. Заменить бренд: `app/lib/brand.ts`, лого, `public/images/void/`  
3. Каталог: либо расширить `void-catalog.ts`, либо перевести на Storefront `products` / `collection(handle:)`  
4. Подключить **все** PDP к variants (паттерн как `VoidPdpCart` + loader)  
5. Меню в Admin → `main-menu` / `footer`  
6. Домен, Oxygen env, аналитика  

Ориентир по срокам для питча: **1–2 недели** типовой каталог + дизайн; **3–4 недели** с контентом, фильтрами, account, локалями.

## Структура маршрутов

| URL | Описание |
|-----|----------|
| `/` | Home |
| `/collections/core` | Core Collection |
| `/void/:slug` | Editorial PDP |
| `/search` | Live search |
| `/journal` | Editorial placeholder |
| `/products/*` | → core или void (редирект) |

## Питч одной фразой

«Это ваш магазин на Shopify, но витрина — отдельное быстрое приложение: любой дизайн, SEO, поиск, без ограничений темы. Товары и оплата — в Shopify Admin, как сейчас.»
