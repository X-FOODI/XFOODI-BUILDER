"use client";

import type { InfoCardsProps } from "@/lib/types/layout";
import { IconRenderer } from "@/lib/icons";

export default function InfoCardsSection({ props }: { props: Record<string, unknown> }) {
  const p = props as unknown as InfoCardsProps;
  const cards = Array.isArray(p.cards) ? p.cards : [];

  return (
    <section className="py-12 px-6" style={{ background: "var(--bg-base, #F8FAFC)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg"
              style={{
                background: "var(--bg-surface, #ffffff)",
                borderColor: "var(--border, #E2E8F0)",
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
                style={{
                  background: "var(--primary-light, rgba(255, 56, 11, 0.15))",
                  color: "var(--primary, #FF380B)",
                }}
              >
                <IconRenderer name={card.icon} size={20} />
              </div>
              <h3
                className="text-sm font-bold mb-2 m-0"
                style={{ color: "var(--text-primary, #0F172A)" }}
              >
                {card.title}
              </h3>
              <p
                className="text-xs md:text-sm m-0 leading-relaxed"
                style={{ color: "var(--text-secondary, #64748B)" }}
              >
                {card.content}
              </p>
              {card.sub && (
                <p
                  className="text-xs mt-1 m-0"
                  style={{ color: "var(--text-muted, #94A3B8)" }}
                >
                  {card.sub}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
