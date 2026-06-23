import { readdir, readFile } from "fs/promises";
import path from "path";
import type { Region, RegionLevel } from "./regions";

export interface SearchResult {
  code: string;
  name: string;
  level: RegionLevel;
  path: { code: string; name: string }[];
  score: number;
}

const DATA_DIR = path.join(process.cwd(), "public", "data");
const VILLAGES_DIR = path.join(DATA_DIR, "villages");
const MIN_QUERY_LENGTH = 3;
const DEFAULT_LIMIT = 20;
const FUZZY_THRESHOLD = 42;

function normalize(text: string): string {
  return text.toLocaleLowerCase("id-ID");
}

function exactScore(query: string, name: string, code: string): number {
  const q = normalize(query);
  const n = normalize(name);

  if (n === q) return 100;
  if (code === query) return 95;
  if (n.startsWith(q)) return 80;
  if (code.startsWith(query)) return 75;
  if (n.includes(` ${q}`) || n.includes(`-${q}`)) return 60;
  if (n.includes(q)) return 50;
  return 0;
}

function tokens(text: string): string[] {
  return normalize(text)
    .split(/[\s\-/,().]+/)
    .filter((token) => token.length > 0);
}

function tokenScore(query: string, name: string): number {
  const queryTokens = tokens(query);
  const nameTokens = tokens(name);
  if (queryTokens.length === 0 || nameTokens.length === 0) return 0;

  let matched = 0;
  for (const qToken of queryTokens) {
    const match = nameTokens.some((nToken) =>
      qToken.length <= 2 ? nToken === qToken : nToken.startsWith(qToken),
    );
    if (match) matched++;
  }

  const coverage = matched / queryTokens.length;
  const density = matched / nameTokens.length;
  return Math.round((coverage * 0.7 + density * 0.3) * 70);
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = Array.from({ length: b.length + 1 }, (_, row) => [row]);
  for (let col = 1; col <= a.length; col++) {
    matrix[0][col] = col;
  }

  for (let row = 1; row <= b.length; row++) {
    for (let col = 1; col <= a.length; col++) {
      const cost = a[col - 1] === b[row - 1] ? 0 : 1;
      matrix[row][col] = Math.min(
        matrix[row - 1][col] + 1,
        matrix[row][col - 1] + 1,
        matrix[row - 1][col - 1] + cost,
      );
    }
  }

  return matrix[b.length][a.length];
}

function levenshteinScore(query: string, name: string): number {
  const q = normalize(query);
  const n = normalize(name);
  const distance = levenshteinDistance(q, n);
  const maxLength = Math.max(q.length, n.length);
  if (maxLength === 0) return 100;
  const similarity = 1 - distance / maxLength;
  return Math.round(similarity * 60);
}

function fuzzyScore(query: string, name: string): number {
  const token = tokenScore(query, name);
  const levenshtein = levenshteinScore(query, name);
  return Math.max(token, levenshtein);
}

async function readJson<T>(filePath: string): Promise<T> {
  const content = await readFile(filePath, "utf-8");
  return JSON.parse(content) as T;
}

function pathForLevel(
  level: RegionLevel,
  code: string,
  provinceMap: Map<string, string>,
  regencyMap: Map<string, string>,
  districtMap: Map<string, string>,
): { code: string; name: string }[] {
  if (level === "provinces") return [];

  const provinceCode = code.slice(0, 2);
  const result = [{ code: provinceCode, name: provinceMap.get(provinceCode) ?? "" }];

  if (level === "regencies") return result;

  const regencyCode = code.slice(0, 4);
  result.push({ code: regencyCode, name: regencyMap.get(regencyCode) ?? "" });

  if (level === "districts") return result;

  const districtCode = code.slice(0, 6);
  result.push({ code: districtCode, name: districtMap.get(districtCode) ?? "" });

  return result;
}

function collectMatches(
  regions: Region[],
  level: RegionLevel,
  query: string,
  provinceMap: Map<string, string>,
  regencyMap: Map<string, string>,
  districtMap: Map<string, string>,
  enableFuzzy: boolean,
): SearchResult[] {
  const results: SearchResult[] = [];
  for (const region of regions) {
    const s = exactScore(query, region.name, region.code);
    if (s > 0) {
      results.push({
        code: region.code,
        name: region.name,
        level,
        path: pathForLevel(level, region.code, provinceMap, regencyMap, districtMap),
        score: s,
      });
      continue;
    }

    if (enableFuzzy) {
      const fuzzy = fuzzyScore(query, region.name);
      if (fuzzy >= FUZZY_THRESHOLD) {
        results.push({
          code: region.code,
          name: region.name,
          level,
          path: pathForLevel(level, region.code, provinceMap, regencyMap, districtMap),
          score: fuzzy,
        });
      }
    }
  }
  return results;
}

async function searchVillages(
  query: string,
  provinceMap: Map<string, string>,
  regencyMap: Map<string, string>,
  districtMap: Map<string, string>,
  enableFuzzy: boolean,
): Promise<SearchResult[]> {
  const files = (await readdir(VILLAGES_DIR)).filter((file) => file.endsWith(".json"));
  const results: SearchResult[] = [];

  const batchSize = 50;
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    const batches = await Promise.all(
      batch.map(async (file) => {
        const regencyCode = file.replace(".json", "");
        const villages = await readJson<Region[]>(path.join(VILLAGES_DIR, file));
        return collectMatches(
          villages,
          "villages",
          query,
          provinceMap,
          regencyMap,
          districtMap,
          enableFuzzy,
        ).map((result) => ({
          ...result,
          path: [
            { code: regencyCode.slice(0, 2), name: provinceMap.get(regencyCode.slice(0, 2)) ?? "" },
            { code: regencyCode, name: regencyMap.get(regencyCode) ?? "" },
            ...result.path.slice(2),
          ],
        }));
      }),
    );
    for (const list of batches) {
      results.push(...list);
    }
  }

  return results;
}

export async function searchRegions(query: string, limit = DEFAULT_LIMIT): Promise<SearchResult[]> {
  const normalized = query.trim();
  if (normalized.length < MIN_QUERY_LENGTH) {
    return [];
  }

  const [provinces, regencies, districts] = await Promise.all([
    readJson<Region[]>(path.join(DATA_DIR, "provinces.json")),
    readJson<Region[]>(path.join(DATA_DIR, "regencies.json")),
    readJson<Region[]>(path.join(DATA_DIR, "districts.json")),
  ]);

  const provinceMap = new Map(provinces.map((r) => [r.code, r.name]));
  const regencyMap = new Map(regencies.map((r) => [r.code, r.name]));
  const districtMap = new Map(districts.map((r) => [r.code, r.name]));

  const exactResults: SearchResult[] = [
    ...collectMatches(provinces, "provinces", normalized, provinceMap, regencyMap, districtMap, false),
    ...collectMatches(regencies, "regencies", normalized, provinceMap, regencyMap, districtMap, false),
    ...collectMatches(districts, "districts", normalized, provinceMap, regencyMap, districtMap, false),
    ...(await searchVillages(normalized, provinceMap, regencyMap, districtMap, false)),
  ];

  const fuzzyResults: SearchResult[] = [];
  if (exactResults.length < limit) {
    fuzzyResults.push(
      ...collectMatches(provinces, "provinces", normalized, provinceMap, regencyMap, districtMap, true),
      ...collectMatches(regencies, "regencies", normalized, provinceMap, regencyMap, districtMap, true),
      ...collectMatches(districts, "districts", normalized, provinceMap, regencyMap, districtMap, true),
      ...(await searchVillages(normalized, provinceMap, regencyMap, districtMap, true)),
    );
  }

  const seen = new Set<string>();
  const results: SearchResult[] = [];
  for (const result of [...exactResults, ...fuzzyResults].sort(
    (a, b) => b.score - a.score || a.name.localeCompare(b.name, "id-ID"),
  )) {
    const key = `${result.level}:${result.code}`;
    if (seen.has(key)) continue;
    seen.add(key);
    results.push(result);
    if (results.length >= limit) break;
  }

  return results;
}
