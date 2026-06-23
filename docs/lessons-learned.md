# Lessons Learned

Reusable lessons are added only after a verified implementation or release result.

1. **Source reliability matters.** `cahyadsn/wilayah` provides a clean SQL dump derived from Kepmendagri publications. Parsing it once into static JSON avoids runtime dependency on external APIs and rate limits.
2. **Hybrid file layout balances size and count.** Keeping provinces, regencies, and districts in single JSON files and splitting villages by regency code keeps the repository manageable (~517 files) while keeping each village request small and cacheable.
3. **Static JSON in `public/data/` is the simplest distribution model for Next.js.** No database, no runtime scraping, and Vercel serves the files from the edge automatically.
4. **Tests should assert real data.** Testing against actual local files catches encoding, parsing, and path issues early.
5. **Always run the full verification stack.** `typecheck`, `lint`, `test`, and `build` together prevent silent regressions before deployment.
