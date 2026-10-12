# PK Fashion — Vercel storefront

PK Fashion is an African women's ready-to-wear storefront focused on English-style corporate workwear and contemporary Nigerian native-inspired workwear.

## Deploy

1. Import `olowoyot1/pkfashion` into Vercel.
2. Use the `main` branch, build command `npm run build`, and output directory `public`.
3. In Vercel → Project Settings → Environment Variables, set the following for Production (and Preview only if needed):
   - `ADMIN_USERNAME` — set to `kike` if that is the intended admin username.
   - `ADMIN_PASSWORD` — set the intended password here. Use a long, unique password and do not put it in source code.
   - `ADMIN_SESSION_SECRET` — a random secret of at least 32 characters.
   - Optional `ADMIN_ALLOWED_ORIGIN` — the exact production origin, e.g. `https://your-domain.example`.
4. Redeploy after saving environment variables.
5. Open `/admin/` to sign in. The admin session uses an HttpOnly, Secure, SameSite=Strict cookie and expires after eight hours.

Generate a session secret with Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

`.env.example` documents variable names only; never commit real credentials. If authentication variables are missing, login is intentionally disabled.

## Admin portal and current limitations

- Public admin links and dashboard markup have been removed from the customer storefront.
- Admin login is validated by Vercel serverless functions. The password and session signing secret are read only from Vercel environment variables.
- The portal provides product and demo-order management against the browser's `localStorage`. This is only shared with the storefront in the same browser and device. It is **not** a multi-user database, is not backed up, and is not suitable as the source of truth for real orders or inventory.
- Customer login, checkout and payment are still demo/front-end flows. No real payment is verified and order state is not persisted centrally.
- Before live commerce, connect a persistent database (such as Neon Postgres), authenticated server-side CRUD APIs for products and orders, and a payment provider with webhook/signature verification. Do not fulfill orders based on a browser success message.

## Local build check

Requires Node.js 20 or later:
```bash
npm run build
```
The build check verifies that the public storefront contains no admin dashboard markup and copies the storefront and admin page to `public/`. Vercel serves the API handlers from `api/admin/`.


## Shared product catalogue and cloud image uploads

This feature uses Supabase for cross-device product catalogue sync and persistent product images.

1. Create a Supabase project.
2. Run `supabase-setup.sql` in its SQL Editor.
3. In Vercel Project Settings → Environment Variables, set `SUPABASE_URL` to your project URL and `SUPABASE_SERVICE_ROLE_KEY` to the project's service-role key. Keep that key server-side only; never add it to browser JavaScript.
4. Redeploy the Vercel project.
5. Sign in at `/admin/`. The portal initializes the shared catalogue and saves product photos to the public `product-images` bucket. The storefront fetches the shared catalogue when it loads.

Until the Supabase variables are configured and deployment completes, the storefront uses default/local products and cloud uploads will show a configuration error. Orders, customer accounts and checkout remain demo/local flows.
