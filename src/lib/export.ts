import type { Region } from "./regions";

export interface HierarchyPath {
  province?: Region;
  regency?: Region;
  district?: Region;
  village?: Region;
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
