import { fetchRegions, isRegionLevel, RegionDataError } from "@/lib/regions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level");
  const parent = searchParams.get("parent");

  if (!isRegionLevel(level)) {
    return Response.json(
      { error: "Level wilayah tidak valid." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const data = await fetchRegions(level, parent);
    return Response.json(
      {
        data,
        meta: {
          count: data.length,
          level,
          parent,
          source: "Kepmendagri No 300.2.2-2138 Tahun 2025 via cahyadsn/wilayah",
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
          "X-Data-Source": "Kepmendagri No 300.2.2-2138 Tahun 2025",
        },
      },
    );
  } catch (error) {
    const status = error instanceof RegionDataError ? error.status : 500;
    const message =
      error instanceof RegionDataError ? error.message : "Data wilayah gagal dimuat.";

    return Response.json(
      { error: message },
      { status, headers: { "Cache-Control": "no-store" } },
    );
  }
}
