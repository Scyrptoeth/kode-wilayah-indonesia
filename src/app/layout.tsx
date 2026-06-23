import type { Metadata, Viewport } from "next";
import { DM_Mono, DM_Sans } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kode Wilayah Indonesia",
  description:
    "Telusuri kode provinsi, kabupaten atau kota, kecamatan, dan desa atau kelurahan di seluruh Indonesia.",
  applicationName: "Kode Wilayah Indonesia",
  keywords: [
    "kode wilayah Indonesia",
    "provinsi",
    "kabupaten",
    "kecamatan",
    "desa",
    "kelurahan",
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0e141c" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${dmSans.variable} ${dmMono.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Lewati ke konten utama
        </a>

        <div className="site-shell">
          <SiteHeader />
          {children}
          <footer className="site-footer">
            <div className="page-container footer-inner">
              <p>Kode Wilayah Indonesia</p>
              <p>Data dimuat sesuai pilihan untuk menjaga aplikasi tetap cepat.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
