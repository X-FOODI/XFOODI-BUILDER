"use client";

import { useEditorStore } from "@/lib/store/editor-store";
import { getSectionMeta } from "@/lib/sections/registry";
import { Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function PropertyPanel() {
  const { selectedSectionId, sections, updateSectionProps, commitHistorySnapshot, theme, updateTheme } = useEditorStore();
  const [aiLoading, setAiLoading] = useState(false);
  const commitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const section = sections.find((s) => s.id === selectedSectionId);

  // Clean up timeout on unmount or section change
  useEffect(() => {
    return () => {
      if (commitTimeoutRef.current) {
        clearTimeout(commitTimeoutRef.current);
      }
    };
  }, [selectedSectionId]);

  if (!section) {
    return (
      <div style={{ padding: "20px" }}>
        <h3 className="text-sm font-bold mb-1" style={{ color: "var(--text-primary)" }}>
          Page Settings
        </h3>
        <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
          Select a section to edit its properties, or configure page-wide settings here
        </p>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
          <div className="mb-4">
            <label className="label" style={{ color: "var(--text-secondary)", fontWeight: 600, fontSize: 12 }}>
              Hiệu ứng toàn trang (Page Animation)
            </label>
            <select
              className="input"
              value={theme.pageAnimation || "none"}
              onChange={(e) => updateTheme({ pageAnimation: e.target.value as typeof theme.pageAnimation })}
              style={{
                background: "var(--bg-elevated)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "10px 14px",
                width: "100%",
                cursor: "pointer",
                outline: "none"
              }}
            >
              <option value="none">Không có (None)</option>
              <option value="fadeIn">Hiện dần (Fade In)</option>
              <option value="slideUp">Trượt lên (Slide Up)</option>
              <option value="slideLeft">Trượt từ phải qua (Slide Left)</option>
            </select>
            <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
              Áp dụng cho mọi section chưa tự đặt hiệu ứng riêng. Trong Preview, section sẽ animate khi cuộn tới.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const meta = getSectionMeta(section.type);
  const props = section.props as Record<string, unknown>;

  const handleChange = (key: string, value: unknown) => {
    updateSectionProps(section.id, { [key]: value });

    if (commitTimeoutRef.current) {
      clearTimeout(commitTimeoutRef.current);
    }

    commitTimeoutRef.current = setTimeout(() => {
      const sectionName = meta?.label || section.type;
      commitHistorySnapshot(`Sửa nội dung ${key} của phần ${sectionName}`);
    }, 1000);
  };

  const handleAIRewrite = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionType: section.type,
          context: { businessName: "Restaurant" },
          currentProps: section.props,
        }),
      });
      const data = await res.json();
      if (data.success && data.props) {
        updateSectionProps(section.id, data.props);
      }
    } catch (err) {
      console.error("AI rewrite failed:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const renderField = (key: string, value: unknown, path: string = key): React.ReactNode => {
    if (value === null || value === undefined) return null;

    if (typeof value === "string") {
      const isLong = value.length > 80 || key === "story" || key === "description" || key === "subtitle";
      return (
        <div key={path} className="mb-3">
          <label className="label">{formatLabel(key)}</label>
          {isLong ? (
            <textarea
              className="input"
              rows={3}
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          ) : (
            <input
              className="input"
              type={key.includes("color") || key.includes("Color") ? "color" : "text"}
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              style={
                key.includes("color") || key.includes("Color")
                  ? { height: 40, padding: 4 }
                  : undefined
              }
            />
          )}
        </div>
      );
    }

    if (typeof value === "number") {
      return (
        <div key={path} className="mb-3">
          <label className="label">{formatLabel(key)}</label>
          <input
            className="input"
            type="number"
            step={key.includes("opacity") || key.includes("Opacity") ? 0.1 : 1}
            min={0}
            max={key.includes("opacity") || key.includes("Opacity") ? 1 : undefined}
            value={value}
            onChange={(e) => handleChange(key, parseFloat(e.target.value))}
          />
        </div>
      );
    }

    if (typeof value === "boolean") {
      return (
        <div key={path} className="mb-3 flex items-center justify-between">
          <label className="label" style={{ marginBottom: 0 }}>{formatLabel(key)}</label>
          <button
            onClick={() => handleChange(key, !value)}
            className="relative rounded-full transition-colors"
            style={{
              width: 44, height: 24,
              background: value ? "var(--primary)" : "var(--bg-elevated)",
              border: `1px solid ${value ? "var(--primary)" : "var(--border)"}`,
              cursor: "pointer",
            }}
          >
            <div
              className="absolute top-0.5 rounded-full bg-white transition-all"
              style={{
                width: 18, height: 18,
                left: value ? 22 : 3,
              }}
            />
          </button>
        </div>
      );
    }

    if (key === "links" && Array.isArray(value)) {
      const linkList = value as { label: string; href: string }[];
      return (
        <div key={path} className="mb-4 p-4 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--bg-base)" }}>
          <div className="flex items-center justify-between mb-3">
            <label className="label font-bold mb-0" style={{ fontSize: 13, color: "var(--text-primary)" }}>
              Navigation Links
            </label>
            <button
              onClick={() => {
                const updated = [...linkList, { label: "Link mới", href: "#" }];
                handleChange(key, updated);
              }}
              className="text-xs px-2.5 py-1 rounded bg-[var(--primary)] text-white hover:opacity-90 font-bold"
              style={{ cursor: "pointer", border: "none" }}
            >
              + Thêm link
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {linkList.map((link, idx) => (
              <div key={idx} className="flex gap-2 items-center p-3 rounded-lg border relative" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
                <div className="flex-1 flex flex-col gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-[var(--text-secondary)] block mb-0.5 uppercase tracking-wider">Tên nhãn (Label)</label>
                    <input
                      className="input text-xs"
                      style={{ padding: "6px 10px" }}
                      placeholder="Ví dụ: Thực Đơn"
                      value={link.label}
                      onChange={(e) => {
                        const updated = [...linkList];
                        updated[idx] = { ...updated[idx], label: e.target.value };
                        handleChange(key, updated);
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[var(--text-secondary)] block mb-0.5 uppercase tracking-wider">Đường dẫn (URL)</label>
                    <input
                      className="input text-xs"
                      style={{ padding: "6px 10px" }}
                      placeholder="Ví dụ: #menu"
                      value={link.href}
                      onChange={(e) => {
                        const updated = [...linkList];
                        updated[idx] = { ...updated[idx], href: e.target.value };
                        handleChange(key, updated);
                      }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    const updated = linkList.filter((_, i) => i !== idx);
                    handleChange(key, updated);
                  }}
                  className="px-2 py-1 rounded text-red-500 hover:bg-red-500/10 font-bold text-xs"
                  style={{ cursor: "pointer", border: "none", background: "transparent" }}
                  title="Xóa link"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Skip rendering arrays and objects (too complex for inline editing)
    if (Array.isArray(value)) {
      return (
        <div key={path} className="mb-3">
          <label className="label">{formatLabel(key)} ({value.length} items)</label>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Complex data — edit via JSON or use AI to regenerate
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
            {meta?.label || section.type}
          </h3>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Edit section properties
          </p>
        </div>
        {meta?.aiGeneratable && (
          <button
            className="btn-secondary"
            onClick={handleAIRewrite}
            disabled={aiLoading}
            style={{ fontSize: 12 }}
          >
            {aiLoading ? <div className="spinner" /> : <Sparkles size={14} />}
            AI Rewrite
          </button>
        )}
      </div>

      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
        {/* Scroll Animation configuration */}
        <div className="mb-4">
          <label className="label" style={{ color: "var(--text-secondary)", fontWeight: 600, fontSize: 12 }}>Hiệu ứng cuộn (Animation)</label>
          <select
            className="input"
            value={(props.animation as string) || "none"}
            onChange={(e) => handleChange("animation", e.target.value)}
            style={{
              background: "var(--bg-elevated)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "10px 14px",
              width: "100%",
              cursor: "pointer",
              outline: "none"
            }}
          >
            <option value="none">Không có (None)</option>
            <option value="fadeIn">Hiện dần (Fade In)</option>
            <option value="slideUp">Trượt lên (Slide Up)</option>
            <option value="slideLeft">Trượt từ phải qua (Slide Left)</option>
          </select>
        </div>

        {Object.entries(props)
          .filter(([key]) => key !== "animation")
          .map(([key, value]) => renderField(key, value))}
      </div>
    </div>
  );
}

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}
