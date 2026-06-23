import { readFile } from "fs/promises";
import path from "path";

export const REGION_LEVELS = ["provinces", "regencies", "districts", "villages"] as const;

export type RegionLevel = (typeof REGION_LEVELS)[number];

export interface Region {
  code: string;
  name: string;
}

export interface InitialSelection {
  province?: string;
  regency?: string;
  district?: string;
  village?: string;
}

export interface HierarchyPath {
  province?: Region;
  regency?: Region;
  district?: Region;
  village?: Region;
}

export interface RegionResponse {
  data: Region[];
  meta: {
    count: number;
    level: RegionLevel;
    parent: string | null;
    source: string;
  };
}

const DATA_DIR = path.join(process.cwd(), "public", "data");

const PARENT_CODE_LENGTH: Partial<Record<RegionLevel, number>> = {
  regencies: 2,
  districts: 4,
  villages: 6,
};

export class RegionDataError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "RegionDataError";
  }
}

export function isRegionLevel(value: string | null): value is RegionLevel {
  return REGION_LEVELS.includes(value as RegionLevel);
}

export function validateRegionRequest(level: RegionLevel, parent: string | null) {
  if (level === "provinces") {
    return parent === null ? null : "Provinsi tidak menerima kode induk.";
  }

  const expectedLength = PARENT_CODE_LENGTH[level];
  if (!parent || !expectedLength || !new RegExp(`^\\d{${expectedLength}}$`).test(parent)) {
    return `Kode induk untuk ${level} harus terdiri dari ${expectedLength} digit.`;
  }

  return null;
}

async function readJson<T>(filePath: string): Promise<T> {
  try {
    const content = await readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    throw new RegionDataError("Data wilayah tidak ditemukan.", 404);
  }
}

export async function fetchRegions(level: RegionLevel, parent: string | null): Promise<Region[]> {
  const validationError = validateRegionRequest(level, parent);
  if (validationError) {
    throw new RegionDataError(validationError, 400);
  }

  if (level === "provinces") {
    return readJson<Region[]>(path.join(DATA_DIR, "provinces.json"));
  }

  if (level === "regencies") {
    const all = await readJson<Region[]>(path.join(DATA_DIR, "regencies.json"));
    return parent ? all.filter((region) => region.code.startsWith(parent)) : all;
  }

  if (level === "districts") {
    const all = await readJson<Region[]>(path.join(DATA_DIR, "districts.json"));
    return parent ? all.filter((region) => region.code.startsWith(parent)) : all;
  }

  const regencyCode = parent?.slice(0, 4);
  if (!regencyCode) {
    throw new RegionDataError("Kode induk untuk desa/kelurahan tidak valid.", 400);
  }

  const all = await readJson<Region[]>(path.join(DATA_DIR, "villages", `${regencyCode}.json`));
  return parent ? all.filter((region) => region.code.startsWith(parent)) : all;
}

export function hierarchyToJson(path: HierarchyPath): string {
  return JSON.stringify(path, null, 2);
}

export function hierarchyToCsv(path: HierarchyPath): string {
  const rows: { level: string; code: string; name: string }[] = [];
  if (path.province) rows.push({ level: "province", code: path.province.code, name: path.province.name });
  if (path.regency) rows.push({ level: "regency", code: path.regency.code, name: path.regency.name });
  if (path.district) rows.push({ level: "district", code: path.district.code, name: path.district.name });
  if (path.village) rows.push({ level: "village", code: path.village.code, name: path.village.name });

  const lines = ["level,code,name"];
  for (const row of rows) {
    lines.push(`${row.level},${row.code},"${row.name.replace(/"/g, "\"\"")}"`);
  }
  return lines.join("\n");
}

export function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
