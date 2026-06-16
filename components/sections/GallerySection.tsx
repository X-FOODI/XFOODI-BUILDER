"use client";

import type { GalleryProps } from "@/lib/types/layout";

export default function GallerySection({ props }: { props: Record<string, unknown> }) {
  const p = props as unknown as GalleryProps;
  const images = Array.isArray(p.images) ? p.images : [];

  return (
    <div className="py-16 px-6 md:px-12" style={{ background: "var(--bg-base, #0A0E14)" }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: "var(--text-primary, #F1F5F9)" }}>
          {p.title}
        </h2>
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${p.columns || 3}, 1fr)` }}
        >
          {images.map((img, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden group cursor-pointer"
              style={{
                aspectRatio: i === 0 && images.length > 3 ? "2/1" : "1/1",
                gridColumn: i === 0 && images.length > 3 ? "span 2" : undefined,
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
