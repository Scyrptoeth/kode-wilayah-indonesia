import { describe, expect, it } from "vitest";
import {
  fetchRegions,
  hierarchyToCsv,
  hierarchyToJson,
  isRegionLevel,
  RegionDataError,
  validateRegionRequest,
} from "./regions";

describe("region data adapter", () => {
  it("loads all 38 provinces", async () => {
    const provinces = await fetchRegions("provinces", null);
    expect(provinces.length).toBe(38);
    expect(provinces[0]).toEqual({ code: "11", name: "Aceh" });
  });

  it("loads regencies for a province", async () => {
    const regencies = await fetchRegions("regencies", "11");
    expect(regencies.length).toBeGreaterThan(0);
    expect(regencies[0].code.startsWith("11")).toBe(true);
  });

  it("loads districts for a regency", async () => {
    const districts = await fetchRegions("districts", "1101");
    expect(districts.length).toBeGreaterThan(0);
    expect(districts[0].code.startsWith("1101")).toBe(true);
  });

  it("loads villages for a district", async () => {
    const villages = await fetchRegions("villages", "110101");
    expect(villages.length).toBeGreaterThan(0);
    expect(villages[0].code.startsWith("110101")).toBe(true);
  });

  it("validates parent code lengths for each level", () => {
    expect(validateRegionRequest("provinces", null)).toBeNull();
    expect(validateRegionRequest("regencies", "11")).toBeNull();
    expect(validateRegionRequest("districts", "1101")).toBeNull();
    expect(validateRegionRequest("villages", "110101")).toBeNull();
    expect(validateRegionRequest("villages", "1101")).toContain("6 digit");
  });

  it("rejects invalid levels", () => {
    expect(isRegionLevel("provinces")).toBe(true);
    expect(isRegionLevel("countries")).toBe(false);
  });

  it("throws on missing village parent", async () => {
    await expect(fetchRegions("villages", null)).rejects.toBeInstanceOf(RegionDataError);
  });

  it("formats hierarchy as JSON", () => {
    const path = {
      province: { code: "11", name: "Aceh" },
      regency: { code: "1101", name: "Kabupaten Simeulue" },
    };
    const json = hierarchyToJson(path);
    expect(json).toContain("Aceh");
    expect(JSON.parse(json)).toEqual(path);
  });

  it("formats hierarchy as CSV", () => {
    const path = {
      province: { code: "11", name: "Aceh" },
      regency: { code: "1101", name: "Kabupaten Simeulue" },
    };
    const csv = hierarchyToCsv(path);
    expect(csv).toContain("level,code,name");
    expect(csv).toContain('province,11,"Aceh"');
    expect(csv).toContain('regency,1101,"Kabupaten Simeulue"');
  });
});
