"use client";

import type { MenuGridProps, MenuItem } from "@/lib/types/layout";

export default function MenuGridSection({ props }: { props: Record<string, unknown> }) {
  const p = props as unknown as MenuGridProps;
  const categories = Array.isArray(p.categories) ? p.categories : [];

  return (
    <div className="py-16 px-6 md:px-12" style={{ background: "var(--bg-surface, #111827)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "var(--text-primary, #F1F5F9)" }}>
            {p.title}
          </h2>
          {p.subtitle && (
            <p className="text-base" style={{ color: "var(--text-secondary, #94A3B8)" }}>
              {p.subtitle}
            </p>
          )}
        </div>

        {categories.map((cat, ci) => (
          <div key={ci} className="mb-12 last:mb-0">
            <h3
              className="text-xl font-bold mb-6 pb-2"
              style={{
                color: "var(--primary, #FF380B)",
                borderBottom: "2px solid var(--primary, #FF380B)",
                display: "inline-block",
              }}
            >
              {cat.name}
            </h3>
            <div className={`grid gap-6 ${p.layout === "list" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
              {(cat.items || []).map((item: MenuItem, ii: number) => (
                <div
                  key={ii}
                  className="flex gap-4 p-4 rounded-2xl transition-all duration-300"
                  style={{
                    background: "var(--bg-card, #ffffff)",
                    border: "1px solid var(--border, #E2E8F0)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.02)",
                  }}
                >
                  {item.image && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-base font-bold m-0" style={{ color: "var(--text-primary, #0F172A)" }}>
                          {item.name}
                        </h4>
                        {item.badge && (
                          <span
                            className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-1"
                            style={{
                              background: "var(--primary-light, rgba(255, 56, 11, 0.15))",
                              color: "var(--primary, #FF380B)",
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {p.showPrices && (
                        <span className="text-base font-extrabold ml-4 whitespace-nowrap" style={{ color: "var(--primary, #FF380B)" }}>
                          {item.price}
                        </span>
                      )}
                    </div>
                    <p className="text-xs md:text-sm mt-2 m-0 leading-relaxed" style={{ color: "var(--text-secondary, #64748B)" }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
