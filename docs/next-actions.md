# Next Actions

The active list is updated after the initial implementation and production verification.
Completed actions are removed; only implementable work remains.

## P1 — Global search across all administrative levels

- **Outcome:** A search input on the home page that returns matching provinces, regencies, districts, and villages without requiring the user to drill through the hierarchy.
- **Why now:** The benchmark supports finding a specific village quickly; the current explorer requires up to four sequential selections.
- **Prerequisite:** Current `/api/regions` endpoints and local JSON files already contain all data.
- **Acceptance criteria:**
  - User can type at least 3 characters and see ranked results within 300 ms.
  - Results show level, name, code, and parent path.
  - Selecting a result updates the explorer to the correct hierarchy state.
- **Risk if deferred:** Core lookup workflow remains slower than the benchmark for direct searches.

## P1 — Export selected hierarchy

- **Outcome:** A button that copies or downloads the current selection path as JSON or CSV.
- **Why now:** The primary use case is filling address forms and verifying codes; users need an easy way to capture the complete path.
- **Prerequisite:** `RegionExplorer` already tracks the full selection state in the URL.
- **Acceptance criteria:**
  - JSON export contains `{ province, regency, district, village }` with name and code.
  - CSV export contains a single header row and one data row.
  - Export works from any selected level, leaving empty fields blank rather than failing.
- **Risk if deferred:** Users must manually transcribe codes, increasing error rates.

## P1 — Mobile step-by-step wizard

- **Outcome:** On viewports narrower than 720 px, the four-column explorer collapses into a single-column wizard with clear back/next navigation.
- **Why now:** The current responsive layout stacks four short columns, which is hard to scan and navigate on phones.
- **Prerequisite:** Existing `RegionExplorer` state logic can be reused; only presentation changes.
- **Acceptance criteria:**
  - Only one active level is visible at a time on mobile.
  - A back button returns to the previous level and clears downstream selections.
  - Selected values are summarized at the top.
- **Risk if deferred:** Mobile completion rate for deep lookups stays low.

## P2 — Automated data refresh workflow

- **Outcome:** A repeatable script (and optional GitHub Action) that downloads the latest `cahyadsn/wilayah` SQL dump, regenerates `public/data/`, runs verification, and opens a PR.
- **Why now:** Kepmendagri regulations can change; manual refresh is error-prone and easy to forget.
- **Prerequisite:** Current Python parsing logic in `/tmp/wilayah.sql` needs to be committed as a project script.
- **Acceptance criteria:**
  - One command regenerates all JSON files and reports count deltas.
  - The script fails if counts drop unexpectedly.
  - CI runs `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build`.
- **Risk if deferred:** Data becomes stale and the app loses trustworthiness over time.

## P2 — SEO metadata and analytics

- **Outcome:** Structured data (`BreadcrumbList`, `WebSite`), Open Graph tags, and lightweight page-view instrumentation.
- **Why now:** The app is public; better metadata improves search discoverability and shared-link quality.
- **Prerequisite:** Deployment is live and stable.
- **Acceptance criteria:**
  - Each page has unique `<title>` and `<meta name="description">`.
  - Open Graph image and tags render correctly in social-card validators.
  - No third-party analytics script blocks the main thread.
- **Risk if deferred:** Organic traffic and shareability remain limited.
