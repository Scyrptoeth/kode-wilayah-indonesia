# Next Actions

The active list is updated after the latest development session.
Completed or deprioritized actions are removed; only implementable work remains.

## P2 — Deep-link sharing improvements

- **Outcome:** Enhance URL state serialization with clearer slugs, social-card metadata per selection, and share button.
- **Why now:** The explorer already updates the URL, but shared links could be richer and easier to copy.
- **Prerequisite:** Current selection state is already persisted in query parameters.
- **Acceptance criteria:**
  - Each selected hierarchy has a stable, copyable URL.
  - Open Graph tags reflect the selected path server-side.
  - A visible "Bagikan" button copies the current URL on mobile and desktop.
- **Risk if deferred:** Share workflow remains implicit and harder to discover.

## P2 — Mobile UX polish

- **Outcome:** Further refine the step-by-step wizard on narrow viewports.
- **Why now:** The mobile wizard is functional; edge cases such as searching within a long column and returning to previous steps can be smoother.
- **Prerequisite:** `RegionExplorer` already uses a `STEPS` array and `mobileStepper`.
- **Acceptance criteria:**
  - Search input inside a column remains visible while scrolling.
  - Completed steps show a compact summary instead of only checkmarks.
  - Back navigation is discoverable without relying on the stepper alone.
- **Risk if deferred:** Mobile users in multi-step flows may still feel disoriented.
