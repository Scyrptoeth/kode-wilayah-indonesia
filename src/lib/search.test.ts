import { describe, expect, it } from "vitest";
import { searchRegions } from "./search";

describe("searchRegions", () => {
  it("returns exact province matches", async () => {
    const results = await searchRegions("Jawa Barat");
    expect(results.some((r) => r.name === "Jawa Barat" && r.level === "provinces")).toBe(true);
  });

  it("returns substring matches for regencies", async () => {
    const results = await searchRegions("Kabupaten Bandung");
    expect(results.some((r) => r.level === "regencies" && r.name.includes("Bandung"))).toBe(true);
  });

  it("tolerates common typos with fuzzy matching", async () => {
    const results = await searchRegions("jawa brat");
    expect(results.some((r) => r.name === "Jawa Barat")).toBe(true);
  });

  it("returns empty array for short queries", async () => {
    const results = await searchRegions("ja");
    expect(results).toHaveLength(0);
  });

  it("limits results to 20 by default", async () => {
    const results = await searchRegions("ban");
    expect(results.length).toBeLessThanOrEqual(20);
  });
});
