import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
          background: "#0878b9",
          color: "#f8fbfd",
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        ID
      </div>
    ),
    size,
  );
}
