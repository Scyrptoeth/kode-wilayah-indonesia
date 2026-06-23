# Lessons Learned

Reusable lessons are added only after a verified implementation or release result.

## 1. External API dependency is a liability for static reference data

- **Observed condition:** The original implementation fetched region data from `https://api.kodewilayah.web.id` at runtime.
- **Why the prior approach was insufficient:** The upstream service has no SLA, rate limits, and can change or become unavailable, which would break the application even though the underlying government data changes infrequently.
- **Reusable rule:** For stable reference datasets, parse the authoritative source once into static files committed with the repository, then serve them through a thin adapter with long-lived cache headers.
- **Evidence:** The refactored `src/lib/regions.ts` reads from `public/data/`; live endpoints return HTTP 200 and correct counts after deployment.

## 2. Hybrid file layout balances repository size and request granularity

- **Observed condition:** A single villages file would be ~8 MB, while one file per district creates more than 7.000 files.
- **Why flat alternatives were insufficient:** A monolithic file slows initial load; thousands of tiny files bloat the repository and deployment package.
- **Reusable rule:** Keep small levels in single files and split only the largest level by a stable parent prefix that keeps each file under ~100 KB.
- **Evidence:** `public/data/` contains 1 + 1 + 1 + 514 = 517 files; the largest village file is well under 100 KB and each `/api/regions` request filters in memory quickly.

## 3. Tests against real data catch data-shape regressions early

- **Observed condition:** Initial tests mocked upstream payload normalization; after switching to local files, tests asserted mocked shapes only.
- **Why mocked tests were insufficient:** They would not detect missing files, encoding issues, or unexpected code formats in the regenerated dataset.
- **Reusable rule:** When the runtime behavior depends on committed data files, tests should read the same files the application reads.
- **Evidence:** `src/lib/regions.test.ts` now calls `fetchRegions` for each level and asserts real counts and code prefixes; it passes in CI and locally.

## 4. Full verification stack must run before every deployment

- **Observed condition:** TypeScript, lint, tests, and production build each catch different classes of errors.
- **Why partial verification is insufficient:** A build can fail on dynamic imports or environment-specific paths even when tests pass; lint can catch accessibility or import issues that typechecking misses.
- **Reusable rule:** Run `typecheck`, `lint`, `test`, and `build` in sequence before pushing or deploying.
- **Evidence:** All four commands pass for commit `4001762c1ba41420dd3cef3b1babda1b02c61ac4`, and the Vercel deployment built successfully from the same tree.

## 6. Global search over static files should avoid monolithic build-time indexes

- **Observed condition:** An initial attempt pre-built a single `search-index.json` file for global search, producing a ~16 MB asset.
- **Why the prior approach was insufficient:** The file bloats the repository and deployment package, and reading the entire index into memory for every search request is wasteful for a dataset that is already split into logical files.
- **Reusable rule:** For static reference data, filter the existing source files directly with early termination, sort and limit results, and rely on long-lived HTTP cache for repeated queries instead of shipping a separate search index.
- **Evidence:** `src/lib/search.ts` reads `provinces.json`, `regencies.json`, `districts.json`, and only the relevant `villages/{regencyCode}.json` files; `/api/regions?level=search&q=jawa` returns 20 ranked results in production.

## 7. Virtualization should be opt-in based on list length

- **Observed condition:** A virtual list component was considered for every region column.
- **Why the prior approach was insufficient:** Virtual lists add `ResizeObserver`, absolute positioning, and scroll-sync complexity that is unnecessary for short lists and can complicate accessibility and keyboard navigation.
- **Reusable rule:** Only virtualize lists that exceed a concrete item threshold; keep native rendering for shorter lists to preserve standard list semantics and reduce complexity.
- **Evidence:** `RegionColumn` enables virtualization only for the village column when `filteredRegions.length > 100`; the other columns continue to render a native `<ul>`.

## 5. Hierarchical selection needs a dedicated mobile wizard

- **Observed condition:** On narrow viewports, stacking four short columns forced users to scroll repeatedly and made it hard to track which level they were selecting.
- **Why the prior responsive layout was insufficient:** A simple 1-column stack preserves legibility but hides the sequential relationship between levels and offers no quick way to backtrack.
- **Reusable rule:** For multi-level hierarchy pickers on mobile, show one active level at a time with a persistent stepper ( Provinsi → Kab/Kota → Kecamatan → Desa ), auto-advance on selection, and allow returning to completed steps.
- **Evidence:** `RegionExplorer` now uses a `STEPS` array and a `mobileStepper`; only the active column renders below 720 px, and the production deployment renders the stepper correctly at `https://kode-wilayah-indonesia-ecru.vercel.app`.
