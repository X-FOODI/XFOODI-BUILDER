"use client";

import type { HeaderProps } from "@/lib/types/layout";

export default function HeaderSection({ props }: { props: Record<string, unknown> }) {
  const p = props as unknown as HeaderProps;
  const links = Array.isArray(p.links) ? p.links : [];

  return (
    <header 
      style={{ 
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "var(--bg-card, var(--bg-surface, #FFFFFF))", 
        borderBottom: "1px solid var(--border, #E2E8F0)",
        backdropFilter: "blur(20px)",
        height: 72,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo and Business Name */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {p.logoUrl ? (
            <div style={{ width: 40, height: 40, borderRadius: 8, overflow: "hidden", border: "1px solid var(--border, #E2E8F0)" }}>
              <img src={p.logoUrl} alt={p.businessName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ) : (
            <div 
              style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 8, 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontWeight: "bold", 
                fontSize: 18, 
                color: "#fff",
                background: "var(--primary, #FF380B)",
              }}
            >
              {p.businessName ? p.businessName.charAt(0).toUpperCase() : "R"}
            </div>
          )}
          <span style={{ fontWeight: 800, fontSize: 18, color: "var(--text-primary, #0F172A)" }}>
            {p.businessName || "Restaurant"}
          </span>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: 24 }} className="hidden md:flex">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.href || "#"}
              style={{ 
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text-secondary, #64748B)",
                textDecoration: "none",
                transition: "color 0.2s",
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

        {/* Action Button */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ display: "inline-flex", alignItems: "center", fontSize: 12, fontWeight: 600, gap: 6, padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border, #E2E8F0)", color: "var(--text-secondary, #64748B)" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
            Open Now
          </span>
          
          {p.ctaText && (
            <a
              href={p.ctaLink || "#"}
              style={{
                background: "var(--primary, #FF380B)",
                color: "#fff",
                textDecoration: "none",
                padding: "10px 24px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "bold",
                display: "inline-block",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
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
