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
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Lewati ke konten utama
      </a>

      <header className="site-header">
        <div className="page-container header-inner">
          <a className="brand" href="#main-content" aria-label="Kode Wilayah Indonesia">
            <span className="brand-mark" aria-hidden="true">
              ID
            </span>
            <span>Kode Wilayah Indonesia</span>
          </a>
          <span className="header-note">Data administratif bertingkat</span>
        </div>
      </header>

      <main id="main-content" className="page-container main-content">
        <section className="intro" aria-labelledby="page-title">
          <div>
            <p className="intro-kicker">Penjelajah wilayah</p>
            <h1 id="page-title">Temukan kode wilayah Indonesia</h1>
            <p className="intro-copy">
              Pilih provinsi, kabupaten atau kota, kecamatan, lalu desa atau kelurahan.
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
              <dd>7.266</dd>
            </div>
            <div>
              <dt>Desa/Kelurahan</dt>
              <dd>83.981</dd>
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

      <footer className="site-footer">
        <div className="page-container footer-inner">
          <p>Kode Wilayah Indonesia</p>
          <p>Data dimuat sesuai pilihan untuk menjaga aplikasi tetap cepat.</p>
        </div>
      </footer>
    </div>
  );
}
