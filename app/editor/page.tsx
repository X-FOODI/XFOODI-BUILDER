"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEditorStore } from "@/lib/store/editor-store";
import EditorToolbar from "@/components/editor/EditorToolbar";
import SectionPicker from "@/components/editor/SectionPicker";
import EditorCanvas from "@/components/editor/EditorCanvas";
import PropertyPanel from "@/components/editor/PropertyPanel";
import AIPromptPanel from "@/components/editor/AIPromptPanel";
import TemplatesPanel from "@/components/editor/TemplatesPanel";
import HistoryPanel from "@/components/editor/HistoryPanel";
import { Sparkles, Layers, Palette, Loader2, LayoutTemplate, History } from "lucide-react";
import type { SectionConfig, RestaurantLayout } from "@/lib/types/layout";

type SidebarTab = "sections" | "ai" | "templates" | "history";

interface CoreCategory {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

interface CoreDish {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: string | number;
  imageUrl?: string | null;
  isBestSeller: boolean;
  isActive: boolean;
}

function EditorContent() {
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("ai");
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenantId") || "demo";
  
  const { loadLayout, selectedSectionId, setTenantInfo, previewOnly } = useEditorStore();

  useEffect(() => {
    let active = true;

    async function loadTenantOrLayout() {
      try {
        setLoading(true);

        // 1. Fetch layouts for this tenant from builder API (fail-safe fallback)
        let layouts: RestaurantLayout[] = [];
        try {
          const layoutRes = await fetch(`/api/layouts?tenantId=${tenantId}`, { cache: "no-store" });
          if (layoutRes.ok) {
            layouts = await layoutRes.json();
          } else {
            console.warn("Layout API returned non-ok status:", layoutRes.status);
          }
        } catch (dbErr) {
          console.error("Failed to fetch layouts from MongoDB (SSL/network issue), falling back to template generation:", dbErr);
        }

        if (active) {
          if (layouts && layouts.length > 0) {
            // Layout exists, load it
            loadLayout(layouts[0]);
          } else {
            // No layout exists, load tenant details and generate default storefront components
            const coreApiUrl = process.env.NEXT_PUBLIC_XFOODI_API_URL || "http://localhost:5000/api";
            
            // Fetch Tenant metadata
            let tenantData = null;
            try {
              const tenantRes = await fetch(`${coreApiUrl}/tenants/${tenantId}`);
              if (tenantRes.ok) {
                tenantData = await tenantRes.json();
              }
            } catch (err) {
              console.error("Failed to fetch tenant metadata, falling back to demo:", err);
            }

            if (!tenantData || tenantData.id === "demo") {
              // Fallback to demo defaults
              setTenantInfo("demo", "demo.xfoodi.website");
              setLoading(false);
              return;
            }

            // Fetch Categories & Dishes in parallel
            let categoriesData = null;
            let dishesData = null;
            try {
              const [catRes, dishRes] = await Promise.all([
                fetch(`${coreApiUrl}/categories?restaurantId=${tenantData.id}&limit=100`),
                fetch(`${coreApiUrl}/dishes?restaurantId=${tenantData.id}&limit=100`)
              ]);
              if (catRes.ok) categoriesData = await catRes.json();
              if (dishRes.ok) dishesData = await dishRes.json();
            } catch (err) {
              console.error("Failed to fetch menu category/dish data:", err);
            }

            // Dynamically build categories list
            let resolvedCategories: {
              name: string;
              items: {
                name: string;
                description: string;
                price: string;
                image?: string;
                badge?: string;
              }[];
            }[] = [];
            if (categoriesData && categoriesData.success && categoriesData.data) {
              const cats = (categoriesData.data as CoreCategory[]).filter((c) => c.isActive);
              const dishes = dishesData && dishesData.success && dishesData.data ? (dishesData.data as CoreDish[]).filter((d) => d.isActive) : [];
              resolvedCategories = cats.map((cat) => {
                const catDishes = dishes.filter((d) => d.categoryId === cat.id);
                return {
                  name: cat.name,
                  items: catDishes.map((d) => ({
                    name: d.name,
                    description: d.description || "",
                    price: Number(d.price).toLocaleString("vi-VN") + "₫",
                    image: d.imageUrl || undefined,
                    badge: d.isBestSeller ? "Bán Chạy" : undefined
                  }))
                };
              }).filter((c) => c.items.length > 0);
            }

            if (resolvedCategories.length === 0) {
              resolvedCategories = [
                {
                  name: "Khai Vị",
                  items: [
                    { name: "Chả Giò Tôm Thịt", description: "Giòn rụm với tôm tươi và thịt băm", price: "85.000₫" },
                    { name: "Súp Hải Sản", description: "Nước dùng ngọt thanh với hải sản tươi", price: "95.000₫" },
                  ]
                },
                {
                  name: "Món Chính",
                  items: [
                    { name: "Cơm Chiên Hải Sản", description: "Cơm chiên hạt dẻo thơm cùng tôm mực", price: "125.000₫" },
                    { name: "Bò Lúc Lắc", description: "Bò mềm xào cùng hành tây ớt chuông", price: "185.000₫" },
                  ]
                }
              ];
            }

            const generatedSections: SectionConfig[] = [
              {
                id: `sec_header_${Date.now()}`,
                type: "header",
                visible: true,
                order: 0,
                props: {
                  businessName: tenantData.name,
                  logoUrl: tenantData.logoUrl || "",
                  links: [
                    { label: "Trang Chủ", href: "#" },
                    { label: "Thực Đơn", href: "#menu" },
                    { label: "Giới Thiệu", href: "#about" },
                    { label: "Liên Hệ", href: "#contact" }
                  ],
                  ctaText: "Đặt Bàn Ngay",
                  ctaLink: "#reservation"
                }
              },
              {
                id: `sec_hero_${Date.now()}`,
                type: "hero",
                visible: true,
                order: 1,
                props: {
                  title: tenantData.name,
                  subtitle: tenantData.description || "Trải nghiệm ẩm thực tuyệt vời tại không gian sang trọng.",
                  backgroundImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80",
                  ctaText: "Đặt Bàn Ngay",
                  ctaLink: "#reservation",
                  overlayOpacity: 0.5,
                  logoUrl: tenantData.logoUrl || "",
                }
              },
              {
                id: `sec_stats_${Date.now()}`,
                type: "stats",
                visible: true,
                order: 2,
                props: {
                  stats: [
                    { value: "500+", label: "Khách Hàng Mỗi Ngày" },
                    { value: "50+", label: "Món Ăn Đặc Sắc" },
                    { value: "10+", label: "Năm Kinh Nghiệm" },
                    { value: "4.9★", label: "Đánh Giá Trung Bình" },
                  ],
                  backgroundColor: tenantData.primaryColor || "#FF380B",
                }
              },
              {
                id: `sec_infocards_${Date.now()}`,
                type: "info-cards",
                visible: true,
                order: 3,
                props: {
                  cards: [
                    { icon: "MapPin", title: "Địa Chỉ", content: tenantData.address || "123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh" },
                    { icon: "Clock", title: "Giờ Hoạt Động", content: "Hôm nay: 09:00 - 22:00" },
                    { icon: "Phone", title: "Liên Hệ", content: tenantData.phone || "0123 456 789", sub: tenantData.email || "contact@xfoodi.com" },
                  ],
                }
              },
              {
                id: `sec_about_${Date.now()}`,
                type: "about",
                visible: true,
                order: 4,
                props: {
                  heading: "Về Chúng Tôi",
                  story: tenantData.description || "Chúng tôi tự hào mang đến cho quý khách những món ăn đậm đà hương vị truyền thống kết hợp tinh tế cùng phong cách ẩm thực hiện đại. Mỗi nguyên liệu đều được lựa chọn kỹ càng bởi các đầu bếp hàng đầu.",
                  image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
                  values: [
                    { icon: "🍽️", title: "Nguyên Liệu Tươi Sạch", description: "Lựa chọn từ các nhà cung cấp uy tín hàng ngày" },
                    { icon: "👨‍🍳", title: "Đầu Bếp Chuyên Nghiệp", description: "Được đào tạo bài bản với nhiều năm kinh nghiệm" },
                    { icon: "❤️", title: "Trực Tiếp Từ Trái Tim", description: "Mỗi món ăn đều được chuẩn bị với trọn vẹn tình yêu" },
                  ],
                }
              },
              {
                id: `sec_gallery_${Date.now()}`,
                type: "gallery",
                visible: true,
                order: 5,
                props: {
                  title: "Thư Viện Ảnh",
                  images: [
                    { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80", alt: "Không gian nhà hàng" },
                    { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", alt: "Bếp và đầu bếp" },
                    { src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80", alt: "Khu vực ăn uống" },
                    { src: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=600&q=80", alt: "Bàn tiệc" },
                    { src: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&q=80", alt: "Quầy bar" },
                    { src: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=600&q=80", alt: "Góc thư giãn" },
                  ],
                  layout: "grid",
                  columns: 3,
                }
              },
              {
                id: `sec_menu_featured_${Date.now()}`,
                type: "menu-featured",
                visible: true,
                order: 6,
                props: {
                  title: "Món Ăn Được Yêu Thích",
                  items: [] // Will fallback to Vietnamese mock dishes inside component
                }
              },
              {
                id: `sec_menu_${Date.now()}`,
                type: "menu-grid",
                visible: true,
                order: 7,
                props: {
                  title: "Thực Đơn Của Chúng Tôi",
                  subtitle: "Khám phá các món ăn đặc sắc được chuẩn bị bởi đầu bếp",
                  categories: resolvedCategories,
                  layout: "grid",
                  showPrices: true,
                }
              },
              {
                id: `sec_hours_${Date.now()}`,
                type: "opening-hours",
                visible: true,
                order: 8,
                props: {
                  title: "Giờ Mở Cửa",
                  hours: [
                    { day: "Thứ Hai", open: "09:00", close: "22:00", closed: false },
                    { day: "Thứ Ba", open: "09:00", close: "22:00", closed: false },
                    { day: "Thứ Tư", open: "09:00", close: "22:00", closed: false },
                    { day: "Thứ Năm", open: "09:00", close: "22:00", closed: false },
                    { day: "Thứ Sáu", open: "09:00", close: "23:00", closed: false },
                    { day: "Thứ Bảy", open: "10:00", close: "23:00", closed: false },
                    { day: "Chủ Nhật", open: "10:00", close: "21:00", closed: false },
                  ],
                  note: "Nhà bếp sẽ đóng cửa trước giờ đóng cửa 30 phút",
                }
              },
              {
                id: `sec_location_${Date.now()}`,
                type: "location-map",
                visible: true,
                order: 9,
                props: {
                  title: "Địa Chỉ & Liên Hệ",
                  address: tenantData.address || "123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
                  phone: tenantData.phone || "0123 456 789",
                  email: tenantData.email || "contact@xfoodi.com",
                  mapEmbedUrl: "",
                }
              },
              {
                id: `sec_footer_${Date.now()}`,
                type: "footer",
                visible: true,
                order: 10,
                props: {
                  businessName: tenantData.name,
                  description: tenantData.description || "Trải nghiệm ẩm thực tuyệt vời cùng XFoodi.",
                  links: [
                    { label: "Trang Chủ", href: "#" },
                    { label: "Thực Đơn", href: "#menu" },
                    { label: "Đặt Bàn", href: "#reservation" },
                  ],
                  socialMedia: [
                    { platform: "facebook", url: "#" },
                    { platform: "instagram", url: "#" },
                  ],
                  copyright: `© ${new Date().getFullYear()} ${tenantData.name}. Tất cả các quyền được bảo lưu.`,
                }
              }
            ];

            const initialLayout: RestaurantLayout = {
              tenantId: tenantData.id,
              tenantHostname: `${tenantData.slug}.xfoodi.website`,
              name: `Trang chủ ${tenantData.name}`,
              status: "draft",
              version: 1,
              theme: {
                primaryColor: tenantData.primaryColor || "#FF380B",
                fontFamily: "Inter, sans-serif",
                mode: "dark",
                borderRadius: "rounded",
              },
              seo: {
                title: tenantData.name,
                description: tenantData.description || `Chào mừng bạn đến với nhà hàng ${tenantData.name}`,
              },
              sections: generatedSections,
              publishedAt: null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };

            loadLayout(initialLayout);
            useEditorStore.setState({ isDirty: true });
          }
        }
      } catch (err) {
        console.error("Failed to fetch and convert tenant details:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadTenantOrLayout();

    return () => {
      active = false;
    };
  }, [tenantId, loadLayout, setTenantInfo]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen" style={{ background: "var(--bg-base)", gap: 16 }}>
        <Loader2 className="animate-spin" size={40} style={{ color: "var(--primary)" }} />
        <p className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
          Đang tải dữ liệu nhà hàng...
        </p>
      </div>
    );
  }

  return (
    <div className={`editor-layout ${previewOnly ? "preview-active" : ""}`}>
      <EditorToolbar />

      {/* Sidebar */}
      {!previewOnly && (
        <div className="editor-sidebar flex flex-col h-full">
          {/* Tab Switcher */}
          <div className="flex border-b" style={{ borderColor: "var(--border)", flexShrink: 0 }}>
            <button
              onClick={() => setSidebarTab("ai")}
              className="flex-1 py-3 px-1 text-[11px] font-semibold transition-colors flex flex-col items-center justify-center gap-1"
              style={{
                color: sidebarTab === "ai" ? "var(--primary)" : "var(--text-secondary)",
                borderBottom: sidebarTab === "ai" ? "2px solid var(--primary)" : "2px solid transparent",
                background: "transparent",
                cursor: "pointer",
              }}
              title="AI Generate"
            >
              <Sparkles size={14} /> AI
            </button>
            <button
              onClick={() => setSidebarTab("sections")}
              className="flex-1 py-3 px-1 text-[11px] font-semibold transition-colors flex flex-col items-center justify-center gap-1"
              style={{
                color: sidebarTab === "sections" ? "var(--primary)" : "var(--text-secondary)",
                borderBottom: sidebarTab === "sections" ? "2px solid var(--primary)" : "2px solid transparent",
                background: "transparent",
                cursor: "pointer",
              }}
              title="Sections"
            >
              <Layers size={14} /> Sections
            </button>
            <button
              onClick={() => setSidebarTab("templates")}
              className="flex-1 py-3 px-1 text-[11px] font-semibold transition-colors flex flex-col items-center justify-center gap-1"
              style={{
                color: sidebarTab === "templates" ? "var(--primary)" : "var(--text-secondary)",
                borderBottom: sidebarTab === "templates" ? "2px solid var(--primary)" : "2px solid transparent",
                background: "transparent",
                cursor: "pointer",
              }}
              title="Templates"
            >
              <LayoutTemplate size={14} /> Templates
            </button>
            <button
              onClick={() => setSidebarTab("history")}
              className="flex-1 py-3 px-1 text-[11px] font-semibold transition-colors flex flex-col items-center justify-center gap-1"
              style={{
                color: sidebarTab === "history" ? "var(--primary)" : "var(--text-secondary)",
                borderBottom: sidebarTab === "history" ? "2px solid var(--primary)" : "2px solid transparent",
                background: "transparent",
                cursor: "pointer",
              }}
              title="Lịch sử"
            >
              <History size={14} /> Lịch sử
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {sidebarTab === "ai" && <AIPromptPanel />}
            {sidebarTab === "sections" && <SectionPicker />}
            {sidebarTab === "templates" && <TemplatesPanel />}
            {sidebarTab === "history" && <HistoryPanel />}
          </div>
        </div>
      )}

      {/* Canvas */}
      <EditorCanvas />

      {/* Properties Panel */}
      {!previewOnly && (
        <div className="editor-panel">
          {selectedSectionId ? (
            <PropertyPanel />
          ) : (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <Palette size={40} className="mb-3 opacity-50" style={{ color: "var(--primary)" }} />
              <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                Select a section to edit its properties
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Click any section on the canvas or use AI to generate a layout
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen" style={{ background: "var(--bg-base)" }}>
        <Loader2 className="animate-spin" size={40} style={{ color: "var(--primary)" }} />
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}
