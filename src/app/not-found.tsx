import Link from "next/link";

export default function NotFound() {
  return (
    <main className="status-page">
      <div className="status-card">
        <h1>Halaman tidak ditemukan</h1>
        <p>Alamat ini tidak tersedia. Kembali ke penjelajah untuk memilih wilayah.</p>
        <Link href="/">Kembali ke penjelajah</Link>
      </div>
    </main>
  );
}
