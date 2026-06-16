"use client";

import type { ReservationCTAProps } from "@/lib/types/layout";

export default function ReservationCTASection({ props }: { props: Record<string, unknown> }) {
  const p = props as unknown as ReservationCTAProps;

  return (
    <div
      className="relative py-20 px-6 md:px-12 flex items-center justify-center text-center"
      style={{
        backgroundImage: p.backgroundImage ? `url(${p.backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        background: p.backgroundImage
          ? undefined
          : "linear-gradient(135deg, var(--bg-base, #0A0E14) 0%, var(--bg-elevated, #1E293B) 100%)",
      }}
    >
      {p.backgroundImage && (
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)" }} />
      )}
      <div className="relative z-10 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#fff" }}>
          {p.title}
        </h2>
        <p className="text-base mb-8" style={{ color: "rgba(255,255,255,0.8)" }}>
          {p.description}
        </p>
        <a
          href={p.buttonLink || "#"}
          className="transition-all hover:-translate-y-0.5"
          style={{
            background: "var(--primary, #FF380B)",
            color: "#fff",
            boxShadow: "0 4px 14px rgba(255,56,11,0.4)",
            textDecoration: "none",
            padding: "14px 32px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            display: "inline-block"
          }}
        >
          {p.buttonText}
        </a>
      </div>
    </div>
  );
}
