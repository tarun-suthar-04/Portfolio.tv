import { ImageResponse } from "next/og";

// Route segment config
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Icon — minimal "T" monogram on dark background, matching the #090909 portfolio identity.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#090909",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "#f5f5f0",
            fontSize: 18,
            fontWeight: 600,
            fontFamily: "sans-serif",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          T
        </span>
      </div>
    ),
    { ...size }
  );
}
