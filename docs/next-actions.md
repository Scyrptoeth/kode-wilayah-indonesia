# Next Actions

The active list is updated after the latest development session.
Completed or deprioritized actions are removed; only implementable work remains.

## P1 — Push independent data repository to GitHub

- **Outcome:** Create the public repository `Scyrptoeth/wilayah-indonesia-data` and push the generated dataset so the build-time sync script can clone from GitHub instead of falling back to local files.
- **Why now:** The data repository structure and sync script are ready, but the GitHub repository does not exist yet. Until it exists, `npm run build` will log a fallback warning.
- **Prerequisite:** Local data mirror exists at `/Users/persiapantubel/Desktop/codex/wilayah-indonesia-data` with README and data-contract.
- **Acceptance criteria:**
  - Repository `Scyrptoeth/wilayah-indonesia-data` is public on GitHub.
  - `npm run build` clones the repository successfully without fallback.
  - Data counts remain 38/514/7.265/83.345 after sync.
- **Risk if deferred:** The "independent database" goal is only half-completed; deployments still rely on committed data files.

## P2 — Export selected hierarchy

- **Outcome:** Allow users to copy or download the current selection as JSON or CSV.
- **Why now:** Complements the new share button and gives power users a way to paste structured data into forms or spreadsheets.
- **Prerequisite:** Selection state and path names are already computed in `RegionExplorer`.
- **Acceptance criteria:**
  - A dropdown or secondary button exposes "Salin JSON" and "Salin CSV" options.
  - Exported data includes codes and names for every selected level.
- **Risk if deferred:** Users continue to copy codes one by one.
