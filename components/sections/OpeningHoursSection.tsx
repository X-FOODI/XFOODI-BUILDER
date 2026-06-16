"use client";

import type { OpeningHoursProps } from "@/lib/types/layout";

export default function OpeningHoursSection({ props }: { props: Record<string, unknown> }) {
  const p = props as unknown as OpeningHoursProps;
  const hours = Array.isArray(p.hours) ? p.hours : [];

  return (
    <div className="py-16 px-6 md:px-12" style={{ background: "var(--bg-surface, #FFFFFF)" }}>
      <div className="max-w-xl mx-auto text-center">
        <span
          className="text-xs font-extrabold uppercase tracking-widest block mb-2"
          style={{ color: "var(--primary, #FF380B)" }}
        >
          Thời Gian Phục Vụ
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8 m-0" style={{ color: "var(--text-primary, #0F172A)" }}>
          {p.title}
        </h2>
        <div 
          className="text-left p-6 rounded-3xl border"
          style={{ 
            background: "var(--bg-card, #ffffff)",
            borderColor: "var(--border, #E2E8F0)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.02)"
          }}
        >
          <div className="space-y-0">
            {hours.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3"
                style={{
                  borderBottom: i < hours.length - 1 ? "1px solid var(--border, #E2E8F0)" : "none",
                }}
              >
                <span className="text-sm font-bold" style={{ color: "var(--text-primary, #0F172A)" }}>
                  {h.day}
                </span>
                {h.closed ? (
                  <span className="text-sm font-medium" style={{ color: "var(--text-muted, #94A3B8)" }}>
                    Đóng Cửa
                  </span>
                ) : (
                  <span className="text-sm font-semibold" style={{ color: "var(--text-secondary, #64748B)" }}>
                    {h.open} - {h.close}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        {p.note && (
          <p className="text-xs text-center mt-4 italic m-0" style={{ color: "var(--text-muted, #94A3B8)" }}>
            {p.note}
          </p>
        )}
      </div>
    </div>
  );
}
