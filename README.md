# sparsh-medical-fe

React 19 + TypeScript + Vite frontend for **Sparsh Medical**. It replaces the Django
template (`products/templates/products/index.html`) and the Django admin.

| Area | Route | Who |
|---|---|---|
| Store (user panel) | `/` — `?q=` search, `?category=` filter | Public, no login |
| Sign in | `/login` (Continue with Google; `/admin/login` redirects here) | Anyone with a Google account |
| Admin products | `/admin/products`, `/admin/products/new`, `/admin/products/:id/edit` | Admins only: email in the backend's `ALLOWED_ADMIN_EMAILS` |

Customers who sign in see their avatar menu in the store header; admins also get an
**Admin dashboard** link there. A customer who opens `/admin/...` is sent back to the store.

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
  contexts/  AuthContext.tsx (Google sign-in session, isAdmin), CartContext.tsx (localStorage cart)
  hooks/     useProducts.ts (paged listing with search / category / sort / status)
  utils/     whatsapp.ts, storeHours.ts, categoryVisual.ts, format.ts, media.ts, StorageUtils.ts
  components/<Name>/<Name>.tsx + <Name>.css
             Icon                 inline SVG icon set (Lucide paths)
             Store:  StoreTopBar, StoreHeader, CategoryNav, HeroBanner, PrescriptionCard, TrustStrip,
                     CategoryGrid, ProductCatalog, ProductCard, WhatsAppBand, VisitStore,
                     StoreFooter, CartDrawer, MobileCartBar, Loader
             Admin:  AdminRoute, AdminLayout, AdminStats, ProductForm · AccountMenu (header)
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
