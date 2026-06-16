"use client";

import type { AboutProps } from "@/lib/types/layout";
import { IconRenderer } from "@/lib/icons";

export default function AboutSection({ props }: { props: Record<string, unknown> }) {
  const p = props as unknown as AboutProps;
  const values = Array.isArray(p.values) ? p.values : [];

  return (
    <div className="py-16 px-6 md:px-12" style={{ background: "var(--bg-surface, #FFFFFF)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <span
              className="text-xs font-extrabold uppercase tracking-widest block"
              style={{ color: "var(--primary, #FF380B)" }}
            >
              {p.heading || "Về Chúng Tôi"}
            </span>
            <h2
              className="text-3xl md:text-4xl font-extrabold leading-tight m-0"
              style={{ color: "var(--text-primary, #0F172A)" }}
            >
              Tinh Hoa Ẩm Thực
            </h2>
            <p
              className="text-base leading-relaxed m-0"
              style={{ color: "var(--text-secondary, #64748B)" }}
            >
              {p.story}
            </p>

            {values.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {values.map((v, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-2xl flex-shrink-0">{v.icon}</span>
                    <div>
                      <h4
                        className="text-sm font-bold mb-1 m-0"
                        style={{ color: "var(--text-primary, #0F172A)" }}
                      >
                        {v.title}
                      </h4>
                      <p
                        className="text-xs m-0 leading-normal"
                        style={{ color: "var(--text-muted, #94A3B8)" }}
                      >
                        {v.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image */}
          <div
            className="rounded-3xl overflow-hidden shadow-lg"
            style={{ height: 400 }}
          >
            <img
              src={p.image}
              alt={p.heading}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
