# Development History

Verified development entries are appended by the `update-kode-wilayah-indonesia` workflow.

## 2026-06-23 — Global search, SEO metadata, and village-list virtualization

- Confirmed repository identity: `Scyrptoeth/kode-wilayah-indonesia`.
- `git status --short` clean at commit `11d53a0ef87fdfe375d548224964a10b3ea569a6`.
- Re-ran verification stack:
  - `npm test` — 7/7 tests passed.
  - `npm run lint` — passed.
  - `npm run typecheck` — passed.
  - `npm run build` — passed.
- Source changes:
  - Added `src/lib/search.ts` and updated `src/app/api/regions/route.ts` to support `/api/regions?level=search&q={term}`.
  - Added `src/components/global-search.tsx` with debounce, keyboard navigation, and parent-path display.
  - Integrated `GlobalSearch` into `src/components/region-explorer.tsx` so selecting a result updates the hierarchy state.
  - Added `generateMetadata` to `src/app/page.tsx` with dynamic titles and descriptions based on the selected hierarchy.
  - Updated `src/app/layout.tsx` with `metadataBase`, Open Graph, Twitter card, canonical, and `WebSite` structured data.
  - Added `src/app/opengraph-image.tsx` and `src/app/twitter-image.tsx` for dynamic social-card images.
  - Updated `src/app/dokumentasi/page.tsx` and `src/app/faq/page.tsx` with page-specific metadata and canonical URLs.
  - Added `src/components/virtual-list.tsx` and enabled virtualization for the village column in `src/components/region-column.tsx`.
  - Updated `docs/next-actions.md` to remove the deprioritized "Export selected hierarchy" and "Automated data refresh workflow" items.
- Verified live deployment at `https://kode-wilayah-indonesia-ecru.vercel.app` on 2026-06-23T16:03:13Z:
  - Home (`/`): HTTP 200.
  - `/dokumentasi`: HTTP 200.
  - `/faq`: HTTP 200.
  - `/opengraph-image`: HTTP 200.
  - `/api/regions?level=provinces`: HTTP 200, count = 38.
  - `/api/regions?level=regencies&parent=11`: HTTP 200.
  - `/api/regions?level=districts&parent=1101`: HTTP 200.
  - `/api/regions?level=villages&parent=110101`: HTTP 200.
  - `/api/regions?level=search&q=jawa`: HTTP 200, 20 results returned.
- Verified metadata:
  - Home `<title>` = "Kode Wilayah Indonesia" and description includes Kepmendagri 2025.
  - `/dokumentasi` `<title>` = "Dokumentasi | Kode Wilayah Indonesia".
- Commits on `main`:
  - `c4958f2` — feat: add global search across all administrative levels
  - `4c8cb89` — feat: add seo metadata, og images, and structured data
  - `b246912` — perf: add virtualization for long village lists
  - `11d53a0` — docs: update next-actions after feature delivery
- Pushed to GitHub: https://github.com/Scyrptoeth/kode-wilayah-indonesia
- Deployed to Vercel: https://kode-wilayah-indonesia-ecru.vercel.app (production deployment `kode-wilayah-indonesia-qsp1b3eoy-scyrptoeths-projects.vercel.app`).

## 2026-06-23 — Full UI/UX audit, navigation, and mobile wizard

- Confirmed repository identity: `Scyrptoeth/kode-wilayah-indonesia`.
- `git status --short` clean at commit `9ae416fe5570a28b15676663b522bfd1b2eb2e47`.
- Re-ran verification stack:
  - `npm test` — 7/7 tests passed.
  - `npm run lint` — passed.
  - `npm run typecheck` — passed.
  - `npm run build` — passed.
- Source changes:
  - Added `src/components/site-header.tsx` with main navigation (Wilayah, Dokumentasi, FAQ).
  - Moved site shell, skip-link, header, and footer into `src/app/layout.tsx` for consistent layout.
  - Created `src/app/dokumentasi/page.tsx` and `src/app/faq/page.tsx`.
  - Rebuilt `src/components/region-explorer.tsx` with step-driven state, mobile stepper wizard, and copy-to-clipboard live feedback.
  - Improved `src/components/region-column.tsx` accessibility: `aria-describedby` on disabled search, selected-item scroll-into-view on mobile, formatted counts.
  - Updated `src/app/page.tsx` copy and synced counts with `docs/data-contract.md` (7.265 districts, 83.345 villages).
  - Extended `src/app/globals.css` for navigation, mobile stepper, copy feedback, and content pages.
- Verified live deployment at `https://kode-wilayah-indonesia-ecru.vercel.app` on 2026-06-23T10:00:43Z:
  - Home (`/`): HTTP 200.
  - `/dokumentasi`: HTTP 200.
  - `/faq`: HTTP 200.
  - `/api/regions?level=provinces`: HTTP 200.
  - `/api/regions?level=regencies&parent=11`: HTTP 200.
  - `/api/regions?level=districts&parent=1101`: HTTP 200.
  - `/api/regions?level=villages&parent=110101`: HTTP 200.
- Pushed to GitHub: https://github.com/Scyrptoeth/kode-wilayah-indonesia
- Deployed to Vercel: https://kode-wilayah-indonesia-ecru.vercel.app (aliased from https://kode-wilayah-indonesia-iui4t8e07-scyrptoeths-projects.vercel.app).

## 2026-06-23 — Initial complete implementation

- Created local dataset from Kepmendagri No 300.2.2-2138 Tahun 2025 via `cahyadsn/wilayah`.
- Generated JSON files in `public/data/`:
  - `provinces.json` — 38 provinces
  - `regencies.json` — 514 regencies/cities
  - `districts.json` — 7.265 districts
  - `villages/{regencyCode}.json` — 83.345 villages/subdistricts across 514 files
- Refactored `src/lib/regions.ts` to read from local JSON files instead of external API.
- Updated `src/app/api/regions/route.ts` source attribution and cache headers.
- Rewrote `src/lib/regions.test.ts` to assert real local data loading.
- Updated `README.md`, `docs/data-contract.md`, and `src/app/page.tsx` data source note.
- Verified `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` all pass.
- Created skill files:
  - `/Users/persiapantubel/.agents/skills/start-kode-wilayah-indonesia/SKILL.md`
  - `/Users/persiapantubel/.agents/skills/update-kode-wilayah-indonesia/SKILL.md`
- Pushed to GitHub: https://github.com/Scyrptoeth/kode-wilayah-indonesia
- Deployed to Vercel: https://kode-wilayah-indonesia-scyrptoeths-projects.vercel.app
- Verified live endpoints for province, regency, district, and village levels.

## 2026-06-23 — Documentation audit and deployment verification

- Confirmed repository identity: `Scyrptoeth/kode-wilayah-indonesia`.
- `git status --short` clean at commit `4001762c1ba41420dd3cef3b1babda1b02c61ac4`.
- Re-ran verification stack:
  - `npm test` — 7/7 tests passed.
  - `npm run lint` — passed.
  - `npm run typecheck` — passed.
  - `npm run build` — passed.
- Verified live deployment at `https://kode-wilayah-indonesia-scyrptoeths-projects.vercel.app` on 2026-06-23T09:06:33Z:
  - Home: HTTP 200.
  - `/api/regions?level=provinces`: HTTP 200.
  - `/api/regions?level=regencies&parent=11`: HTTP 200.
  - `/api/regions?level=districts&parent=1101`: HTTP 200.
  - `/api/regions?level=villages&parent=110101`: HTTP 200.
- Refactored `docs/next-actions.md` into prioritized P0/P1/P2 items with acceptance criteria, dependencies, and risks.
- No source-code changes were made during this session.
