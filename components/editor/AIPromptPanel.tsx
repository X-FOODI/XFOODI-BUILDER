"use client";

import { useState } from "react";
import { useEditorStore } from "@/lib/store/editor-store";
import { Sparkles, Wand2, ChevronDown } from "lucide-react";
import { IconRenderer } from "@/lib/icons";

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
  const { setGenerating, setSections, updateTheme, updateSEO, setLayoutName } = useEditorStore();
  const generating = useEditorStore((s) => s.generating);

  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("modern");
  const [cuisine, setCuisine] = useState("Vietnamese");
  const [businessName, setBusinessName] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim() && !businessName.trim()) return;

    setGenerating(true);
    try {
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
    } catch (err) {
      console.error("AI generation error:", err);
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
            AI Generator
          </h3>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Describe your restaurant
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
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

        {/* Custom Prompt */}
        <div>
          <label className="label">Additional Instructions (Optional)</label>
          <textarea
            className="input"
            rows={3}
            placeholder="e.g., Include a large hero section with a dark theme, focus on seafood menu items, add testimonials..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        {/* Generate Button */}
        <button
          className="btn-primary w-full justify-center py-3"
          onClick={handleGenerate}
          disabled={generating || (!prompt.trim() && !businessName.trim())}
          style={{ fontSize: 15 }}
        >
          {generating ? (
            <>
              <div className="spinner" />
              Generating with AI...
            </>
          ) : (
            <>
              <Wand2 size={18} />
              Generate Layout
            </>
          )}
        </button>

        {generating && (
          <p className="text-xs text-center ai-generating" style={{ color: "var(--text-muted)" }}>
            AI is crafting your restaurant page. This may take 10-20 seconds...
          </p>
        )}
      </div>
    </div>
  );
}
