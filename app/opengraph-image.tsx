import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Movementum — We turn promising ideas into global movements.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(800px 600px at 80% 0%, rgba(0,182,240,0.22), transparent 60%), radial-gradient(700px 500px at 5% 95%, rgba(93,208,245,0.16), transparent 60%), #ffffff",
          padding: "80px 88px",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 999,
              background: "#eefaff",
              border: "1px solid #a8dcf5",
              color: "#00b6f0",
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: 2.5,
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: "#00b6f0",
              }}
            />
            Movement, not marketing
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: -2,
              color: "#18181b",
              maxWidth: 1000,
            }}
          >
            We turn promising ideas into{" "}
            <span style={{ color: "#00b6f0" }}>global movements.</span>
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#52525b",
              lineHeight: 1.4,
              maxWidth: 900,
            }}
          >
            Movementum builds the machine to carry a category-defining idea
            into the world.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#71717a",
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: -0.4,
          }}
        >
          <span style={{ color: "#18181b" }}>movementum</span>
          <span style={{ fontSize: 18, color: "#a1a1aa", letterSpacing: 2 }}>
            MOVEMENTUM.IO
          </span>
        </div>
      </div>
    ),
    size
  );
}
