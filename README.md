# Devi Stationery & Xerox Centre

A responsive static storefront for the shop. Open `index.html` from an HTTPS web host; the pages do not require a build step or third-party scripts.

## What's included

- `index.html` and `styles.css`: storefront, accessible navigation, product category search/filter, services, FAQ, rating link, and footer.
- `app.js`: local quote bag and browser-stored cookie preferences. The quote bag copies an enquiry; it does not submit or reserve an order.
- `site-config.js`: verified store name, address, and phone number, plus the Google listing link.
- `location.html`, `privacy.html`, `terms.html`, and `returns.html`: location and policy pages.

## Before launch

1. Replace no facts unless confirmed by the store. The displayed address and phone came from its public Google listing; confirm they are current.
2. Set the production domain in the canonical, sitemap, and structured-data URL fields once the domain and hosting are chosen.
3. Configure HTTPS redirects and security headers at the chosen host. Keep all production assets and forms on HTTPS.
4. Have the store approve its actual privacy, return, refund, and sales terms. The current pages describe this no-checkout demo, not a completed legal review.
5. Add a verified product catalog, prices, inventory process, and payment provider before enabling online orders. No card data is collected here.
6. The rating summary links to Google and is a static snapshot. Live review synchronization would require an approved Google API integration and its credentials/terms; this site does not scrape reviews or show invented customer quotes.

The illustration shapes are CSS artwork. The font stack falls back to system/web-safe fonts; no external font or tracking request is made.
