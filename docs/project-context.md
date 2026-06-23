# Project Context

## Product

Kode-Wilayah-Indonesia is a standalone public web application for finding Indonesian administrative region codes through a four-level hierarchy.

## Audience and primary workflow

The primary audience is anyone completing address data, checking administrative codes, or navigating Indonesian regional hierarchy. The first screen must support this workflow:

1. Find and select a province.
2. Find and select a regency or city.
3. Find and select a district.
4. Find, select, or copy a village or subdistrict code.

## Benchmark

- Website: `https://kodewilayah.web.id/#wilayah`
- Screenshot: `01-benchmarking-website.png`
- Benchmark role: interaction and hierarchy reference, not source code or branding.

## Architecture

- Next.js 16 App Router and React 19.
- Static public page with URL-driven initial selection.
- Small Client Component island for hierarchy state, local search, copy feedback, and progressive requests.
- Route Handler adapter at `/api/regions` for upstream validation, normalization, caching, and error isolation.
- Region codes remain strings in the internal contract.

## Product character

Trustworthy, utilitarian, and data-forward. The interface uses low motion, medium-low visual variance, high information density, one blue accent, WCAG AA contrast, and responsive one, two, or four-column layouts.

## Scope boundaries

- No authentication, database, payments, map rendering, or cross-project integration.
- No bulk initial delivery of all villages.
- No guarantee that the upstream dataset is suitable for legal or other critical decisions.
