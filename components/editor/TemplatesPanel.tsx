"use client";

import { useState } from "react";
import { useEditorStore } from "@/lib/store/editor-store";
import type { SectionConfig, LayoutTheme, LayoutSEO } from "@/lib/types/layout";
import { getDefaultProps } from "@/lib/sections/registry";
import { Check, Star, Soup, Fish, Wine, Flame, Coffee, Waves } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<any>;
  theme: LayoutTheme;
  seo: LayoutSEO;
  sections: SectionConfig[];
}

function genId(type: string, idx: number): string {
  return `sec_${type}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}_${idx}`;
}

const TEMPLATES: Template[] = [
  {
    id: "modern-viet",
    name: "Phở & Bún Hiện Đại",
    description: "Không gian ẩm thực Việt thanh lịch, hiện đại và tối giản.",
    category: "Món Việt",
    icon: Soup,
    theme: { primaryColor: "#FF380B", fontFamily: "Inter, sans-serif", mode: "dark", borderRadius: "rounded" },
    seo: { title: "Phở Hà Nội — Hương Vị Cổ Truyền", description: "Hương vị phở chuẩn ngon Hà Nội" },
    sections: [
      { id: "h0", type: "header", visible: true, order: 0, props: { businessName: "Phở Hà Nội", logoUrl: "", links: [{ label: "Trang Chủ", href: "#" }, { label: "Thực Đơn", href: "#menu" }, { label: "Đặt Bàn", href: "#reservation" }], ctaText: "Đặt Bàn", ctaLink: "#reservation" } },
      { id: "h1", type: "hero", visible: true, order: 1, props: { ...getDefaultProps("hero"), title: "Phở Hà Nội", subtitle: "Hương vị truyền thống từ năm 1985", backgroundImage: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1920&q=80", ctaText: "Đặt Bàn Ngay", overlayOpacity: 0.55 } },
      { id: "h2", type: "menu-featured", visible: true, order: 2, props: { ...getDefaultProps("menu-featured"), title: "Món Ăn Yêu Thích", items: [] } },
      { id: "h3", type: "about", visible: true, order: 3, props: { ...getDefaultProps("about"), heading: "Câu Chuyện Của Chúng Tôi", story: "Giữ gìn công thức ninh xương gia truyền qua ba thế hệ. Mỗi bát phở chứa đựng hương vị tinh tế của Hà Nội xưa.", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80" } },
      { id: "h4", type: "gallery", visible: true, order: 4, props: getDefaultProps("gallery") },
      { id: "h5", type: "opening-hours", visible: true, order: 5, props: getDefaultProps("opening-hours") },
      { id: "h6", type: "location-map", visible: true, order: 6, props: { ...getDefaultProps("location-map"), address: "36 Phố Hàng Bông, Hoàn Kiếm, Hà Nội" } },
      { id: "h7", type: "footer", visible: true, order: 7, props: { ...getDefaultProps("footer"), businessName: "Phở Hà Nội" } },
    ],
  },
  {
    id: "japanese-minimal",
    name: "Sushi & Sashimi Nhật",
    description: "Nhà hàng Nhật Bản tối giản, tông màu đen-vàng quý phái.",
    category: "Món Á",
    icon: Fish,
    theme: { primaryColor: "#D4A76A", fontFamily: "'Playfair Display', serif", mode: "dark", borderRadius: "sharp" },
    seo: { title: "Sushi Sakura — Omakase Dining", description: "Trải nghiệm sushi cao cấp" },
    sections: [
      { id: "j0", type: "header", visible: true, order: 0, props: { businessName: "Sushi Sakura", logoUrl: "", links: [{ label: "Trang Chủ", href: "#" }, { label: "Thực Đơn", href: "#menu" }, { label: "Đặt Chỗ", href: "#reservation" }], ctaText: "Đặt Bàn Omakase", ctaLink: "#reservation" } },
      { id: "j1", type: "hero", visible: true, order: 1, props: { title: "Sushi Sakura", subtitle: "Nghệ Thuật Ẩm Thực Omakase Nhật Bản", backgroundImage: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1920&q=80", ctaText: "Đặt Chỗ Ngay", ctaLink: "#reservation", overlayOpacity: 0.6 } },
      { id: "j2", type: "menu-featured", visible: true, order: 2, props: { ...getDefaultProps("menu-featured"), title: "Món Độc Quyền", items: [{ name: "Cá Hồi Na Uy", description: "Từng lát cá hồi tươi ngon thái lát mỏng chuẩn vị", price: "180.000₫", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80" }, { name: "Bụng Cá Ngừ Otoro", description: "Vị béo ngậy ngọt tan ngay trên đầu lưỡi", price: "350.000₫", image: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600&q=80" }] } },
      { id: "j3", type: "about", visible: true, order: 3, props: { heading: "Triết Lý Sáng Tạo", story: "Mỗi lát cá đều được cắt tỉ mỉ bằng tay và phục vụ ở nhiệt độ chuẩn xác để tôn vinh hương vị biển cả.", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80", values: [{ icon: "Fish", title: "Tươi Sống Hằng Ngày", description: "Nhập khẩu trực tiếp qua đường hàng không" }] } },
      { id: "j4", type: "testimonials", visible: true, order: 4, props: getDefaultProps("testimonials") },
      { id: "j5", type: "footer", visible: true, order: 5, props: { ...getDefaultProps("footer"), businessName: "Sushi Sakura", description: "Omakase Experience Since 2010" } },
    ],
  },
  {
    id: "italian-elegant",
    name: "Trattoria Italiana (Ý)",
    description: "Phong cách châu Âu cổ điển, lãng mạn, ẩm thực Ý tinh tế.",
    category: "Món Âu",
    icon: Wine,
    theme: { primaryColor: "#8B1A1A", fontFamily: "'Playfair Display', serif", mode: "dark", borderRadius: "rounded" },
    seo: { title: "La Maison — Ristorante Italiano", description: "Hương vị ẩm thực Ý chuẩn vị" },
    sections: [
      { id: "i0", type: "header", visible: true, order: 0, props: { businessName: "La Maison", logoUrl: "", links: [{ label: "Trang Chủ", href: "#" }, { label: "Thực Đơn", href: "#menu" }, { label: "Đặt Bàn", href: "#reservation" }], ctaText: "Đặt Bàn Ý", ctaLink: "#reservation" } },
      { id: "i1", type: "hero", visible: true, order: 1, props: { title: "La Maison", subtitle: "Ristorante Italiano — Hương Vị Nước Ý Đích Thực", backgroundImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80", ctaText: "Xem Thực Đơn", ctaLink: "#menu", overlayOpacity: 0.5 } },
      { id: "i2", type: "menu-featured", visible: true, order: 2, props: { title: "Món Ăn Đặc Trưng", items: [{ name: "Truffle Risotto", description: "Cơm Ý Arborio quyện hương nấm truffle đen thượng hạng", price: "380.000₫", image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&q=80" }] } },
      { id: "i3", type: "about", visible: true, order: 3, props: { heading: "Câu Chuyện Của La Maison", story: "Mang tinh hoa ẩm thực từ vùng đồi Tuscany xinh đẹp đến giữa trung tâm Sài Gòn nhộn nhịp.", image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80" } },
      { id: "i4", type: "footer", visible: true, order: 4, props: { ...getDefaultProps("footer"), businessName: "La Maison" } },
    ],
  },
  {
    id: "korean-bbq",
    name: "Korean BBQ & Lẩu",
    description: "Nhà hàng nướng lẩu Hàn Quốc trẻ trung, tông đỏ ấm cúng.",
    category: "Món Á",
    icon: Flame,
    theme: { primaryColor: "#FF380B", fontFamily: "Inter, sans-serif", mode: "dark", borderRadius: "rounded" },
    seo: { title: "Gogi House — Korean BBQ", description: "Bữa tiệc nướng lẩu Hàn Quốc" },
    sections: [
      { id: "k0", type: "header", visible: true, order: 0, props: { businessName: "Gogi House", logoUrl: "", links: [{ label: "Trang Chủ", href: "#" }, { label: "Thực Đơn", href: "#menu" }, { label: "Khuyến Mãi", href: "#promo" }], ctaText: "Đặt Lịch Ngay", ctaLink: "#reservation" } },
      { id: "k1", type: "hero", visible: true, order: 1, props: { title: "Gogi House", subtitle: "Nướng Lẩu Hàn Quốc — Trải Nghiệm Chuẩn Vị K-BBQ", backgroundImage: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=1920&q=80", ctaText: "Đặt Bàn Ngay", ctaLink: "#reservation", overlayOpacity: 0.5 } },
      { id: "k2", type: "menu-featured", visible: true, order: 2, props: { ...getDefaultProps("menu-featured"), title: "Món Nướng Đặc Sắc" } },
      { id: "k3", type: "footer", visible: true, order: 3, props: { ...getDefaultProps("footer"), businessName: "Gogi House" } },
    ],
  },
  {
    id: "coffee-brunch",
    name: "Café & Brunch Tiệm Bánh",
    description: "Không gian tiệm cà phê nhẹ nhàng phong cách pastel châu Âu.",
    category: "Cà Phê",
    icon: Coffee,
    theme: { primaryColor: "#D4A76A", fontFamily: "Inter, sans-serif", mode: "light", borderRadius: "pill" },
    seo: { title: "The Morning Cafe", description: "Cà phê specialty và brunch" },
    sections: [
      { id: "c0", type: "header", visible: true, order: 0, props: { businessName: "The Morning", logoUrl: "", links: [{ label: "Cà Phê", href: "#" }, { label: "Điểm Tâm", href: "#menu" }, { label: "Giờ Mở Cửa", href: "#hours" }], ctaText: "Ghé Cửa Hàng", ctaLink: "#hours" } },
      { id: "c1", type: "hero", visible: true, order: 1, props: { title: "The Morning Cafe", subtitle: "Ly cà phê đặc sản khởi đầu ngày mới ngập tràn năng lượng", backgroundImage: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1920&q=80", ctaText: "Xem Menu Cà Phê", ctaLink: "#menu", overlayOpacity: 0.4 } },
      { id: "c2", type: "menu-featured", visible: true, order: 2, props: { title: "Cà Phê & Điểm Tâm" } },
      { id: "c3", type: "opening-hours", visible: true, order: 3, props: getDefaultProps("opening-hours") },
      { id: "c4", type: "footer", visible: true, order: 4, props: { ...getDefaultProps("footer"), businessName: "The Morning" } },
    ],
  },
  {
    id: "seafood-luxury",
    name: "Hải Sản Cao Cấp",
    description: "Không gian ẩm thực biển cả sang trọng, đẳng cấp 5 sao.",
    category: "Món Việt",
    icon: Waves,
    theme: { primaryColor: "#1E3A5F", fontFamily: "'Playfair Display', serif", mode: "dark", borderRadius: "rounded" },
    seo: { title: "Ocean Bay Seafood", description: "Hải sản tươi sống cao cấp" },
    sections: [
      { id: "s0", type: "header", visible: true, order: 0, props: { businessName: "Ocean Bay", logoUrl: "", links: [{ label: "Trang Chủ", href: "#" }, { label: "Hải Sản Tươi", href: "#menu" }, { label: "Đặt Tiệc", href: "#reservation" }], ctaText: "Đặt Phòng VIP", ctaLink: "#reservation" } },
      { id: "s1", type: "hero", visible: true, order: 1, props: { title: "Ocean Bay Seafood", subtitle: "Thưởng Thức Hương Vị Biển Khơi Tươi Sống Tuyệt Hảo", backgroundImage: "https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=1920&q=80", ctaText: "Đặt Tiệc Hải Sản", ctaLink: "#reservation", overlayOpacity: 0.55 } },
      { id: "s2", type: "menu-featured", visible: true, order: 2, props: { title: "Bàn Tiệc Hải Sản" } },
      { id: "s3", type: "footer", visible: true, order: 3, props: { ...getDefaultProps("footer"), businessName: "Ocean Bay" } },
    ],
  }
];

export default function TemplatesPanel() {
  const { applyTemplate, sections, theme } = useEditorStore();
  const [activeCategory, setActiveCategory] = useState<string>("Tất cả");

  const categories = ["Tất cả", "Món Việt", "Món Á", "Món Âu", "Cà Phê"];

  const filteredTemplates = activeCategory === "Tất cả" 
    ? TEMPLATES 
    : TEMPLATES.filter((t) => t.category === activeCategory);

  const handleApply = (template: Template) => {
    const confirmApply = window.confirm(`Bạn có chắc chắn muốn áp dụng template "${template.name}"? Hành động này sẽ thay thế bố cục thiết kế hiện tại của bạn.`);
    if (!confirmApply) return;

    // Generate brand-new section IDs to avoid key collisions
    const freshSections = template.sections.map((s, idx) => ({
      ...s,
      id: genId(s.type, idx),
      props: { ...s.props }
    }));

    applyTemplate(freshSections, { ...template.theme }, { ...template.seo }, template.name);
  };

  return (
    <div className="p-4 select-none">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white mb-1">Giao Diện Mẫu Website</h3>
        <p className="text-xs text-gray-400">Chọn một trong những giao diện thiết kế được tuyển chọn dành riêng cho ẩm thực</p>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all duration-200"
            style={{
              background: activeCategory === cat ? "var(--primary)" : "rgba(255,255,255,0.05)",
              borderColor: activeCategory === cat ? "var(--primary)" : "rgba(255,255,255,0.1)",
              color: activeCategory === cat ? "#fff" : "var(--text-secondary)",
              cursor: "pointer"
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Templates */}
      <div className="flex flex-col gap-3">
        {filteredTemplates.map((template) => {
          const Icon = template.icon;
          return (
            <div
              key={template.id}
              onClick={() => handleApply(template)}
              className="p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 group"
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                borderColor: "rgba(255, 255, 255, 0.08)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.background = "rgba(255, 56, 11, 0.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
              }}
            >
              {/* Left Content */}
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <Icon size={20} style={{ color: template.theme.primaryColor }} />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">
                    {template.name}
                  </div>
                  <div className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                    {template.description}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span 
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                      style={{ background: "rgba(255,255,255,0.08)", color: "var(--text-secondary)" }}
                    >
                      {template.category}
                    </span>
                    <span className="text-[9px] text-gray-600">|</span>
                    <span className="text-[9px] text-gray-500 font-mono capitalize">
                      {template.theme.fontFamily.split(",")[0].replace(/'/g, "")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Palette Dot */}
              <div className="flex flex-col items-center gap-2">
                <div 
                  className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center shadow-inner"
                  style={{ background: template.theme.primaryColor }}
                >
                  {template.theme.mode === "light" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="text-[8px] text-gray-600 uppercase font-mono tracking-widest">
                  {template.theme.mode}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
