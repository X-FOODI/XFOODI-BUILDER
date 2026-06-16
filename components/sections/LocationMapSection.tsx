"use client";

import type { LocationMapProps } from "@/lib/types/layout";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function LocationMapSection({ props }: { props: Record<string, unknown> }) {
  const p = props as unknown as LocationMapProps & { openingHours?: string };
  return (
    <div className="py-16 px-6 md:px-12" style={{ background: "var(--bg-base, #F8FAFC)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span
            className="text-xs font-extrabold uppercase tracking-widest block mb-2"
            style={{ color: "var(--primary, #FF380B)" }}
          >
            Tìm Chúng Tôi
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold m-0" style={{ color: "var(--text-primary, #0F172A)" }}>
            Vị Trí Nhà Hàng
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Contact Details (2/5 columns) */}
          <div className="lg:col-span-2 space-y-6">
            {[
              { icon: MapPin, label: "Địa chỉ", value: p.address },
              { icon: Phone, label: "Điện thoại", value: p.phone },
              { icon: Mail, label: "Email", value: p.email },
              { icon: Clock, label: "Giờ mở cửa", value: p.openingHours || "09:00 - 22:00" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "var(--primary-light, rgba(255, 56, 11, 0.15))",
                    color: "var(--primary, #FF380B)",
                  }}
                >
                  <item.icon size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider m-0 mb-1" style={{ color: "var(--text-muted, #94A3B8)" }}>
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold m-0 leading-normal" style={{ color: "var(--text-primary, #0F172A)" }}>
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Map Embed (3/5 columns) */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden shadow-lg border" style={{ minHeight: 320, borderColor: "var(--border, #E2E8F0)" }}>
            {p.mapEmbedUrl ? (
              <iframe
                src={p.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 320 }}
                loading="lazy"
                title="Google Maps Location"
              />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[320px] p-6 text-center" style={{ background: "var(--bg-surface, #ffffff)" }}>
                <MapPin size={40} className="mb-2" style={{ color: "var(--text-muted, #94A3B8)" }} />
                <p className="text-sm font-medium m-0" style={{ color: "var(--text-secondary, #64748B)" }}>
                  Bản đồ Google Maps
                </p>
                <p className="text-xs mt-1 m-0" style={{ color: "var(--text-muted, #94A3B8)", maxWidth: 220 }}>
                  Thêm địa chỉ url nhúng bản đồ trong bảng thuộc tính để hiển thị
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
