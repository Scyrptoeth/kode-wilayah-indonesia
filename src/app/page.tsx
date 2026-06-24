import { AnonymousFeedback } from "@/components/anonymous-feedback";
import { RegionExplorer } from "@/components/region-explorer";
import { fetchRegions, type InitialSelection, type RegionLevel } from "@/lib/regions";
import type { Metadata } from "next";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function fetchRegionName(level: RegionLevel, code: string | undefined) {
  if (!code) return undefined;
  try {
    const parentLength: Record<RegionLevel, string> = {
      provinces: "",
      regencies: code.slice(0, 2),
      districts: code.slice(0, 4),
      villages: code.slice(0, 6),
    };
    const regions = await fetchRegions(level, parentLength[level] || null);
    return regions.find((region) => region.code === code)?.name;
  } catch {
    return undefined;
  }
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const params = await searchParams;
  const provinceCode = firstValue(params.province);
  const regencyCode = firstValue(params.regency);
  const districtCode = firstValue(params.district);
  const villageCode = firstValue(params.village);

  const [provinceName, regencyName, districtName, villageName] = await Promise.all([
    fetchRegionName("provinces", provinceCode),
    fetchRegionName("regencies", regencyCode),
    fetchRegionName("districts", districtCode),
    fetchRegionName("villages", villageCode),
  ]);

  const path = [provinceName, regencyName, districtName, villageName].filter(Boolean);
  const hasSelection = path.length > 0;

  const title = hasSelection
    ? `${path.join(" › ")} — Kode Wilayah Indonesia`
    : "Kode Wilayah Indonesia";
  const description = hasSelection
    ? `Lihat kode wilayah ${path.join(" › ")} dari data Kepmendagri 2025. Telusuri provinsi, kabupaten/kota, kecamatan, dan desa/kelurahan di seluruh Indonesia.`
    : "Telusuri kode provinsi, kabupaten atau kota, kecamatan, dan desa atau kelurahan di seluruh Indonesia berdasarkan Kepmendagri 2025.";

  const selectionParams = new URLSearchParams();
  if (provinceCode) selectionParams.set("province", provinceCode);
  if (regencyCode) selectionParams.set("regency", regencyCode);
  if (districtCode) selectionParams.set("district", districtCode);
  if (villageCode) selectionParams.set("village", villageCode);
  const selectionPath = selectionParams.toString()
    ? `/?${selectionParams.toString()}`
    : "/";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: selectionPath,
    },
    twitter: {
      title,
      description,
    },
    alternates: {
      canonical: selectionPath,
    },
  };
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const initialSelection: InitialSelection = {
    province: firstValue(params.province),
    regency: firstValue(params.regency),
    district: firstValue(params.district),
    village: firstValue(params.village),
  };

  return (
    <main id="main-content" className="page-container main-content">
      <section className="intro" aria-labelledby="page-title">
        <div>
          <p className="intro-kicker">Penjelajah Wilayah</p>
          <h1 id="page-title">Telusuri data wilayah secara interaktif</h1>
          <p className="intro-copy">
            Klik salah satu provinsi, lalu navigasi ke kabupaten atau kota, kecamatan, dan
            kelurahan atau desa.
          </p>
        </div>
        <dl className="dataset-summary" aria-label="Ringkasan cakupan dataset">
          <div>
            <dt>Provinsi</dt>
            <dd>38</dd>
          </div>
          <div>
            <dt>Kabupaten/Kota</dt>
            <dd>514</dd>
          </div>
          <div>
            <dt>Kecamatan</dt>
            <dd>7.265</dd>
          </div>
          <div>
            <dt>Desa/Kelurahan</dt>
            <dd>83.345</dd>
          </div>
        </dl>
      </section>

      <RegionExplorer initialSelection={initialSelection} />

      <aside className="data-note" aria-label="Catatan sumber data">
        <strong>Sumber data</strong>
        <p>
          Dataset berasal dari Kepmendagri No 300.2.2-2138 Tahun 2025 yang dikelola secara mandiri
          oleh Pengembang. Kode wilayah disajikan sebagai referensi;
          verifikasi kembali dengan sumber pemerintah resmi untuk penggunaan kritis.
        </p>
      </aside>

      <AnonymousFeedback />
    </main>
  );
}
