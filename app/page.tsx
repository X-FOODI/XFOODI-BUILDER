"use client";

import { useState } from "react";
import OnboardingSurvey from "@/components/onboarding/OnboardingSurvey";
import TemplatePicker from "@/components/onboarding/TemplatePicker";
import { useRouter } from "next/navigation";
import { useEditorStore } from "@/lib/store/editor-store";
import type { SectionConfig } from "@/lib/types/layout";
import { Sparkles, LayoutTemplate, ArrowRight } from "lucide-react";

type Flow = "landing" | "survey" | "templates";

export default function Home() {
  const [flow, setFlow] = useState<Flow>("landing");
  const router = useRouter();
  const { setSections, updateTheme, updateSEO, setLayoutName, setGenerating } = useEditorStore();

  const handleAIGenerated = (sections: SectionConfig[], theme: Record<string, unknown>, seo: Record<string, unknown>, name: string) => {
    setSections(sections);
    if (theme) updateTheme(theme as Parameters<typeof updateTheme>[0]);
    if (seo) updateSEO(seo as Parameters<typeof updateSEO>[0]);
    if (name) setLayoutName(name);
    router.push("/editor");
  };

  const handleTemplateSelected = (sections: SectionConfig[], theme: Record<string, unknown>, seo: Record<string, unknown>, name: string) => {
    setSections(sections);
    if (theme) updateTheme(theme as Parameters<typeof updateTheme>[0]);
    if (seo) updateSEO(seo as Parameters<typeof updateSEO>[0]);
    if (name) setLayoutName(name);
    router.push("/editor");
  };

  if (flow === "survey") {
    return (
      <OnboardingSurvey
        onBack={() => setFlow("landing")}
        onGenerated={handleAIGenerated}
        setGenerating={setGenerating}
      />
    );
  }

  if (flow === "templates") {
    return (
      <TemplatePicker
        onBack={() => setFlow("landing")}
        onSelect={handleTemplateSelected}
      />
    );
  }

  // Landing — choose your path
  return (
    <div className="landing-page">
      {/* Background gradient orbs */}
      <div className="landing-orb landing-orb-1" />
      <div className="landing-orb landing-orb-2" />
      <div className="landing-orb landing-orb-3" />

      <div className="landing-content">
        {/* Logo & Header */}
        <div className="landing-header">
          <div className="landing-logo">
            <Sparkles size={28} />
            <span>XFoodi</span>
          </div>
          <h1 className="landing-title">
            Tạo Website Nhà Hàng<br />
            <span className="landing-title-accent">Chỉ Trong Vài Phút</span>
          </h1>
          <p className="landing-subtitle">
            Sử dụng AI hoặc chọn template có sẵn để xây dựng trang web chuyên nghiệp cho nhà hàng của bạn
          </p>
        </div>

        {/* Two Cards */}
        <div className="landing-cards">
          {/* AI Builder Card */}
          <button
            className="landing-card landing-card-ai"
            onClick={() => setFlow("survey")}
          >
            <div className="landing-card-glow" />
            <div className="landing-card-icon landing-card-icon-ai">
              <Sparkles size={32} />
            </div>
            <h2 className="landing-card-title">AI Builder</h2>
            <p className="landing-card-desc">
              Trả lời vài câu hỏi về nhà hàng, AI sẽ tự động tạo website hoàn chỉnh cho bạn
            </p>
            <div className="landing-card-features">
              <span className="flex items-center gap-2"><Sparkles size={12} className="text-[var(--primary)]" /> Khảo sát thông minh</span>
              <span className="flex items-center gap-2"><Sparkles size={12} className="text-[var(--primary)]" /> AI tạo nội dung</span>
              <span className="flex items-center gap-2"><Sparkles size={12} className="text-[var(--primary)]" /> Tùy chỉnh sau khi tạo</span>
            </div>
            <div className="landing-card-cta landing-card-cta-ai flex items-center gap-1">
              Bắt Đầu Với AI <ArrowRight size={16} />
            </div>
          </button>

          {/* Template Card */}
          <button
            className="landing-card landing-card-template"
            onClick={() => setFlow("templates")}
          >
            <div className="landing-card-icon landing-card-icon-template">
              <LayoutTemplate size={32} />
            </div>
            <h2 className="landing-card-title">Chọn Template</h2>
            <p className="landing-card-desc">
              Duyệt qua bộ sưu tập template nhà hàng chuyên nghiệp và tùy chỉnh theo ý bạn
            </p>
            <div className="landing-card-features">
              <span className="flex items-center gap-2"><LayoutTemplate size={12} className="text-[#818CF8]" /> 6+ template có sẵn</span>
              <span className="flex items-center gap-2"><LayoutTemplate size={12} className="text-[#818CF8]" /> Xem preview trước</span>
              <span className="flex items-center gap-2"><LayoutTemplate size={12} className="text-[#818CF8]" /> Kéo thả tùy chỉnh</span>
            </div>
            <div className="landing-card-cta landing-card-cta-template flex items-center gap-1">
              Xem Templates <ArrowRight size={16} />
            </div>
          </button>
        </div>

        {/* Skip link */}
        <button
          className="landing-skip flex items-center gap-1 mx-auto justify-center"
          onClick={() => router.push("/editor")}
        >
          Hoặc bắt đầu từ trang trắng <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
