"use client";

import { useState } from "react";
import type { SectionConfig } from "@/lib/types/layout";
import {
  ArrowLeft, ArrowRight, Sparkles, MapPin,
  Clock, Palette, ChefHat, Store, Phone, Mail,
} from "lucide-react";

interface Props {
  onBack: () => void;
  onGenerated: (sections: SectionConfig[], theme: Record<string, unknown>, seo: Record<string, unknown>, name: string) => void;
  setGenerating: (v: boolean) => void;
}

interface SurveyData {
  restaurantName: string;
  cuisine: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  priceRange: string;
  atmosphere: string;
  specialFeatures: string[];
  colorPreference: string;
  stylePreference: string;
}

import { IconRenderer } from "@/lib/icons";

const CUISINE_OPTIONS = [
  { value: "vietnamese", label: "Việt Nam", icon: "Soup" },
  { value: "japanese", label: "Nhật Bản", icon: "Fish" },
  { value: "korean", label: "Hàn Quốc", icon: "Flame" },
  { value: "italian", label: "Ý", icon: "Pizza" },
  { value: "chinese", label: "Trung Hoa", icon: "Soup" },
  { value: "thai", label: "Thái Lan", icon: "Flame" },
  { value: "french", label: "Pháp", icon: "Wine" },
  { value: "american", label: "Mỹ", icon: "Utensils" },
  { value: "fusion", label: "Fusion", icon: "Globe" },
  { value: "seafood", label: "Hải Sản", icon: "Fish" },
  { value: "bbq", label: "BBQ / Nướng", icon: "Flame" },
  { value: "vegetarian", label: "Chay", icon: "Leaf" },
];

const PRICE_RANGES = [
  { value: "budget", label: "Bình dân", desc: "50K - 150K / người", icon: "Coins" },
  { value: "mid", label: "Trung bình", desc: "150K - 400K / người", icon: "Coins" },
  { value: "premium", label: "Cao cấp", desc: "400K - 1M / người", icon: "Coins" },
  { value: "luxury", label: "Sang trọng", desc: "Trên 1M / người", icon: "Gem" },
];

const ATMOSPHERE_OPTIONS = [
  { value: "modern", label: "Hiện đại & Tối giản", icon: "Sparkles" },
  { value: "classic", label: "Cổ điển & Sang trọng", icon: "Landmark" },
  { value: "cozy", label: "Ấm cúng & Thân mật", icon: "Flame" },
  { value: "luxury", label: "Fine Dining", icon: "Gem" },
  { value: "casual", label: "Phóng khoáng & Vui vẻ", icon: "PartyPopper" },
  { value: "streetfood", label: "Street Food / Quán nhậu", icon: "Flame" },
];

const FEATURE_OPTIONS = [
  { value: "reservation", label: "Đặt bàn online" },
  { value: "delivery", label: "Giao hàng tận nơi" },
  { value: "takeaway", label: "Mang đi" },
  { value: "private-room", label: "Phòng riêng" },
  { value: "wifi", label: "Free WiFi" },
  { value: "parking", label: "Bãi đậu xe" },
  { value: "live-music", label: "Nhạc sống" },
  { value: "outdoor", label: "Khu vực ngoài trời" },
  { value: "kids-friendly", label: "Thân thiện trẻ em" },
  { value: "bar", label: "Quầy bar" },
];

const COLOR_OPTIONS = [
  { value: "#FF380B", label: "Đỏ cam (XFoodi)" },
  { value: "#D4A76A", label: "Vàng ấm" },
  { value: "#2D5016", label: "Xanh lá" },
  { value: "#1E3A5F", label: "Xanh dương đậm" },
  { value: "#8B1A1A", label: "Đỏ rượu" },
  { value: "#4A2C2A", label: "Nâu cà phê" },
  { value: "#1A1A2E", label: "Đen sang trọng" },
  { value: "#C084FC", label: "Tím lavender" },
];

const STEPS = [
  { title: "Thông tin cơ bản", icon: Store, desc: "Tên và loại hình nhà hàng" },
  { title: "Mô tả & Liên hệ", icon: Phone, desc: "Địa chỉ và thông tin liên lạc" },
  { title: "Phong cách", icon: Palette, desc: "Không gian và đối tượng khách" },
  { title: "Tính năng đặc biệt", icon: ChefHat, desc: "Các dịch vụ nổi bật" },
  { title: "Xác nhận & Tạo", icon: Sparkles, desc: "AI tạo website cho bạn" },
];

export default function OnboardingSurvey({ onBack, onGenerated, setGenerating }: Props) {
  const [step, setStep] = useState(0);
  const [generating, setGen] = useState(false);
  const [data, setData] = useState<SurveyData>({
    restaurantName: "",
    cuisine: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    openingHours: "09:00 - 22:00",
    priceRange: "mid",
    atmosphere: "modern",
    specialFeatures: [],
    colorPreference: "#FF380B",
    stylePreference: "",
  });

  const update = (partial: Partial<SurveyData>) => setData((prev) => ({ ...prev, ...partial }));

  const toggleFeature = (feat: string) => {
    setData((prev) => ({
      ...prev,
      specialFeatures: prev.specialFeatures.includes(feat)
        ? prev.specialFeatures.filter((f) => f !== feat)
        : [...prev.specialFeatures, feat],
    }));
  };

  const canProceed = () => {
    if (step === 0) return data.restaurantName.trim().length > 0 && data.cuisine;
    return true;
  };

  const handleGenerate = async () => {
    setGen(true);
    setGenerating(true);
    try {
      const prompt = `Tạo website cho nhà hàng "${data.restaurantName}" chuyên ẩm thực ${data.cuisine}.
Mô tả: ${data.description || "Chưa cung cấp"}
Phong cách: ${data.atmosphere}
Phân khúc giá: ${data.priceRange}
Tính năng: ${data.specialFeatures.join(", ") || "Cơ bản"}
Địa chỉ: ${data.address || "Chưa cung cấp"}
Giờ mở cửa: ${data.openingHours}
${data.stylePreference ? `Yêu cầu thêm: ${data.stylePreference}` : ""}`;

      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          tenantId: "demo",
          tenantHostname: "demo.xfoodi.website",
          tenantData: {
            businessName: data.restaurantName,
            aboutUs: data.description,
            address: data.address,
            phone: data.phone,
            email: data.email,
            primaryColor: data.colorPreference,
          },
          style: { mood: data.atmosphere, colorScheme: data.colorPreference },
        }),
      });

      const result = await res.json();
      if (result.success && result.layout) {
        onGenerated(result.layout.sections, result.layout.theme, result.layout.seo, result.layout.name);
      } else {
        alert("AI generation failed: " + (result.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Không thể kết nối AI. Kiểm tra Gemini API key.");
    } finally {
      setGen(false);
      setGenerating(false);
    }
  };

  return (
    <div className="survey-page">
      <div className="survey-bg-orb survey-bg-orb-1" />
      <div className="survey-bg-orb survey-bg-orb-2" />

      {/* Header */}
      <div className="survey-header">
        <button className="survey-back" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <div className="survey-logo">
          <Sparkles size={20} style={{ color: "var(--primary)" }} />
          <span>AI Builder</span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="survey-progress">
        {STEPS.map((s, i) => (
          <div
            key={i}
            className={`survey-step ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
            onClick={() => i < step && setStep(i)}
          >
            <div className="survey-step-dot">
              {i < step ? "✓" : i + 1}
            </div>
            <span className="survey-step-label">{s.title}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="survey-body">
        <div className="survey-card">
          <div className="survey-card-header">
            <h2>{STEPS[step].title}</h2>
            <p>{STEPS[step].desc}</p>
          </div>

          {/* Step 0: Basic Info */}
          {step === 0 && (
            <div className="survey-fields">
              <div className="survey-field">
                <label className="label">Tên nhà hàng *</label>
                <div className="survey-input-wrap">
                  <Store size={18} className="survey-input-icon" />
                  <input
                    className="input survey-input-with-icon"
                    placeholder="VD: Phở Hà Nội, Sushi Sakura, La Maison..."
                    value={data.restaurantName}
                    onChange={(e) => update({ restaurantName: e.target.value })}
                  />
                </div>
              </div>

              <div className="survey-field">
                <label className="label">Loại ẩm thực *</label>
                <div className="survey-grid survey-grid-3">
                  {CUISINE_OPTIONS.map((c) => (
                    <button
                      key={c.value}
                      className={`survey-chip ${data.cuisine === c.value ? "selected" : ""}`}
                      onClick={() => update({ cuisine: c.value })}
                    >
                      <IconRenderer name={c.icon} size={16} className="flex-shrink-0" />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Description & Contact */}
          {step === 1 && (
            <div className="survey-fields">
              <div className="survey-field">
                <label className="label">Mô tả nhà hàng</label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="Giới thiệu ngắn về nhà hàng, phong cách nấu ăn, câu chuyện thương hiệu..."
                  value={data.description}
                  onChange={(e) => update({ description: e.target.value })}
                />
              </div>
              <div className="survey-row">
                <div className="survey-field" style={{ flex: 1 }}>
                  <label className="label">Địa chỉ</label>
                  <div className="survey-input-wrap">
                    <MapPin size={18} className="survey-input-icon" />
                    <input className="input survey-input-with-icon" placeholder="123 Nguyễn Huệ, Q.1, TP.HCM" value={data.address} onChange={(e) => update({ address: e.target.value })} />
                  </div>
                </div>
                <div className="survey-field" style={{ flex: 1 }}>
                  <label className="label">Giờ mở cửa</label>
                  <div className="survey-input-wrap">
                    <Clock size={18} className="survey-input-icon" />
                    <input className="input survey-input-with-icon" placeholder="09:00 - 22:00" value={data.openingHours} onChange={(e) => update({ openingHours: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="survey-row">
                <div className="survey-field" style={{ flex: 1 }}>
                  <label className="label">Số điện thoại</label>
                  <div className="survey-input-wrap">
                    <Phone size={18} className="survey-input-icon" />
                    <input className="input survey-input-with-icon" placeholder="0123 456 789" value={data.phone} onChange={(e) => update({ phone: e.target.value })} />
                  </div>
                </div>
                <div className="survey-field" style={{ flex: 1 }}>
                  <label className="label">Email</label>
                  <div className="survey-input-wrap">
                    <Mail size={18} className="survey-input-icon" />
                    <input className="input survey-input-with-icon" type="email" placeholder="info@restaurant.com" value={data.email} onChange={(e) => update({ email: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Style & Atmosphere */}
          {step === 2 && (
            <div className="survey-fields">
              <div className="survey-field">
                <label className="label">Không gian & Phong cách</label>
                <div className="survey-grid survey-grid-2">
                  {ATMOSPHERE_OPTIONS.map((a) => (
                    <button
                      key={a.value}
                      className={`survey-chip survey-chip-lg ${data.atmosphere === a.value ? "selected" : ""}`}
                      onClick={() => update({ atmosphere: a.value })}
                    >
                      <IconRenderer name={a.icon} size={20} className="flex-shrink-0" style={{ color: data.atmosphere === a.value ? "var(--primary)" : "var(--text-secondary)" }} />
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="survey-field">
                <label className="label">Phân khúc giá</label>
                <div className="survey-grid survey-grid-2">
                  {PRICE_RANGES.map((pr) => (
                    <button
                      key={pr.value}
                      className={`survey-chip survey-chip-lg ${data.priceRange === pr.value ? "selected" : ""}`}
                      onClick={() => update({ priceRange: pr.value })}
                    >
                      <IconRenderer name={pr.icon} size={20} className="flex-shrink-0" style={{ color: data.priceRange === pr.value ? "var(--primary)" : "var(--text-secondary)" }} />
                      <div>
                        <div className="font-semibold">{pr.label}</div>
                        <div className="text-xs" style={{ color: "var(--text-muted)", marginTop: 2 }}>{pr.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="survey-field">
                <label className="label">Màu chủ đạo</label>
                <div className="survey-colors">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.value}
                      className={`survey-color ${data.colorPreference === c.value ? "selected" : ""}`}
                      onClick={() => update({ colorPreference: c.value })}
                      title={c.label}
                    >
                      <div className="survey-color-swatch" style={{ background: c.value }} />
                      <span className="survey-color-label">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Features */}
          {step === 3 && (
            <div className="survey-fields">
              <div className="survey-field">
                <label className="label">Tính năng & Dịch vụ đặc biệt</label>
                <div className="survey-grid survey-grid-2">
                  {FEATURE_OPTIONS.map((f) => (
                    <button
                      key={f.value}
                      className={`survey-chip ${data.specialFeatures.includes(f.value) ? "selected" : ""}`}
                      onClick={() => toggleFeature(f.value)}
                    >
                      {data.specialFeatures.includes(f.value) ? "✓" : "○"} {f.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="survey-field">
                <label className="label">Yêu cầu thêm cho AI (tùy chọn)</label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="VD: Tôi muốn website có phần menu nổi bật, ảnh đồ ăn lớn, section đặt bàn rõ ràng..."
                  value={data.stylePreference}
                  onChange={(e) => update({ stylePreference: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 4: Confirm & Generate */}
          {step === 4 && (
            <div className="survey-fields">
              <div className="survey-summary">
                <div className="survey-summary-row">
                  <span className="survey-summary-label">Tên nhà hàng</span>
                  <span className="survey-summary-value">{data.restaurantName}</span>
                </div>
                <div className="survey-summary-row">
                  <span className="survey-summary-label">Ẩm thực</span>
                  <span className="survey-summary-value flex items-center justify-end gap-1.5">
                    {CUISINE_OPTIONS.find((c) => c.value === data.cuisine)?.label}
                    {data.cuisine && (
                      <IconRenderer
                        name={CUISINE_OPTIONS.find((c) => c.value === data.cuisine)?.icon || "Soup"}
                        size={14}
                        style={{ color: "var(--primary)" }}
                      />
                    )}
                  </span>
                </div>
                <div className="survey-summary-row">
                  <span className="survey-summary-label">Phong cách</span>
                  <span className="survey-summary-value">{ATMOSPHERE_OPTIONS.find((a) => a.value === data.atmosphere)?.label}</span>
                </div>
                <div className="survey-summary-row">
                  <span className="survey-summary-label">Phân khúc</span>
                  <span className="survey-summary-value">{PRICE_RANGES.find((p) => p.value === data.priceRange)?.label}</span>
                </div>
                {data.address && (
                  <div className="survey-summary-row">
                    <span className="survey-summary-label">Địa chỉ</span>
                    <span className="survey-summary-value">{data.address}</span>
                  </div>
                )}
                {data.specialFeatures.length > 0 && (
                  <div className="survey-summary-row">
                    <span className="survey-summary-label">Tính năng</span>
                    <span className="survey-summary-value">{data.specialFeatures.map((f) => FEATURE_OPTIONS.find((fo) => fo.value === f)?.label).join(", ")}</span>
                  </div>
                )}
                <div className="survey-summary-row">
                  <span className="survey-summary-label">Màu chủ đạo</span>
                  <span className="survey-summary-value flex items-center gap-2">
                    <span className="inline-block w-4 h-4 rounded-full" style={{ background: data.colorPreference }} />
                    {COLOR_OPTIONS.find((c) => c.value === data.colorPreference)?.label}
                  </span>
                </div>
              </div>

              <button
                className="btn-primary w-full justify-center py-4 text-base"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? (
                  <>
                    <div className="spinner" />
                    AI Đang Tạo Website...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Tạo Website Với AI
                  </>
                )}
              </button>

              {generating && (
                <p className="text-sm text-center ai-generating" style={{ color: "var(--text-muted)" }}>
                  AI đang phân tích thông tin và tạo layout phù hợp nhất cho nhà hàng của bạn. Quá trình này mất 10-20 giây...
                </p>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="survey-nav">
            {step > 0 && (
              <button className="btn-secondary" onClick={() => setStep(step - 1)}>
                <ArrowLeft size={16} /> Quay lại
              </button>
            )}
            <div className="flex-1" />
            {step < 4 && (
              <button
                className="btn-primary"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
              >
                Tiếp theo <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
