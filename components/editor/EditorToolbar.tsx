"use client";

import { useState, useEffect } from "react";
import { useEditorStore } from "@/lib/store/editor-store";
import { Save, Eye, Undo2, Redo2, Monitor, Smartphone, Upload, Sparkles, Sun, Moon } from "lucide-react";

export default function EditorToolbar() {
  const {
    layoutName, setLayoutName, isDirty, saving, setSaving, markClean,
    previewMode, setPreviewMode, previewOnly, setPreviewOnly, sections, theme, updateTheme, seo, layoutId,
    tenantId, tenantHostname,
    undo, redo, historyIndex, history, status, generating,
  } = useEditorStore();

  const [isDarkMode, setIsDarkMode] = useState(theme.mode === "dark");

  useEffect(() => {
    setIsDarkMode(theme.mode === "dark");
  }, [theme.mode]);

  const toggleTheme = () => {
    const newMode = theme.mode === "dark" ? "light" : "dark";
    updateTheme({ mode: newMode });
  };

  // Handled above in store hook

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        tenantId,
        tenantHostname,
        name: layoutName,
        status,
        version: 1,
        theme,
        sections,
        seo,
        publishedAt: null,
      };

      if (layoutId) {
        await fetch(`/api/layouts/${layoutId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        const res = await fetch("/api/layouts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.id) {
          // Store the new layout ID
          useEditorStore.setState({ layoutId: data.id });
        }
      }
      markClean();
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    // Always save current changes first to ensure they are synchronized
    await handleSave();
    
    const currentId = useEditorStore.getState().layoutId;
    if (!currentId) return;

    try {
      await fetch(`/api/layouts/${currentId}/publish`, { method: "POST" });
      useEditorStore.setState({ status: "published" });
      alert("Layout published successfully! 🎉");
    } catch (err) {
      console.error("Publish failed:", err);
    }
  };

  return (
    <div className="editor-toolbar">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-4">
        <Sparkles size={20} style={{ color: "var(--primary)" }} />
        <span className="text-sm font-bold" style={{ color: "var(--primary)" }}>
          XFoodi Builder
        </span>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 24, background: "var(--border)" }} />

      {/* Layout Name */}
      <input
        value={layoutName}
        onChange={(e) => setLayoutName(e.target.value)}
        className="input"
        style={{
          width: 220, padding: "6px 12px", fontSize: 13,
          background: "transparent", border: "1px solid transparent",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--border)")}
        onBlur={(e) => (e.target.style.borderColor = "transparent")}
      />

      {/* Status Badge */}
      {status === "published" && (
        <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{
          background: "rgba(34, 197, 94, 0.15)",
          color: "#22c55e",
        }}>
          Published
        </span>
      )}

      {generating && (
        <span className="flex items-center gap-1 text-xs font-semibold ai-generating" style={{ color: "var(--primary)" }}>
          <Sparkles size={14} />
          AI Generating...
        </span>
      )}

      <div className="flex-1" />

      {/* Preview Toggle */}
      <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "var(--bg-elevated)" }}>
        <button
          onClick={() => setPreviewMode("desktop")}
          className="btn-icon"
          style={{
            background: previewMode === "desktop" ? "var(--primary-light)" : "transparent",
            borderColor: previewMode === "desktop" ? "var(--primary)" : "transparent",
            color: previewMode === "desktop" ? "var(--primary)" : "var(--text-muted)",
          }}
          title="Desktop preview"
        >
          <Monitor size={16} />
        </button>
        <button
          onClick={() => setPreviewMode("mobile")}
          className="btn-icon"
          style={{
            background: previewMode === "mobile" ? "var(--primary-light)" : "transparent",
            borderColor: previewMode === "mobile" ? "var(--primary)" : "transparent",
            color: previewMode === "mobile" ? "var(--primary)" : "var(--text-muted)",
          }}
          title="Mobile preview"
        >
          <Smartphone size={16} />
        </button>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="btn-icon"
        style={{
          color: isDarkMode ? "#FBBF24" : "var(--text-secondary)",
          background: "transparent",
        }}
        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* Undo / Redo */}
      <button className="btn-icon" onClick={undo} disabled={!canUndo} style={{ opacity: canUndo ? 1 : 0.3 }} title="Undo">
        <Undo2 size={16} />
      </button>
      <button className="btn-icon" onClick={redo} disabled={!canRedo} style={{ opacity: canRedo ? 1 : 0.3 }} title="Redo">
        <Redo2 size={16} />
      </button>

      {/* Divider */}
      <div style={{ width: 1, height: 24, background: "var(--border)" }} />

      {/* Preview Toggle */}
      <button
        onClick={() => setPreviewOnly(!previewOnly)}
        className="btn-icon"
        style={{
          background: previewOnly ? "var(--primary-light)" : "transparent",
          borderColor: previewOnly ? "var(--primary)" : "transparent",
          color: previewOnly ? "var(--primary)" : "var(--text-secondary)",
          width: 36,
          height: 36,
        }}
        title={previewOnly ? "Chế độ Chỉnh sửa" : "Chế độ Xem trước"}
      >
        <Eye size={18} />
      </button>

      {/* Save */}
      <button className="btn-secondary" onClick={handleSave} disabled={saving || !isDirty}>
        {saving ? <div className="spinner" /> : <Save size={15} />}
        {saving ? "Saving..." : "Save"}
      </button>

      {/* Publish */}
      <button className="btn-primary" onClick={handlePublish} disabled={saving || sections.length === 0}>
        <Upload size={15} />
        Publish
      </button>
    </div>
  );
}
