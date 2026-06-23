# Development History

Verified development entries are appended by the `update-kode-wilayah-indonesia` workflow.

## 2026-06-23 — Provision Neon Postgres and fix feedback storage

- Confirmed repository identity: `Scyrptoeth/kode-wilayah-indonesia`.
- `git status --short` clean at commit `f70a1fd`.
- Re-ran verification stack:
  - `npm test` — 14/14 tests passed.
  - `npm run lint` — passed.
  - `npm run typecheck` — passed.
  - `npm run build` — passed with successful GitHub data sync.
- Source changes:
  - Removed `@upstash/redis` and Redis storage utilities (`src/lib/centralStorage.server.ts`, `src/lib/feedbackAnalytics.server.ts`).
  - Added `@neondatabase/serverless` and `src/lib/feedbackDatabase.server.ts` using `DATABASE_URL`/`POSTGRES_URL`.
  - Updated `src/app/api/feedback/route.ts` to read/write feedback from Neon Postgres.
  - Updated error messages in `src/components/anonymous-feedback.tsx` and `src/app/developer/page.tsx` to refer to the database state.
- Infrastructure changes:
  - Provisioned Neon Postgres resource `neon-purple-fence` via Vercel marketplace on the free_v3 plan.
  - Connected the resource to project `kode-wilayah-indonesia` (production, preview, development).
  - Verified `DATABASE_URL` and related environment variables are present in Vercel.
- Verified live deployment at `https://kode-wilayah-indonesia-ecru.vercel.app` on 2026-06-23T17:46:47Z:
  - Home (`/`): HTTP 200.
  - `/developer`: HTTP 200.
  - POST `/api/feedback` with message body: HTTP 200, returned persisted feedback record.
  - GET `/api/feedback` with Bearer token: HTTP 200, returned the submitted feedback with `totalCount: 1`.
  - GET `/api/feedback` without token: HTTP 401.
- Commit on `main`: `f70a1fd` — fix: migrate feedback storage to Neon Postgres and provision database.
- Pushed to GitHub: https://github.com/Scyrptoeth/kode-wilayah-indonesia
- Deployed to Vercel: https://kode-wilayah-indonesia-ecru.vercel.app (production deployment `kode-wilayah-indonesia-66iv06vcr-scyrptoeths-projects.vercel.app`).
- Updated docs: `docs/development-history.md`, `docs/lessons-learned.md`, `docs/next-actions.md`.

## 2026-06-23 — Footer, anonymous feedback panel, and /developer dashboard

- Confirmed repository identity: `Scyrptoeth/kode-wilayah-indonesia`.
- `git status --short` clean at commit `df56a05`.
- Re-ran verification stack:
  - `npm test` — 14/14 tests passed.
  - `npm run lint` — passed.
  - `npm run typecheck` — passed.
  - `npm run build` — passed with successful GitHub data sync.
- Source changes:
  - Added `@upstash/redis` dependency and Redis-based central storage utilities (`src/lib/centralStorage.server.ts`, `src/lib/feedbackAnalytics.server.ts`).
  - Added `src/lib/feedback.ts` and `src/lib/feedbackSync.ts` for feedback normalization and client/server sync.
  - Added `src/app/api/feedback/route.ts` with POST (anonymous) and GET (Bearer token) endpoints.
  - Added `src/components/anonymous-feedback.tsx` and placed it on the home page above the footer.
  - Added `src/components/site-footer.tsx` replacing the inline footer in `src/app/layout.tsx`.
  - Added `src/app/developer/page.tsx` for viewing all anonymous feedback with an admin token.
  - Added responsive styles for the feedback panel, footer, and developer page in `src/app/globals.css`.
- Verified live deployment at `https://kode-wilayah-indonesia-ecru.vercel.app` on 2026-06-23T17:22:26Z:
  - Home (`/`): HTTP 200.
  - `/developer`: HTTP 200.
  - `/api/feedback` (POST and GET): HTTP 503 with `central_feedback_storage_not_configured` because Upstash Redis and admin token are not yet configured in Vercel.
- Commit on `main`: `df56a05` — feat: add footer, anonymous feedback panel, and /developer dashboard.
- Pushed to GitHub: https://github.com/Scyrptoeth/kode-wilayah-indonesia
- Deployed to Vercel: https://kode-wilayah-indonesia-ecru.vercel.app (production deployment `kode-wilayah-indonesia-8itn4obss-scyrptoeths-projects.vercel.app`).
- Updated docs: `docs/development-history.md`, `docs/lessons-learned.md`, `docs/next-actions.md`.
- Note: Feedback storage requires `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and `KODE_WILAYAH_ADMIN_TOKEN` environment variables to be set in Vercel.

## 2026-06-23 — Polish search, mobile wizard, export accessibility, and virtual list

- Confirmed repository identity: `Scyrptoeth/kode-wilayah-indonesia`.
- `git status --short` clean at commit `bed26a3`.
- Re-ran verification stack:
  - `npm test` — 14/14 tests passed.
  - `npm run lint` — passed.
  - `npm run typecheck` — passed.
  - `npm run build` — passed with successful GitHub data sync.
- Source changes:
  - Fixed `GlobalSearch` status union to include `"success"` and added empty-results feedback.
  - Added query highlight (`<mark class="search-highlight">`) to matched text in global search results.
  - Added `Escape`-to-close and click-outside behavior to `ExportHierarchy` dropdown; focus returns to the export button when closed.
  - Added smooth scroll-to-step behavior in `RegionColumn` when a step becomes active on mobile.
  - Added `aria-label` prop to `VirtualList` and passed descriptive labels from `RegionColumn`.
- Verified live deployment at `https://kode-wilayah-indonesia-ecru.vercel.app` on 2026-06-23T16:54:09Z:
  - Home (`/`): HTTP 200.
  - `/api/regions?level=provinces`: HTTP 200, 38 provinces.
  - `/api/regions?level=search&q=jawa`: HTTP 200, results returned.
- Commit on `main`: `bed26a3` — polish: search highlight and status, mobile scroll-to-step, export a11y, virtual-list label.
- Pushed to GitHub: https://github.com/Scyrptoeth/kode-wilayah-indonesia
- Deployed to Vercel: https://kode-wilayah-indonesia-ecru.vercel.app (production deployment `kode-wilayah-indonesia-1ds5x1fni-scyrptoeths-projects.vercel.app`).
- Updated docs: `docs/development-history.md`, `docs/next-actions.md`.

## 2026-06-23 — Export hierarchy, GitHub data repo, and full delivery

- Implemented **Export selected hierarchy** feature:
  - Added `src/lib/export.ts` with `HierarchyPath`, `hierarchyToJson`, `hierarchyToCsv`, and `downloadText` helpers.
  - Added `src/components/export-hierarchy.tsx` dropdown with JSON and CSV export options.
  - Integrated `ExportHierarchy` into `RegionExplorer` toolbar.
  - Added unit tests for JSON and CSV formatting in `src/lib/regions.test.ts`.
- Published independent data repository to GitHub: `https://github.com/Scyrptoeth/wilayah-indonesia-data`.
- Updated `scripts/sync-data.mjs` to successfully clone from the public GitHub repository during `npm run build`.
- Pushed application changes to `Scyrptoeth/kode-wilayah-indonesia` at commits:
  - `9b84add` — feat: independent data repo, theme modes, deep-link sharing, mobile UX polish, fuzzy search, and export hierarchy
  - `6d4d7f6` — fix: split export helpers into client-safe lib/export.ts
- Re-ran verification stack after all changes:
  - `npm test` — 14/14 tests passed.
  - `npm run lint` — passed.
  - `npm run typecheck` — passed.
  - `npm run build` — passed with successful GitHub data sync.
- Updated docs: `docs/next-actions.md`.

## 2026-06-23 — Independent data repository, theme modes, deep-link sharing, mobile UX polish, and fuzzy search

- Confirmed repository identity: `Scyrptoeth/kode-wilayah-indonesia`.
- Created independent data repository structure at `/Users/persiapantubel/Desktop/codex/wilayah-indonesia-data` with copied JSON files, `README.md`, and `data-contract.md`.
- Replaced all `cahyadsn/wilayah` references with `Scyrptoeth/wilayah-indonesia-data` in application code, documentation, and skill files.
- Added `scripts/sync-data.mjs` and `npm run sync:data` / `prebuild` for build-time data sync with local-path and GitHub support and a fallback to existing data.
- Implemented light/dark mode with system-preference default and manual toggle in `src/components/theme-provider.tsx`, `src/components/theme-script.tsx`, and `src/components/site-header.tsx`.
- Improved deep-link sharing: `generateMetadata` now emits canonical and Open Graph URLs reflecting the current selection, and `RegionExplorer` exposes a "Bagikan" button using Web Share API with clipboard fallback.
- Polished mobile wizard: added sticky column header behavior, compact step summaries in the mobile stepper, and an explicit "Kembali" button on active steps.
- Enhanced global search with token-based and Levenshtein fuzzy matching, plus `src/lib/search.test.ts`.
- Re-ran verification stack:
  - `npm test` — 12/12 tests passed.
  - `npm run lint` — passed.
  - `npm run typecheck` — passed.
  - `npm run build` — passed (sync script fell back to existing data because the GitHub data repository is not yet public).
- Updated docs: `docs/data-contract.md`, `docs/next-actions.md`, `README.md`, `src/app/dokumentasi/page.tsx`, `src/app/faq/page.tsx`.
- `git status --short` shows uncommitted changes at working tree based on `e48e7ee3ad2186e5b4405f5c151b75c927e417c7`.

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

- Created local dataset from Kepmendagri No 300.2.2-2138 Tahun 2025 and established independent data repository `Scyrptoeth/wilayah-indonesia-data`.
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
