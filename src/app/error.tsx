"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="status-page">
      <div className="status-card" role="alert">
        <h1>Halaman tidak dapat dimuat</h1>
        <p>Coba muat ulang halaman. Pilihan wilayah yang tersimpan di URL tetap dapat digunakan.</p>
        <button type="button" onClick={reset}>
          Muat ulang
        </button>
      </div>
    </main>
  );
}
