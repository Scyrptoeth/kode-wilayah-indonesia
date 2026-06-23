import type { Metadata, Viewport } from "next";
import { DM_Mono, DM_Sans } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeScript } from "@/components/theme-script";
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
  metadataBase: new URL("https://kode-wilayah-indonesia-ecru.vercel.app"),
  title: {
    default: "Kode Wilayah Indonesia",
    template: "%s | Kode Wilayah Indonesia",
  },
  description:
    "Telusuri kode provinsi, kabupaten atau kota, kecamatan, dan desa atau kelurahan di seluruh Indonesia berdasarkan Kepmendagri 2025.",
  applicationName: "Kode Wilayah Indonesia",
  keywords: [
    "kode wilayah Indonesia",
    "provinsi",
    "kabupaten",
    "kecamatan",
    "desa",
    "kelurahan",
    "kode POS",
    "wilayah administratif",
  ],
  authors: [{ name: "Kode Wilayah Indonesia" }],
  creator: "Kode Wilayah Indonesia",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Kode Wilayah Indonesia",
    title: "Kode Wilayah Indonesia",
    description:
      "Telusuri kode provinsi, kabupaten atau kota, kecamatan, dan desa atau kelurahan di seluruh Indonesia.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kode Wilayah Indonesia",
    description:
      "Telusuri kode provinsi, kabupaten atau kota, kecamatan, dan desa atau kelurahan di seluruh Indonesia.",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0e141c" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${dmSans.variable} ${dmMono.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>
          <a className="skip-link" href="#main-content">
            Lewati ke konten utama
          </a>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Kode Wilayah Indonesia",
                url: "https://kode-wilayah-indonesia-ecru.vercel.app",
                description:
                  "Telusuri kode provinsi, kabupaten atau kota, kecamatan, dan desa atau kelurahan di seluruh Indonesia.",
                inLanguage: "id",
              }),
            }}
          />

          <div className="site-shell">
            <SiteHeader />
            {children}
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
