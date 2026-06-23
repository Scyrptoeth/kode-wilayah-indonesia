import { RegionExplorer } from "@/components/region-explorer";
import type { InitialSelection } from "@/lib/regions";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
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
          Dataset berasal dari Kepmendagri No 300.2.2-2138 Tahun 2025 yang dikelola oleh
          cahyadsn/wilayah. Kode wilayah disajikan sebagai referensi; verifikasi kembali dengan
          sumber pemerintah resmi untuk penggunaan kritis.
        </p>
      </aside>
    </main>
  );
}
