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

function normalize(text: string): string {
  return text.toLocaleLowerCase("id-ID");
}

function score(query: string, name: string, code: string): number {
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
  const path = [{ code: provinceCode, name: provinceMap.get(provinceCode) ?? "" }];

  if (level === "regencies") return path;

  const regencyCode = code.slice(0, 4);
  path.push({ code: regencyCode, name: regencyMap.get(regencyCode) ?? "" });

  if (level === "districts") return path;

  const districtCode = code.slice(0, 6);
  path.push({ code: districtCode, name: districtMap.get(districtCode) ?? "" });

  return path;
}

function collectMatches(
  regions: Region[],
  level: RegionLevel,
  query: string,
  provinceMap: Map<string, string>,
  regencyMap: Map<string, string>,
  districtMap: Map<string, string>,
): SearchResult[] {
  const results: SearchResult[] = [];
  for (const region of regions) {
    const s = score(query, region.name, region.code);
    if (s > 0) {
      results.push({
        code: region.code,
        name: region.name,
        level,
        path: pathForLevel(level, region.code, provinceMap, regencyMap, districtMap),
        score: s,
      });
    }
  }
  return results;
}

async function searchVillages(
  query: string,
  provinceMap: Map<string, string>,
  regencyMap: Map<string, string>,
  districtMap: Map<string, string>,
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

  const results: SearchResult[] = [
    ...collectMatches(provinces, "provinces", normalized, provinceMap, regencyMap, districtMap),
    ...collectMatches(regencies, "regencies", normalized, provinceMap, regencyMap, districtMap),
    ...collectMatches(districts, "districts", normalized, provinceMap, regencyMap, districtMap),
    ...(await searchVillages(normalized, provinceMap, regencyMap, districtMap)),
  ];

  results.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, "id-ID"));

  return results.slice(0, limit);
}
