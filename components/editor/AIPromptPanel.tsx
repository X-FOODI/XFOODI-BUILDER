"use client";

import { useState } from "react";
import { useEditorStore } from "@/lib/store/editor-store";
import { Sparkles, Wand2, ChevronDown, X } from "lucide-react";
import { IconRenderer } from "@/lib/icons";
import { getSectionMeta } from "@/lib/sections/registry";

const STYLE_PRESETS = [
  { label: "Modern & Minimalist", value: "modern", icon: "Sparkles" },
  { label: "Classic & Elegant", value: "classic", icon: "Landmark" },
  { label: "Cozy & Warm", value: "cozy", icon: "Flame" },
  { label: "Luxury Fine Dining", value: "luxury", icon: "Gem" },
  { label: "Street Food Vibe", value: "street-food", icon: "Utensils" },
];

const CUISINE_PRESETS = [
  "Vietnamese", "Japanese", "Italian", "Korean", "Thai",
  "Chinese", "French", "American", "Mexican", "Indian",
];

export default function AIPromptPanel() {
  const { 
    sections, 
    updateSectionProps, 
    commitHistorySnapshot,
    setGenerating, 
    setSections, 
    updateTheme, 
    updateSEO, 
    setLayoutName 
  } = useEditorStore();
  const generating = useEditorStore((s) => s.generating);

  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("modern");
  const [cuisine, setCuisine] = useState("Vietnamese");
  const [businessName, setBusinessName] = useState("");

  // Section Drag & Drop / Single Edit state
  const [attachedSectionId, setAttachedSectionId] = useState<string | null>(null);
  const [attachedSectionType, setAttachedSectionType] = useState<string | null>(null);
  const [attachedSectionLabel, setAttachedSectionLabel] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const sectionId = e.dataTransfer.getData("sectionId");
    if (!sectionId) return;

    const targetSection = sections.find((s) => s.id === sectionId);
    if (targetSection) {
      const meta = getSectionMeta(targetSection.type);
      setAttachedSectionId(targetSection.id);
      setAttachedSectionType(targetSection.type);
      setAttachedSectionLabel(meta?.label || targetSection.type);
    }
  };

  const handleDetachSection = () => {
    setAttachedSectionId(null);
    setAttachedSectionType(null);
    setAttachedSectionLabel(null);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() && !businessName.trim() && !attachedSectionId) return;

    setGenerating(true);
    try {
      if (attachedSectionId && attachedSectionType) {
        // Edit single section with AI instruction
        const currentSection = sections.find((s) => s.id === attachedSectionId);
        if (!currentSection) {
          alert("Attached section not found on canvas.");
          handleDetachSection();
          setGenerating(false);
          return;
        }

        const res = await fetch("/api/ai/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sectionType: attachedSectionType,
            currentProps: currentSection.props,
            instruction: prompt,
          }),
        });

        const data = await res.json();
        if (data.success && data.props) {
          updateSectionProps(attachedSectionId, data.props);
          commitHistorySnapshot(`AI sửa phần: ${attachedSectionLabel}`);
          setPrompt("");
          alert(`Chỉnh sửa phần "${attachedSectionLabel}" thành công! 🎉`);
        } else {
          console.error("AI editing failed:", data.error);
          alert(`AI editing failed: ${data.error || "Unknown error"}`);
        }
      } else {
        // Generate full layout
        const res = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: prompt || `Create a ${style} restaurant landing page for ${businessName || "a restaurant"} serving ${cuisine} cuisine`,
            tenantId: "demo",
            tenantHostname: "demo.xfoodi.website",
            tenantData: {
              businessName: businessName || undefined,
            },
            style: {
              mood: style,
            },
          }),
        });

        const data = await res.json();

        if (data.success && data.layout) {
          setSections(data.layout.sections);
          if (data.layout.theme) updateTheme(data.layout.theme);
          if (data.layout.seo) updateSEO(data.layout.seo);
          if (data.layout.name) setLayoutName(data.layout.name);
        } else {
          console.error("AI generation failed:", data.error);
          alert(`AI generation failed: ${data.error || "Unknown error"}`);
        }
      }
    } catch (err) {
      console.error("AI execution error:", err);
      alert("Failed to connect to AI service. Check your Gemini API key.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="ai-glow" style={{ borderRadius: 12, padding: 2 }}>
          <div className="flex items-center justify-center rounded-xl" style={{
            width: 36, height: 36,
            background: "var(--bg-surface)",
          }}>
            <Sparkles size={18} style={{ color: "var(--primary)" }} />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
            AI Assistant
          </h3>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {attachedSectionId ? "Edit section with AI" : "Describe your restaurant"}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Drag & Drop Attach Zone */}
        {!attachedSectionId ? (
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${isDragOver ? "var(--primary)" : "var(--border)"}`,
              background: isDragOver ? "var(--primary-light)" : "var(--bg-elevated)",
              borderRadius: 12,
              padding: "20px 16px",
              textAlign: "center",
              cursor: "default",
              transition: "all 0.2s",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Sparkles size={24} style={{ color: isDragOver ? "var(--primary)" : "var(--text-muted)", opacity: 0.8 }} />
            <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", lineHeight: 1.4 }}>
              📍 Kéo & thả Section từ canvas vào đây để chỉnh sửa riêng phần đó
            </p>
          </div>
        ) : (
          <div 
            style={{
              background: "var(--primary-light)",
              border: "1px solid var(--primary)",
              borderRadius: 12,
              padding: "12px 16px",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <button 
              onClick={handleDetachSection}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "transparent",
                border: "none",
                color: "var(--primary)",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Gỡ bỏ phần đính kèm"
            >
              <X size={16} />
            </button>
            <p style={{ fontSize: "10px", textTransform: "uppercase", fontWeight: 700, color: "var(--primary)", letterSpacing: "0.05em" }}>
              📍 ĐANG ĐÍNH KÈM ĐỂ CHỈNH SỬA
            </p>
            <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
              {attachedSectionLabel}
            </h4>
            <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              ID: {attachedSectionId}
            </p>
          </div>
        )}

        {/* Form fields for Full layout generation (hide if section attached) */}
        {!attachedSectionId && (
          <>
            {/* Restaurant Name */}
            <div>
              <label className="label">Restaurant Name</label>
              <input
                className="input"
                placeholder="e.g., Phở Hà Nội, Sushi Sakura..."
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>

            {/* Cuisine */}
            <div>
              <label className="label">Cuisine Type</label>
              <div className="relative">
                <select
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="input appearance-none pr-8"
                  style={{ cursor: "pointer" }}
                >
                  {CUISINE_PRESETS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }} />
              </div>
            </div>

            {/* Style */}
            <div>
              <label className="label">Style</label>
              <div className="grid grid-cols-1 gap-2">
                {STYLE_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setStyle(preset.value)}
                    className="flex items-center gap-3 px-5 py-3.5 rounded-lg text-left transition-all text-sm font-semibold"
                    style={{
                      background: style === preset.value ? "var(--primary-light)" : "var(--bg-elevated)",
                      border: `1px solid ${style === preset.value ? "var(--primary)" : "var(--border)"}`,
                      color: style === preset.value ? "var(--primary)" : "var(--text-primary)",
                      cursor: "pointer",
                      fontWeight: style === preset.value ? 600 : 500,
                    }}
                  >
                    <IconRenderer name={preset.icon} size={18} />
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Custom Prompt Instruction */}
        <div>
          <label className="label">
            {attachedSectionId ? "Yêu cầu chỉnh sửa của bạn" : "Additional Instructions (Optional)"}
          </label>
          <textarea
            className="input"
            rows={4}
            placeholder={
              attachedSectionId 
                ? "Ví dụ: Đổi tiêu đề thành 'Món Ăn Nổi Bật', đổi hình nền sang sushi tươi ngon..."
                : "e.g., Include a large hero section with a dark theme, focus on seafood menu items, add testimonials..."
            }
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        {/* Generate Button */}
        <button
          className="btn-primary w-full justify-center py-3"
          onClick={handleGenerate}
          disabled={generating || (!prompt.trim() && !businessName.trim() && !attachedSectionId)}
          style={{ fontSize: 15 }}
        >
          {generating ? (
            <>
              <div className="spinner" />
              {attachedSectionId ? "AI đang chỉnh sửa..." : "AI đang thiết kế..."}
            </>
          ) : (
            <>
              <Wand2 size={18} />
              {attachedSectionId ? "Chỉnh sửa phần này với AI" : "Tạo bố cục trang web"}
            </>
          )}
        </button>

        {generating && (
          <p className="text-xs text-center ai-generating" style={{ color: "var(--text-muted)" }}>
            AI đang xử lý yêu cầu của bạn. Quá trình này có thể mất 10-20 giây...
          </p>
        )}
      </div>
    </div>
  );
}
