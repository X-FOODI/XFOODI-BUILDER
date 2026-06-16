"use client";

import type { HeaderProps } from "@/lib/types/layout";

export default function HeaderSection({ props }: { props: Record<string, unknown> }) {
  const p = props as unknown as HeaderProps;
  const links = Array.isArray(p.links) ? p.links : [];

  return (
    <header 
      className="py-4 px-6 md:px-12 flex items-center justify-between border-b transition-colors duration-300 w-full"
      style={{ 
        background: "var(--bg-surface, #FFFFFF)", 
        borderColor: "var(--border, #E2E8F0)",
      }}
    >
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between gap-4">
        {/* Logo and Business Name */}
        <div className="flex items-center gap-3">
          {p.logoUrl ? (
            <div className="w-10 h-10 rounded-lg overflow-hidden border" style={{ borderColor: "var(--border)" }}>
              <img src={p.logoUrl} alt={p.businessName} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg text-white"
              style={{ background: "var(--primary, #FF380B)" }}
            >
              {p.businessName ? p.businessName.charAt(0).toUpperCase() : "R"}
            </div>
          )}
          <span className="font-extrabold text-lg tracking-tight" style={{ color: "var(--text-primary, #0F172A)" }}>
            {p.businessName || "XFoodi Restaurant"}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.href || "#"}
              className="text-sm font-semibold transition-colors duration-200 hover:opacity-80"
              style={{ 
                color: "var(--text-secondary, #64748B)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--primary, #FF380B)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-secondary, #64748B)";
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Call to Action Button */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-flex items-center text-xs font-semibold gap-1.5 px-2.5 py-1 rounded-md border" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: "#22c55e" }} />
            Open Now
          </span>
          
          {p.ctaText && (
            <a
              href={p.ctaLink || "#"}
              className="transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{
                background: "var(--primary, #FF380B)",
                color: "#fff",
                textDecoration: "none",
                boxShadow: "0 4px 12px var(--primary-light, rgba(255, 56, 11, 0.2))",
                padding: "12px 28px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "bold",
                display: "inline-block"
              }}
            >
              {p.ctaText}
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
