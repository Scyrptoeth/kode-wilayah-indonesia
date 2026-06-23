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

## P2 — Accessibility and UX refinements

- **Outcome:** Audit keyboard navigation, focus traps, and screen-reader announcements across the explorer, search, export, and theme toggle.
- **Why now:** New interactive elements (theme toggle, share, export dropdown, mobile back button) need verified accessibility.
- **Prerequisite:** All new UI components are in place.
- **Acceptance criteria:**
  - Export dropdown is keyboard operable (Esc to close, Enter to select).
  - Focus returns sensibly after selecting a search result or copying a code.
  - Color contrast passes WCAG AA in both light and dark modes.
- **Risk if deferred:** Users relying on assistive technology may encounter friction with the new controls.
