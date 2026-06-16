"use client";

import { useState } from "react";
import type { SectionConfig, LayoutTheme, LayoutSEO } from "@/lib/types/layout";
import { ArrowLeft, Eye, Check } from "lucide-react";
import SectionRenderer from "@/components/sections/SectionRenderer";
import { getDefaultProps } from "@/lib/sections/registry";
import { IconRenderer } from "@/lib/icons";

interface Props {
  onBack: () => void;
  onSelect: (sections: SectionConfig[], theme: Record<string, unknown>, seo: Record<string, unknown>, name: string) => void;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string; // Lucide icon name
  theme: LayoutTheme;
  seo: LayoutSEO;
  sections: SectionConfig[];
}

function genId(): string {
  return `sec_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

const TEMPLATES: Template[] = [
  {
    id: "modern-viet",
    name: "Phở & Bún Hiện Đại",
    description: "Template dành cho quán ăn Việt Nam phong cách hiện đại, tối giản",
    category: "Vietnamese",
    preview: "Soup",
    theme: { primaryColor: "#FF380B", fontFamily: "Inter, sans-serif", mode: "dark", borderRadius: "rounded" },
    seo: { title: "Phở Hà Nội — Hương Vị Truyền Thống", description: "Thưởng thức phở và bún truyền thống Hà Nội" },
    sections: [
      { id: genId(), type: "hero", visible: true, order: 0, props: { ...getDefaultProps("hero"), title: "Phở Hà Nội", subtitle: "Hương vị truyền thống từ năm 1985", backgroundImage: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1920&q=80", ctaText: "Đặt Bàn Ngay", overlayOpacity: 0.55 } },
      { id: genId(), type: "menu-featured", visible: true, order: 1, props: { ...getDefaultProps("menu-featured"), title: "Món Nổi Bật", items: [{ name: "Phở Bò Tái Chín", description: "Nước dùng ninh 12 giờ, bánh phở tươi", price: "65,000₫", badge: "Best Seller" }, { name: "Bún Chả Hà Nội", description: "Chả nướng than hoa, bún tươi", price: "55,000₫", badge: "Signature" }, { name: "Phở Gà Rang", description: "Gà ta rang giòn, hành phi", price: "70,000₫", badge: "New" }] } },
      { id: genId(), type: "about", visible: true, order: 2, props: { ...getDefaultProps("about"), heading: "Câu Chuyện Của Chúng Tôi", story: "Từ một quán phở nhỏ trên phố cổ Hà Nội, chúng tôi đã giữ gìn công thức gia truyền qua ba thế hệ. Mỗi bát phở là sự kết hợp tinh tế giữa nước dùng đậm đà và nguyên liệu tươi ngon nhất.", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80" } },
      { id: genId(), type: "gallery", visible: true, order: 3, props: getDefaultProps("gallery") },
      { id: genId(), type: "opening-hours", visible: true, order: 4, props: getDefaultProps("opening-hours") },
      { id: genId(), type: "reservation-cta", visible: true, order: 5, props: { ...getDefaultProps("reservation-cta"), title: "Đặt Bàn Ngay", description: "Đảm bảo chỗ ngồi cho bữa ăn hoàn hảo", backgroundImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80" } },
      { id: genId(), type: "location-map", visible: true, order: 6, props: { ...getDefaultProps("location-map"), address: "36 Phố Hàng Bông, Hoàn Kiếm, Hà Nội" } },
      { id: genId(), type: "footer", visible: true, order: 7, props: { ...getDefaultProps("footer"), businessName: "Phở Hà Nội" } },
    ],
  },
  {
    id: "japanese-minimal",
    name: "Sushi & Sashimi",
    description: "Phong cách tối giản Nhật Bản, tông màu trầm sang trọng",
    category: "Japanese",
    preview: "Fish",
    theme: { primaryColor: "#D4A76A", fontFamily: "'Playfair Display', serif", mode: "dark", borderRadius: "sharp" },
    seo: { title: "Sushi Sakura — Omakase Experience", description: "Trải nghiệm Omakase đích thực từ đầu bếp Nhật Bản" },
    sections: [
      { id: genId(), type: "hero", visible: true, order: 0, props: { title: "Sushi Sakura", subtitle: "Omakase Experience — Nghệ Thuật Ẩm Thực Nhật Bản", backgroundImage: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1920&q=80", ctaText: "Đặt Chỗ", ctaLink: "#reservation", overlayOpacity: 0.6 } },
      { id: genId(), type: "menu-grid", visible: true, order: 1, props: { ...getDefaultProps("menu-grid"), title: "Thực Đơn", subtitle: "Nguyên liệu tươi sống nhập khẩu hàng ngày", categories: [{ name: "Sashimi", items: [{ name: "Cá Hồi Na Uy", description: "Phi lê cá hồi tươi", price: "180,000₫" }, { name: "Bụng Cá Ngừ", description: "Otoro grade A", price: "350,000₫" }] }, { name: "Sushi", items: [{ name: "Set Sushi 8 miếng", description: "Tuyển chọn của bếp trưởng", price: "280,000₫" }, { name: "Dragon Roll", description: "Unagi, avocado, tobiko", price: "220,000₫" }] }], showPrices: true, layout: "list" } },
      { id: genId(), type: "about", visible: true, order: 2, props: { heading: "Triết Lý Của Chúng Tôi", story: "Với hơn 15 năm kinh nghiệm, đầu bếp trưởng Tanaka mang đến nghệ thuật Omakase chính thống. Mỗi lát cá đều được cắt bằng dao thủ công và phục vụ ở nhiệt độ hoàn hảo.", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80", values: [{ icon: "Fish", title: "Nguyên Liệu Tươi Sống", description: "Nhập khẩu trực tiếp từ chợ Tsukiji" }, { icon: "ChefHat", title: "Kỹ Thuật Truyền Thống", description: "Edomae sushi 200 năm lịch sử" }] } },
      { id: genId(), type: "testimonials", visible: true, order: 3, props: getDefaultProps("testimonials") },
      { id: genId(), type: "reservation-cta", visible: true, order: 4, props: { title: "Trải Nghiệm Omakase", description: "Chỉ phục vụ 20 khách mỗi tối — Đặt chỗ trước", buttonText: "Đặt Bàn Omakase", buttonLink: "#", backgroundImage: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=1920&q=80" } },
      { id: genId(), type: "location-map", visible: true, order: 5, props: { ...getDefaultProps("location-map"), title: "Tìm Chúng Tôi" } },
      { id: genId(), type: "footer", visible: true, order: 6, props: { ...getDefaultProps("footer"), businessName: "Sushi Sakura", description: "Omakase Experience Since 2010" } },
    ],
  },
  {
    id: "italian-elegant",
    name: "Trattoria Italiana",
    description: "Nhà hàng Ý sang trọng với tông ấm và typography cổ điển",
    category: "Italian",
    preview: "Wine",
    theme: { primaryColor: "#8B1A1A", fontFamily: "'Playfair Display', serif", mode: "dark", borderRadius: "rounded" },
    seo: { title: "La Maison — Ristorante Italiano", description: "Authentic Italian dining in the heart of the city" },
    sections: [
      { id: genId(), type: "hero", visible: true, order: 0, props: { title: "La Maison", subtitle: "Ristorante Italiano — Hương Vị Nước Ý Đích Thực", backgroundImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80", ctaText: "Xem Menu", ctaLink: "#menu", overlayOpacity: 0.5 } },
      { id: genId(), type: "menu-featured", visible: true, order: 1, props: { title: "Piatti Speciali", items: [{ name: "Truffle Risotto", description: "Arborio rice with black truffle", price: "380,000₫", badge: "Chef's Choice" }, { name: "Osso Buco", description: "Braised veal shank Milanese", price: "450,000₫", badge: "Signature" }, { name: "Tiramisu", description: "Classic Italian dessert", price: "120,000₫", badge: "Must Try" }] } },
      { id: genId(), type: "about", visible: true, order: 2, props: { heading: "La Nostra Storia", story: "From the rolling hills of Tuscany to the vibrant streets of Saigon, La Maison brings you an authentic Italian dining experience.", image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80", values: [{ icon: "Wine", title: "Wine Collection", description: "200+ labels from Italy's finest regions" }, { icon: "Soup", title: "Handmade Pasta", description: "Fresh pasta made daily" }] } },
      { id: genId(), type: "gallery", visible: true, order: 3, props: { ...getDefaultProps("gallery"), title: "Galleria" } },
      { id: genId(), type: "testimonials", visible: true, order: 4, props: { ...getDefaultProps("testimonials"), title: "Guest Reviews" } },
      { id: genId(), type: "opening-hours", visible: true, order: 5, props: getDefaultProps("opening-hours") },
      { id: genId(), type: "contact", visible: true, order: 6, props: getDefaultProps("contact") },
      { id: genId(), type: "footer", visible: true, order: 7, props: { ...getDefaultProps("footer"), businessName: "La Maison", description: "Ristorante Italiano Est. 2018" } },
    ],
  },
  {
    id: "korean-bbq",
    name: "Korean BBQ",
    description: "Nhà hàng nướng Hàn Quốc năng động, tông đỏ lửa",
    category: "Korean",
    preview: "Flame",
    theme: { primaryColor: "#FF380B", fontFamily: "Inter, sans-serif", mode: "dark", borderRadius: "rounded" },
    seo: { title: "Gogi House — Korean BBQ & Grill", description: "Authentic Korean BBQ experience" },
    sections: [
      { id: genId(), type: "hero", visible: true, order: 0, props: { title: "Gogi House", subtitle: "Korean BBQ & Grill — Nướng Tại Bàn", backgroundImage: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=1920&q=80", ctaText: "Đặt Bàn Nướng", ctaLink: "#reservation", overlayOpacity: 0.5 } },
      { id: genId(), type: "menu-grid", visible: true, order: 1, props: { ...getDefaultProps("menu-grid"), title: "Menu BBQ", categories: [{ name: "Thịt Nướng", items: [{ name: "Chadolbaegi", description: "Bò mỡ Mỹ thái mỏng", price: "189,000₫", badge: "Hot" }, { name: "Samgyeopsal", description: "Ba chỉ heo nướng", price: "159,000₫" }] }, { name: "Set Combo", items: [{ name: "Set 2 Người", description: "4 loại thịt + banchan", price: "399,000₫", badge: "Best Value" }, { name: "Set Gia Đình", description: "6 loại thịt + lẩu + banchan", price: "899,000₫" }] }], showPrices: true } },
      { id: genId(), type: "about", visible: true, order: 2, props: { heading: "Gogi House", story: "Trải nghiệm nướng BBQ Hàn Quốc chính hiệu với thịt nhập khẩu và hơn 30 loại banchan đi kèm.", image: "https://images.unsplash.com/photo-1583032015879-e5022cb87c3b?w=800&q=80", values: [{ icon: "Utensils", title: "Thịt Nhập Khẩu", description: "USDA Prime & Wagyu" }, { icon: "Soup", title: "30+ Banchan", description: "Refill không giới hạn" }] } },
      { id: genId(), type: "reservation-cta", visible: true, order: 3, props: { title: "Đặt Bàn Nướng Ngay", description: "Ưu đãi 15% cho đặt bàn online trước 17h", buttonText: "Đặt Bàn", buttonLink: "#" } },
      { id: genId(), type: "opening-hours", visible: true, order: 4, props: getDefaultProps("opening-hours") },
      { id: genId(), type: "footer", visible: true, order: 5, props: { ...getDefaultProps("footer"), businessName: "Gogi House" } },
    ],
  },
  {
    id: "coffee-brunch",
    name: "Café & Brunch",
    description: "Quán café phong cách Instagram, tông pastel nhẹ nhàng",
    category: "Café",
    preview: "Coffee",
    theme: { primaryColor: "#D4A76A", fontFamily: "Inter, sans-serif", mode: "light", borderRadius: "pill" },
    seo: { title: "The Morning — Café & Brunch", description: "Specialty coffee and all-day brunch" },
    sections: [
      { id: genId(), type: "hero", visible: true, order: 0, props: { title: "The Morning", subtitle: "Specialty Coffee & All-Day Brunch", backgroundImage: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1920&q=80", ctaText: "Xem Menu", ctaLink: "#menu", overlayOpacity: 0.4 } },
      { id: genId(), type: "menu-featured", visible: true, order: 1, props: { title: "Brunch Favorites", items: [{ name: "Eggs Benedict", description: "Poached eggs, hollandaise, sourdough", price: "145,000₫", badge: "Popular" }, { name: "Matcha Latte", description: "Ceremonial grade matcha, oat milk", price: "75,000₫" }, { name: "Açaí Bowl", description: "Açaí, granola, seasonal fruits", price: "125,000₫", badge: "Healthy" }] } },
      { id: genId(), type: "gallery", visible: true, order: 2, props: { ...getDefaultProps("gallery"), title: "Không Gian" } },
      { id: genId(), type: "about", visible: true, order: 3, props: { heading: "Câu Chuyện The Morning", story: "Một góc nhỏ yên bình giữa lòng thành phố. The Morning là nơi bạn bắt đầu ngày mới với ly cà phê specialty và bữa brunch đầy năng lượng.", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80", values: [] } },
      { id: genId(), type: "opening-hours", visible: true, order: 4, props: { ...getDefaultProps("opening-hours"), title: "Giờ Phục Vụ", hours: [{ day: "Monday", open: "07:00", close: "20:00", closed: false }, { day: "Tuesday", open: "07:00", close: "20:00", closed: false }, { day: "Wednesday", open: "07:00", close: "20:00", closed: false }, { day: "Thursday", open: "07:00", close: "20:00", closed: false }, { day: "Friday", open: "07:00", close: "21:00", closed: false }, { day: "Saturday", open: "08:00", close: "21:00", closed: false }, { day: "Sunday", open: "08:00", close: "18:00", closed: false }] } },
      { id: genId(), type: "contact", visible: true, order: 5, props: getDefaultProps("contact") },
      { id: genId(), type: "footer", visible: true, order: 6, props: { ...getDefaultProps("footer"), businessName: "The Morning", description: "Specialty Coffee & All-Day Brunch" } },
    ],
  },
  {
    id: "seafood-luxury",
    name: "Hải Sản Cao Cấp",
    description: "Nhà hàng hải sản fine dining, tông xanh biển và vàng",
    category: "Seafood",
    preview: "Fish",
    theme: { primaryColor: "#1E3A5F", fontFamily: "'Playfair Display', serif", mode: "dark", borderRadius: "rounded" },
    seo: { title: "Ocean Bay — Fine Dining Seafood", description: "Premium seafood dining experience" },
    sections: [
      { id: genId(), type: "hero", visible: true, order: 0, props: { title: "Ocean Bay", subtitle: "Fine Dining Seafood — Hải Sản Tươi Sống Hàng Ngày", backgroundImage: "https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=1920&q=80", ctaText: "Đặt Bàn VIP", ctaLink: "#reservation", overlayOpacity: 0.55 } },
      { id: genId(), type: "menu-featured", visible: true, order: 1, props: { title: "Catch of the Day", items: [{ name: "Tôm Hùm Alaska", description: "Nướng bơ tỏi, sốt chanh dây", price: "1,200,000₫", badge: "Premium" }, { name: "Bào Ngư Úc", description: "Hấp xì dầu, gừng tươi", price: "850,000₫", badge: "Chef Special" }, { name: "Set Hải Sản Hoàng Gia", description: "Tôm hùm, cua, sò điệp, hàu cho 2 người", price: "2,500,000₫", badge: "Signature" }] } },
      { id: genId(), type: "about", visible: true, order: 2, props: { heading: "Từ Biển Đến Bàn", story: "Ocean Bay cam kết mang đến hải sản tươi sống nhất. Mỗi ngày, chúng tôi nhận hải sản trực tiếp từ các cảng cá lớn nhất Việt Nam và nhập khẩu từ Australia, Alaska.", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", values: [{ icon: "Waves", title: "Tươi Sống 100%", description: "Nhập hàng mỗi sáng" }, { icon: "Trophy", title: "Đầu Bếp 5 Sao", description: "Hơn 20 năm kinh nghiệm" }] } },
      { id: genId(), type: "gallery", visible: true, order: 3, props: { ...getDefaultProps("gallery"), title: "Khám Phá Ocean Bay" } },
      { id: genId(), type: "testimonials", visible: true, order: 4, props: { ...getDefaultProps("testimonials"), title: "Đánh Giá Từ Thực Khách" } },
      { id: genId(), type: "reservation-cta", visible: true, order: 5, props: { title: "Đặt Bàn VIP", description: "Trải nghiệm ẩm thực hải sản sang trọng — Phòng riêng cho tiệc quan trọng", buttonText: "Đặt Bàn Ngay", buttonLink: "#", backgroundImage: "https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=1920&q=80" } },
      { id: genId(), type: "opening-hours", visible: true, order: 6, props: getDefaultProps("opening-hours") },
      { id: genId(), type: "footer", visible: true, order: 7, props: { ...getDefaultProps("footer"), businessName: "Ocean Bay", description: "Fine Dining Seafood Since 2015" } },
    ],
  },
];

export default function TemplatePicker({ onBack, onSelect }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const previewTemplate = TEMPLATES.find((t) => t.id === previewId);

  const handleUse = (template: Template) => {
    // Deep clone sections with fresh IDs
    const freshSections = template.sections.map((s, i) => ({
      ...s,
      id: `sec_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}_${i}`,
      props: { ...s.props },
    }));
    onSelect(freshSections, { ...template.theme }, { ...template.seo }, template.name);
  };

  // Preview Modal
  if (previewTemplate) {
    return (
      <div className="template-preview-page">
        <div className="template-preview-header">
          <button className="btn-secondary" onClick={() => setPreviewId(null)}>
            <ArrowLeft size={16} /> Quay lại
          </button>
          <div className="flex-1 text-center">
            <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
              {previewTemplate.name}
            </h2>
          </div>
          <button className="btn-primary" onClick={() => handleUse(previewTemplate)}>
            <Check size={16} /> Sử Dụng Template
          </button>
        </div>
        <div className="template-preview-canvas">
          <div className="template-preview-frame">
            {previewTemplate.sections.map((section) => (
              <SectionRenderer key={section.id} section={section} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="template-page">
      <div className="survey-bg-orb survey-bg-orb-1" />
      <div className="survey-bg-orb survey-bg-orb-2" />

      {/* Header */}
      <div className="template-header">
        <button className="survey-back" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <div className="template-header-content">
          <h1 className="template-title">Chọn Template</h1>
          <p className="template-subtitle">
            Bộ sưu tập template nhà hàng chuyên nghiệp — chọn và tùy chỉnh theo ý bạn
          </p>
        </div>
      </div>

      {/* Template Grid */}
      <div className="template-grid">
        {TEMPLATES.map((template) => (
          <div
            key={template.id}
            className={`template-card ${selectedId === template.id ? "selected" : ""}`}
            onClick={() => setSelectedId(template.id)}
          >
            {/* Preview thumbnail */}
            <div className="template-card-preview" style={{ background: `linear-gradient(135deg, ${template.theme.primaryColor}22, ${template.theme.primaryColor}44)` }}>
              <IconRenderer name={template.preview} size={48} className="template-card-emoji transition-transform duration-300" style={{ color: template.theme.primaryColor }} />
              <div className="template-card-overlay">
                <button className="btn-secondary" onClick={(e) => { e.stopPropagation(); setPreviewId(template.id); }}>
                  <Eye size={14} /> Xem Preview
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="template-card-body">
              <div className="template-card-badge" style={{ background: `${template.theme.primaryColor}22`, color: template.theme.primaryColor }}>
                {template.category}
              </div>
              <h3 className="template-card-name">{template.name}</h3>
              <p className="template-card-desc">{template.description}</p>
              <div className="template-card-meta">
                <span>{template.sections.length} sections</span>
                <span className="template-card-swatch" style={{ background: template.theme.primaryColor }} />
              </div>
              <button
                className="btn-primary w-full justify-center mt-3"
                onClick={(e) => { e.stopPropagation(); handleUse(template); }}
              >
                <Check size={16} /> Sử Dụng
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
