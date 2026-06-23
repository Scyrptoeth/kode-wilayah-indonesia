# Project Instructions

## Communication

- Communicate with the user in Bahasa Indonesia.
- Write code, identifiers, comments, and commit messages in English.
- Do not claim completion without current verification evidence.

## Project Boundaries

- This repository is the standalone Kode-Wilayah-Indonesia project.
- Keep all project documentation under `docs/`.
- Preserve `01-benchmarking-website.png` as benchmark evidence.
- Do not couple this application to another Persiapantubel repository.

## Engineering

- Prefer systemic data and UI behavior over hardcoded region lists.
- Preserve upstream data provenance and normalize region codes as strings.
- Default to Next.js Server Components. Use Client Components only for interaction.
- Read the relevant guide in `node_modules/next/dist/docs/` before changing Next.js APIs.
- Do not add dependencies before checking `package.json` and establishing a concrete need.
- Preserve user changes and inspect `git status --short` before broad edits.

## Verification

- Run tests, lint, typecheck, and production build for code changes.
- Verify visual changes in a browser at desktop and mobile widths.
- Verify at least one complete province-to-village path and the 38-province result.
- Do not commit, push, or deploy unless the user explicitly authorizes it.
