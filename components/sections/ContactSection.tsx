"use client";

import type { ContactProps } from "@/lib/types/layout";

export default function ContactSection({ props }: { props: Record<string, unknown> }) {
  const p = props as unknown as ContactProps;
  const fields = Array.isArray(p.fields) ? p.fields : [];

  return (
    <div className="py-16 px-6 md:px-12" style={{ background: "var(--bg-surface, #111827)" }}>
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-3" style={{ color: "var(--text-primary)" }}>{p.title}</h2>
        <p className="text-center text-sm mb-8" style={{ color: "var(--text-secondary)" }}>{p.subtitle}</p>
        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          {fields.map((f, i) => (
            <div key={i}>
              <label className="block text-xs font-semibold uppercase mb-1" style={{ color: "var(--text-secondary)" }}>{f.label}{f.required && " *"}</label>
              {f.type === "textarea" ? (
                <textarea rows={4} className="w-full p-3 rounded-xl text-sm" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-primary)", resize: "vertical" }} />
              ) : (
                <input type={f.type} className="w-full p-3 rounded-xl text-sm" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
              )}
            </div>
          ))}
          <button type="submit" className="w-full py-3 rounded-xl font-bold text-white mt-2" style={{ background: "var(--primary)", boxShadow: "0 4px 14px rgba(255,56,11,0.3)" }}>
            {p.submitText}
          </button>
        </form>
      </div>
    </div>
  );
}
