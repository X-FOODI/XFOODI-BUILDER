"use client";

import type { TestimonialsProps } from "@/lib/types/layout";

export default function TestimonialsSection({ props }: { props: Record<string, unknown> }) {
  const p = props as unknown as TestimonialsProps;
  const reviews = Array.isArray(p.reviews) ? p.reviews : [];

  return (
    <div className="py-16 px-6 md:px-12" style={{ background: "var(--bg-surface, #111827)" }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: "var(--text-primary, #F1F5F9)" }}>
          {p.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl"
              style={{
                background: "var(--bg-elevated, #1E293B)",
                border: "1px solid var(--border, #1E293B)",
              }}
            >
              {p.showRating && (
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <span key={si} className="text-base">
                      {si < review.rating ? "⭐" : "☆"}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-sm leading-relaxed mb-4 italic" style={{ color: "var(--text-secondary, #94A3B8)" }}>
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: "var(--primary-light, rgba(255,56,11,0.15))",
                    color: "var(--primary, #FF380B)",
                  }}
                >
                  {review.name.charAt(0)}
                </div>
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary, #F1F5F9)" }}>
                  {review.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
