"use client";

import type { MenuFeaturedProps, MenuItem } from "@/lib/types/layout";
import { Star } from "lucide-react";

const DEFAULT_ITEMS: MenuItem[] = [
  {
    name: "Phở Bò Tái Lăn",
    description: "Bò tơ thái mỏng xào nhanh với tỏi và gừng, nước dùng thơm ngậy đặc biệt",
    price: "75.000₫",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&q=80",
    badge: "Bán Chạy"
  },
  {
    name: "Bún Chả Hà Nội",
    description: "Thịt nướng than hoa thơm nức, ăn kèm nước mắm đu đủ chua ngọt và rau sống",
    price: "65.000₫",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    badge: "Đặc Sản"
  },
  {
    name: "Nem Rán Hải Sản",
    description: "Nem nhân tôm cua giòn rụm kết hợp với sốt mayonnaise béo thơm",
    price: "90.000₫",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
    badge: "Mới"
  }
];

export default function MenuFeaturedSection({ props }: { props: Record<string, unknown> }) {
  const p = props as unknown as MenuFeaturedProps;
  const rawItems = Array.isArray(p.items) ? p.items : [];
  const items = rawItems.length > 0 ? rawItems : DEFAULT_ITEMS;

  return (
    <div className="py-16 px-6 md:px-12 transition-colors duration-300 w-full" style={{ background: "var(--bg-base, #F8FAFC)" }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-2" style={{ color: "var(--text-primary, #0F172A)" }}>
          {p.title || "Món Ăn Được Yêu Thích"}
        </h2>
        <p className="text-center text-sm mb-12 max-w-lg mx-auto" style={{ color: "var(--text-secondary, #64748B)" }}>
          Khám phá những món ăn đặc sắc được thực khách yêu thích và bình chọn nhiều nhất tại nhà hàng
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {items.map((item: MenuItem, i: number) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border"
              style={{
                background: "var(--bg-card, #FFFFFF)",
                borderColor: "var(--border, #E2E8F0)",
              }}
            >
              {/* Image & Badge Container */}
              <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                {item.badge && (
                  <span
                    className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-md z-10 text-white shadow-sm"
                    style={{ background: "var(--primary, #FF380B)" }}
                  >
                    {item.badge}
                  </span>
                )}
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: "var(--text-muted)" }}>
                    Không có hình ảnh
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-2 line-clamp-1" style={{ color: "var(--text-primary, #0F172A)" }}>
                  {item.name}
                </h3>
                <p className="text-sm mb-4 line-clamp-2 flex-1" style={{ color: "var(--text-secondary, #64748B)" }}>
                  {item.description}
                </p>

                {/* Divider */}
                <div className="mb-4 border-t" style={{ borderColor: "var(--border, #E2E8F0)" }} />

                {/* Footer of Card */}
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xl font-black" style={{ color: "var(--primary, #FF380B)" }}>
                    {item.price}
                  </span>
                  
                  {/* 5 Rating Stars */}
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} size={14} fill="#FBBF24" color="#FBBF24" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View Full Menu CTA */}
        <div className="text-center">
          <a
            href="#menu"
            className="transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
            style={{
              borderColor: "var(--primary, #FF380B)",
              color: "var(--primary, #FF380B)",
              textDecoration: "none",
              border: "1px solid var(--primary, #FF380B)",
              padding: "14px 32px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            Xem toàn bộ thực đơn
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
