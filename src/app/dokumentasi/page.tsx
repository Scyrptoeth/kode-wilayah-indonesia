import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dokumentasi",
  description:
    "Kontrak data, kebijakan cache, dan keterbatasan dataset kode wilayah administratif Indonesia.",
  openGraph: {
    title: "Dokumentasi | Kode Wilayah Indonesia",
    description:
      "Kontrak data, kebijakan cache, dan keterbatasan dataset kode wilayah administratif Indonesia.",
    url: "/dokumentasi",
  },
  twitter: {
    title: "Dokumentasi | Kode Wilayah Indonesia",
    description:
      "Kontrak data, kebijakan cache, dan keterbatasan dataset kode wilayah administratif Indonesia.",
  },
  alternates: {
    canonical: "/dokumentasi",
  },
};

export default function DocumentationPage() {
  return (
    <main id="main-content" className="page-container main-content">
      <article className="content-page">
        <header>
          <p className="intro-kicker">Dokumentasi</p>
          <h1>Kontrak data dan kebijakan penggunaan</h1>
        </header>

        <section aria-labelledby="data-source-heading">
          <h2 id="data-source-heading">Sumber data</h2>
          <p>
            Dataset berasal dari{" "}
            <strong>Kepmendagri No 300.2.2-2138 Tahun 2025</strong> yang dikelola oleh{" "}
            <a
              href="https://github.com/cahyadsn/wilayah"
              rel="noopener noreferrer"
              target="_blank"
            >
              cahyadsn/wilayah
            </a>{" "}
            di GitHub. Data tersebut merujuk pada kode wilayah administratif Indonesia yang
            diterbitkan oleh Kementerian Dalam Negeri (Kemendagri).
          </p>
        </section>

        <section aria-labelledby="coverage-heading">
          <h2 id="coverage-heading">Cakupan data</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Level</th>
                <th>Jumlah</th>
                <th>File lokal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Provinsi</td>
                <td>38</td>
                <td>
                  <code>public/data/provinces.json</code>
                </td>
              </tr>
              <tr>
                <td>Kabupaten/Kota</td>
                <td>514</td>
                <td>
                  <code>public/data/regencies.json</code>
                </td>
              </tr>
              <tr>
                <td>Kecamatan</td>
                <td>7.265</td>
                <td>
                  <code>public/data/districts.json</code>
                </td>
              </tr>
              <tr>
                <td>Desa/Kelurahan</td>
                <td>83.345</td>
                <td>
                  <code>public/data/villages/&#123;kodeKabKota&#125;.json</code>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section aria-labelledby="api-heading">
          <h2 id="api-heading">API wilayah</h2>
          <p>
            Endpoint <code>/api/regions?level=&#123;level&#125;&amp;parent=&#123;parent&#125;</code>{" "}
            menyajikan data normalisasi dengan cache bersama 24 jam dan stale-while-revalidate 7
            hari.
          </p>
          <ul>
            <li>
              <code>level</code> harus salah satu dari{" "}
              <code>provinces</code>, <code>regencies</code>, <code>districts</code>, atau{" "}
              <code>villages</code>.
            </li>
            <li>
              <code>provinces</code> tidak menerima kode induk.
            </li>
            <li>
              <code>regencies</code> memerlukan kode induk 2 digit.
            </li>
            <li>
              <code>districts</code> memerlukan kode induk 4 digit.
            </li>
            <li>
              <code>villages</code> memerlukan kode induk 6 digit.
            </li>
          </ul>
        </section>

        <section aria-labelledby="limitation-heading">
          <h2 id="limitation-heading">Keterbatasan</h2>
          <p>
            Dataset ini disediakan sebagai referensi. Untuk penggunaan kritis, verifikasi kembali
            dengan sumber resmi pemerintah.
          </p>
        </section>
      </article>
    </main>
  );
}
