"use client";

import type { FooterProps } from "@/lib/types/layout";

const DEFAULT_LINKS = [
  { label: "Trang Chủ", href: "#" },
  { label: "Thực Đơn", href: "#menu" },
  { label: "Đặt Bàn", href: "#reservation" },
  { label: "Liên Hệ", href: "#contact" }
];

const DEFAULT_SOCIAL = [
  { platform: "Facebook", url: "#" },
  { platform: "Instagram", url: "#" },
  { platform: "TikTok", url: "#" }
];

export default function FooterSection({ props }: { props: Record<string, unknown> }) {
  const p = props as unknown as FooterProps;
  const links = Array.isArray(p.links) && p.links.length > 0 ? p.links : DEFAULT_LINKS;
  const social = Array.isArray(p.socialMedia) && p.socialMedia.length > 0 ? p.socialMedia : DEFAULT_SOCIAL;

  return (
    <footer 
      className="py-16 px-6 md:px-12 border-t transition-colors duration-300 w-full" 
      style={{ 
        background: "var(--bg-card, #FFFFFF)", 
        borderColor: "var(--border, #E2E8F0)" 
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Business Info Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold tracking-tight" style={{ color: "var(--primary, #FF380B)" }}>
              {p.businessName || "XFoodi Restaurant"}
            </h3>
            <p className="text-sm leading-relaxed max-w-sm" style={{ color: "var(--text-secondary, #64748B)" }}>
              {p.description || "Trải nghiệm ẩm thực trọn vẹn với nguyên liệu tươi ngon nhất và dịch vụ chăm sóc khách hàng hàng đầu."}
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text-primary, #0F172A)" }}>
              Liên Kết Nhanh
            </h4>
            <div className="flex flex-col gap-3">
              {links.map((l, i) => (
                <a 
                  key={i} 
                  href={l.href || "#"} 
                  className="text-sm transition-colors hover:underline w-fit" 
                  style={{ color: "var(--text-secondary, #64748B)", textDecoration: "none" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--primary, #FF380B)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary, #64748B)"}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social Links Column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text-primary, #0F172A)" }}>
              Kết Nối Với Chúng Tôi
            </h4>
            <div className="flex flex-col gap-3">
              {social.map((s, i) => (
                <a 
                  key={i} 
                  href={s.url || "#"} 
                  className="text-sm transition-colors hover:underline w-fit font-semibold" 
                  style={{ color: "var(--text-secondary, #64748B)", textDecoration: "none" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--primary, #FF380B)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary, #64748B)"}
                >
                  {s.platform}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright Footer Bar */}
        <div className="pt-8 text-center text-xs border-t" style={{ borderColor: "var(--border, #E2E8F0)", color: "var(--text-muted, #94A3B8)" }}>
          {p.copyright || `© ${new Date().getFullYear()} ${p.businessName || "XFoodi"}. Tất cả các quyền được bảo lưu.`}
        </div>
      </div>
    </footer>
  );
}
