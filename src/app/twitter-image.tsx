import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Kode Wilayah Indonesia";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #0e141c 0%, #17212f 100%)",
          color: "#e9eef4",
          fontFamily: "DM Sans, sans-serif",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 18,
            background: "#066b9f",
            color: "#f8fbfd",
            fontSize: 26,
            fontWeight: 500,
            fontFamily: "DM Mono, monospace",
            marginBottom: 40,
          }}
        >
          ID
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
          }}
        >
          Kode Wilayah
          <br />
          Indonesia
        </h1>
        <p
          style={{
            margin: "24px 0 0",
            fontSize: 30,
            color: "#aab6c3",
            lineHeight: 1.4,
            maxWidth: 800,
          }}
        >
          Telusuri kode provinsi, kabupaten/kota, kecamatan, dan desa/kelurahan di seluruh
          Indonesia.
        </p>
      </div>
    ),
    {
      ...size,
    },
  );
}
