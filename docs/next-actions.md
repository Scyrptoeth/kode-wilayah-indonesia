# Next Actions

The active list is updated after the latest development session.
Completed or deprioritized actions are removed; only implementable work remains.

## P2 — Automated data refresh workflow

- **Outcome:** Provide a repeatable script or GitHub Actions workflow that fetches the latest Kepmendagri release, validates counts, and opens a PR against `Scyrptoeth/wilayah-indonesia-data`.
- **Why now:** The independent data repository is live, but there is no documented update path when Kepmendagri publishes a new regulation.
- **Prerequisite:** Data repo `Scyrptoeth/wilayah-indonesia-data` exists and the sync script is functional.
- **Acceptance criteria:**
  - A single command regenerates all JSON files from an authoritative source.
  - Count validation fails the build if coverage drops unexpectedly.
  - The workflow produces a clear diff and version bump in `data-contract.md`.
- **Risk if deferred:** Manual updates remain error-prone and discourage keeping the dataset current.

## P2 — Remaining accessibility and focus refinements

- **Outcome:** Complete the keyboard and screen-reader audit for the theme toggle, global search result selection, and copy-code feedback.
- **Why now:** The export dropdown already supports Escape-to-close and focus return; the remaining interactive elements need the same level of verification.
- **Prerequisite:** Export dropdown accessibility changes are deployed and verified.
- **Acceptance criteria:**
  - Theme toggle has an explicit `aria-label` and visible focus indicator in both light and dark modes.
  - Selecting a global search result moves focus to the first changed level in the explorer.
  - Copy-code feedback is announced by screen readers without moving focus.
  - Color contrast passes WCAG AA in both light and dark modes.
- **Risk if deferred:** Users relying on assistive technology may still encounter friction with the most frequently used controls.

## P2 — Performance and observability

- **Outcome:** Add lightweight runtime metrics and verify Core Web Vitals for the home page on desktop and mobile.
- **Why now:** The dataset is large and the explorer relies on client-side filtering and virtualization; real-world metrics are needed to validate the current approach.
- **Prerequisite:** Production deployment is stable and publicly accessible.
- **Acceptance criteria:**
  - `next/script` or `vercel/speed-insights` is integrated without blocking render.
  - A single manual Lighthouse run scores ≥ 90 on Performance, Accessibility, Best Practices, and SEO for `/`.
  - Village-list virtualization is verified to keep INP low on a mid-range mobile device.
- **Risk if deferred:** Performance regressions in search or virtualization may go unnoticed until reported by users.
