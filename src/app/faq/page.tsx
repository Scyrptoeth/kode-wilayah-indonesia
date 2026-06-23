import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Pertanyaan umum seputar kode wilayah administratif Indonesia dan cara menggunakan penjelajah wilayah.",
  openGraph: {
    title: "FAQ | Kode Wilayah Indonesia",
    description:
      "Pertanyaan umum seputar kode wilayah administratif Indonesia dan cara menggunakan penjelajah wilayah.",
    url: "/faq",
  },
  twitter: {
    title: "FAQ | Kode Wilayah Indonesia",
    description:
      "Pertanyaan umum seputar kode wilayah administratif Indonesia dan cara menggunakan penjelajah wilayah.",
  },
  alternates: {
    canonical: "/faq",
  },
};

interface FaqItem {
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    question: "Apa itu kode wilayah administratif Indonesia?",
    answer:
      "Kode wilayah adalah kode numerik yang diterbitkan oleh Kementerian Dalam Negeri untuk mengidentifikasi provinsi, kabupaten/kota, kecamatan, dan desa/kelurahan di Indonesia.",
  },
  {
    question: "Dari mana data ini berasal?",
    answer:
      "Data berasal dari Kepmendagri No 300.2.2-2138 Tahun 2025 yang dikelola secara mandiri di repositori Scyrptoeth/wilayah-indonesia-data di GitHub.",
  },
  {
    question: "Apakah data ini resmi?",
    answer:
      "Data disajikan sebagai referensi. Untuk keperluan resmi atau kritis, selalu verifikasi langsung dengan sumber pemerintah yang berwenang.",
  },
  {
    question: "Bagaimana cara menyalin kode wilayah?",
    answer:
      "Pilih wilayah hingga level yang diinginkan, lalu klik ikon salin di sebelah kanan nama wilayah. Kode akan tersalin ke clipboard.",
  },
  {
    question: "Mengapa daftar desa/kelurahan terasa lambat?",
    answer:
      "Aplikasi memuat desa/kelurahan setelah kamu memilih kecamatan untuk menjaga performa. Pada daerah dengan banyak desa, muat pertama bisa memerlukan waktu beberapa saat.",
  },
  {
    question: "Bisakah saya membagikan hasil pilihan?",
    answer:
      "Ya. URL di browser akan otomatis terupdate saat kamu memilih wilayah, sehingga kamu bisa membagikan link tersebut.",
  },
];

export default function FaqPage() {
  return (
    <main id="main-content" className="page-container main-content">
      <article className="content-page">
        <header>
          <p className="intro-kicker">FAQ</p>
          <h1>Pertanyaan yang sering diajukan</h1>
        </header>

        <dl className="faq-list">
          {faqItems.map((item, index) => (
            <div key={index} className="faq-item">
              <dt>{item.question}</dt>
              <dd>{item.answer}</dd>
            </div>
          ))}
        </dl>
      </article>
    </main>
  );
}
