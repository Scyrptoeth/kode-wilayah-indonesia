import { fetchRegions, isRegionLevel, RegionDataError } from "@/lib/regions";
import { searchRegions } from "@/lib/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level");
  const parent = searchParams.get("parent");
  const query = searchParams.get("q");

  if (level === "search") {
    if (!query || query.trim().length < 3) {
      return Response.json(
        { error: "Query pencarian minimal 3 karakter." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    try {
      const data = await searchRegions(query.trim());
      return Response.json(
        {
          data,
          meta: {
            count: data.length,
            level: "search",
            query: query.trim(),
            source: "Kepmendagri No 300.2.2-2138 Tahun 2025 via Scyrptoeth/wilayah-indonesia-data",
          },
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
            "X-Data-Source": "Kepmendagri No 300.2.2-2138 Tahun 2025",
          },
        },
      );
    } catch {
      return Response.json(
        { error: "Pencarian gagal diproses." },
        { status: 500, headers: { "Cache-Control": "no-store" } },
      );
    }
  }

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
          source: "Kepmendagri No 300.2.2-2138 Tahun 2025 via Scyrptoeth/wilayah-indonesia-data",
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
