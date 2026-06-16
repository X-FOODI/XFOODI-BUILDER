"use client";

import type { StatsProps } from "@/lib/types/layout";

export default function StatsSection({ props }: { props: Record<string, unknown> }) {
  const p = props as unknown as StatsProps;
  const stats = Array.isArray(p.stats) ? p.stats : [];

  return (
    <section
      className="py-8 px-6"
      style={{
        background: p.backgroundColor || "var(--primary, #FF380B)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <div key={i} className="space-y-1">
              <p
                className="text-3xl md:text-4xl font-extrabold m-0"
                style={{ color: "#fff" }}
              >
                {s.value}
              </p>
              <p
                className="text-xs md:text-sm m-0"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
