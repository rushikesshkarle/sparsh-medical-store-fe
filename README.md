# sparsh-medical-fe

React 19 + TypeScript + Vite frontend for **Sparsh Medical**. It replaces the Django
template (`products/templates/products/index.html`) and the Django admin.

| Area | Route | Who |
|---|---|---|
| Store (user panel) | `/` — `?q=` search, `?category=` filter | Public, no login |
| Admin login | `/admin/login` (`/login` redirects here) — username/password from the backend env | Store staff |
| Admin products | `/admin/products`, `/admin/products/new`, `/admin/products/:id/edit` | Signed-in admin |

There are no customer accounts: shoppers browse and order on WhatsApp as guests.
Only the store admin signs in.

Customers browse, search, filter, add to a browser-side cart and send the order to
the store on **WhatsApp** (there is no online payment, as on the old site).

## Run locally

```bash
npm install
cp .env.example .env.local      # then either:
#  a) VITE_API_BASE_URL=http://localhost:8000          (direct, needs backend CORS)
#  b) VITE_API_BASE_URL=  and  VITE_DEV_PROXY=http://localhost:8000   (same-origin proxy)
npm run dev                      # http://localhost:5173
```

Checks: `npm run typecheck`, `npm run lint`, `npm run build`.

## Structure

Same layout as `io-skills-marketplace-fe`. **No UI library and no io-dsl**: every component
is plain React + TSX with its own CSS file next to it.

```
src/
  main.tsx, App.tsx              entry (loads styles/tokens.css + styles/base.css) + routes
  styles/    tokens.css          design tokens (colours, fonts, spacing) — change the look here
             base.css            reset + shared primitives (.container, .btn, .chip, .tone-*)
  config/    api.ts              endpoint map
             store.ts            address, phone, hours, categories (icons + colours)
  types/     api.ts, product.ts, auth.ts
  services/  api.ts (axios + error envelope), authService.ts, productService.ts
  contexts/  AuthContext.tsx (admin session), CartContext.tsx (localStorage cart)
  hooks/     useProducts.ts (paged listing with search / category / sort / status)
  utils/     whatsapp.ts, storeHours.ts, categoryVisual.ts, format.ts, media.ts, StorageUtils.ts
  components/<Name>/<Name>.tsx + <Name>.css
             Icon                 inline SVG icon set (Lucide paths)
             Store:  StoreTopBar, StoreHeader, CategoryNav, HeroBanner, TrustStrip,
                     CategoryGrid, ProductCatalog, ProductCard, WhatsAppBand, VisitStore,
                     StoreFooter, CartDrawer, MobileCartBar, Loader
             Admin:  AdminRoute, AdminLayout, AdminStats, ProductForm
  pages/     StorePage/, NotFoundPage/, LoginPage/, admin/AdminProductsPage, AdminProductFormPage
             (a page's CSS sits next to it, e.g. admin/AdminProductsPage.css)
```

Design record (brief, design system, approved mockups): `ui-design-studio-skill-output/agent-context/`.

## Docker

The image serves the build with nginx and proxies `/api` and `/media` to the backend
(`BACKEND_URL`, default `http://sparsh-medical-backend:8000`), so the site is one origin.

```bash
docker build -t sparsh-medical-fe .
docker run -p 8080:80 -e BACKEND_URL=http://host.docker.internal:8000 sparsh-medical-fe
```

## Deploy on Vercel (free)

`vercel.json` serves `index.html` for every route (so refreshing `/admin/...` or `/privacy`
works) and sets cache/security headers. The app calls the backend directly:

| Vercel env variable | Value |
|---|---|
| `VITE_API_BASE_URL` | The backend URL, e.g. `https://sparsh-medical-api.onrender.com` (no trailing `/`) |

`VITE_*` values are baked in at build time — **redeploy** after changing them. On the
backend, set `CORS_ALLOW_ORIGINS` to the Vercel URL. The privacy policy is at `/privacy`.

