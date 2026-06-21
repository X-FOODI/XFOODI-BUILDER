"use client";

import type { HeaderProps } from "@/lib/types/layout";

export default function HeaderSection({ props }: { props: Record<string, unknown> }) {
  const p = props as unknown as HeaderProps;
  const links = Array.isArray(p.links) ? p.links : [];

  return (
    <header 
      style={{ 
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent", 
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div 
        style={{ 
          maxWidth: 1400, 
          width: "100%", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          background: "var(--bg-card, var(--bg-surface, #FFFFFF))", 
          border: "1px solid var(--border, #E2E8F0)",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
          borderRadius: "9999px",
          padding: "10px 28px",
          transition: "all 0.3s",
        }}
      >
        {/* Left: Logo and Business Name */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {p.logoUrl ? (
            <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", border: "1px solid var(--border, #E2E8F0)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={p.logoUrl} alt={p.businessName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ) : (
            <div 
              style={{ 
                width: 32, 
                height: 32, 
                borderRadius: "50%", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontWeight: "bold", 
                fontSize: 14, 
                color: "#fff",
                background: "var(--primary, #FF380B)",
              }}
            >
              {p.businessName ? p.businessName.charAt(0).toUpperCase() : "X"}
            </div>
          )}
          <span style={{ fontWeight: 800, fontSize: 16, color: "var(--text-primary, #0F172A)", letterSpacing: "-0.02em" }}>
            {p.businessName || "XFoodi"}
          </span>
        </div>

        {/* Middle: Navigation Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: 20 }} className="hidden lg:flex">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.href || "#"}
              style={{ 
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-secondary, #64748B)",
                textDecoration: "none",
                transition: "color 0.2s",
                whiteSpace: "nowrap",
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

        {/* Right: Open Now badge + CTA button (mirrors live PublishedHeader) */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Open Now badge */}
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            fontSize: 12,
            fontWeight: 600,
            gap: 6,
            padding: "4px 12px",
            borderRadius: 6,
            border: "1px solid var(--border, #E2E8F0)",
            color: "var(--text-secondary, #64748B)",
            whiteSpace: "nowrap",
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
            Open Now
          </span>

          {/* CTA button */}
          {p.ctaText && (
            <a
              href={p.ctaLink || "#"}
              style={{
                background: "var(--primary, #FF380B)",
                color: "#fff",
                textDecoration: "none",
                padding: "9px 20px",
                borderRadius: "8px",
                fontSize: 13,
                fontWeight: 700,
                display: "inline-block",
                whiteSpace: "nowrap",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              {p.ctaText}
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
