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

        {/* Right: Search, Avatar, Lang, Theme */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Search Box */}
          <div 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              background: "var(--bg-base, #F8FAFC)", 
              border: "1px solid var(--border, #E2E8F0)",
              borderRadius: "9999px",
              padding: "6px 14px",
              width: 150,
            }}
            className="hidden md:flex"
          >
            <svg style={{ width: 14, height: 14, color: "var(--text-muted, #94A3B8)", marginRight: 6 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              placeholder="Tìm MXH" 
              style={{ 
                border: "none", 
                background: "transparent", 
                fontSize: 12, 
                color: "var(--text-primary, #0F172A)", 
                outline: "none",
                width: "100%",
              }} 
            />
          </div>

          {/* User Avatar */}
          <div 
            style={{ 
              width: 32, 
              height: 32, 
              borderRadius: "50%", 
              background: "#3E5C6B", 
              color: "#FFFFFF", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            N
          </div>

          {/* Language Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
            <span style={{ fontSize: 16 }}>🇻🇳</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary, #0F172A)" }}>VI</span>
            <svg style={{ width: 10, height: 10, color: "var(--text-muted, #94A3B8)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>

          {/* Theme Toggle (Mock icon) */}
          <div style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
            <svg style={{ width: 16, height: 16, color: "var(--text-muted, #64748B)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          </div>
        </div>
      </div>
    </header>
  );
}
