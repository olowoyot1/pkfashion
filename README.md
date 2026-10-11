# PK Fashion — Vercel / GitHub Starter

A Vercel-ready static deployment package for the supplied PK Fashion rose-pink ready-to-wear storefront.

## Included

- `index.html` — complete supplied storefront UI and client-side interactions
- `vercel.json` — Vercel configuration and baseline response security headers
- `package.json` — local preview and build-check commands
- `scripts/check-build.js` — verifies that the storefront file and key sections exist
- `.env.example` — notes for future server-side payment integration

## Deploy to GitHub and Vercel

1. Create a new GitHub repository named `pk-fashion-store`.
2. Extract this ZIP and upload/commit all files at the repository root (so `index.html` and `vercel.json` are at the root).
3. In Vercel, choose **Add New → Project**, import the GitHub repository, and deploy.
4. Framework preset: **Other**. Build command: `npm run build`. Output directory: `.`. Install command may be left blank or set to `npm install`.
5. Each push to the connected production branch will trigger a new deployment.

## Local preview

Requires Node.js 20 or later.

```bash
npm run build
npx serve .
```

Open the local URL printed by `serve`.

## Important production limitations

This package preserves the supplied HTML project. It is a **front-end/demo storefront**, not yet a secure full-stack commerce system:

- Products, cart, wishlist, demo orders and customer state use browser `localStorage`; they are not shared across devices or reliably backed up.
- The checkout handler in the supplied HTML creates a demo order and displays a payment-success message. It does **not** contact Paystack or Flutterwave and does not verify a real payment. Do not fulfill orders based on that demo status.
- The admin dashboard in the supplied HTML is client-side UI and is **not protected by server-side authentication/authorization**. Do not expose it as a real admin system or store sensitive data there.
- The contact form is client-side and needs a server endpoint or form provider to deliver messages.
- Product image/font/icon assets currently rely on third-party CDNs and image URLs.

Before taking live orders, add a persistent database (for example, Neon Postgres), server-side customer/admin authentication, server-validated inventory/prices, order APIs, and real payment initialization plus webhook/signature verification. Keep payment secret keys only in Vercel environment variables and never in browser code. For a true multi-user store, this static package is the deployable baseline, not the finished secure commerce backend.
