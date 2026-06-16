"use client";

import { useEditorStore } from "@/lib/store/editor-store";
import { getSectionMeta } from "@/lib/sections/registry";
import SectionRenderer from "@/components/sections/SectionRenderer";
import { GripVertical, Trash2, Copy, Eye, EyeOff, LayoutGrid, Sparkles, Layers, Palette } from "lucide-react";

export default function EditorCanvas() {
  const { sections, selectedSectionId, selectSection, removeSection,
          duplicateSection, toggleSectionVisibility, previewMode,
          reorderSections, previewOnly, theme } = useEditorStore();

  const canvasWidth = previewMode === "mobile" ? 375 : "100%";

  if (sections.length === 0) {
    return (
      <div className="editor-canvas flex flex-col items-center justify-center gap-4">
        <div
          className="flex flex-col items-center justify-center rounded-2xl"
          style={{
            width: "100%",
            maxWidth: 600,
            padding: 60,
            border: "2px dashed var(--border)",
            textAlign: "center",
          }}
        >
          <LayoutGrid size={48} className="mb-4" style={{ color: "var(--primary)", opacity: 0.8 }} />
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            Start Building Your Restaurant Page
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)", maxWidth: 400 }}>
            Use the <strong>AI Generator</strong> to create a full layout instantly, or pick individual sections from the sidebar.
          </p>
          <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
            <span className="flex items-center gap-1"><Sparkles size={12} /> AI Generate</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Layers size={12} /> Pick Sections</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Palette size={12} /> Customize</span>
          </div>
        </div>
      </div>
    );
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (previewOnly) return;
    e.dataTransfer.setData("text/plain", String(index));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    if (previewOnly) return;
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"));
    if (!isNaN(sourceIndex) && sourceIndex !== targetIndex) {
      reorderSections(sourceIndex, targetIndex);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (previewOnly) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  return (
    <div className="editor-canvas">
      <div
        className={`flex flex-col gap-0 transition-all duration-300 ${theme.mode || "dark"}`}
        style={{
          width: canvasWidth,
          maxWidth: "100%",
          background: "var(--bg-surface)",
          borderRadius: previewOnly ? 0 : 12,
          overflow: "hidden",
          boxShadow: previewOnly ? "none" : "0 4px 24px rgba(0,0,0,0.2)",
          flexShrink: 0,
          fontFamily: theme.fontFamily || "Inter, sans-serif",
          ...({
            "--primary": theme.primaryColor || "#FF380B",
            "--primary-light": hexToRgba(theme.primaryColor || "#FF380B", 0.15),
          } as React.CSSProperties),
        }}
      >
        {sections.map((section, index) => {
          // If in previewOnly mode, completely skip rendering invisible sections
          if (previewOnly && !section.visible) return null;

          const meta = getSectionMeta(section.type);
          const isSelected = selectedSectionId === section.id;

          return (
            <div
              key={section.id}
              className={`section-wrapper ${isSelected && !previewOnly ? "selected" : ""} ${previewOnly ? "preview-mode-active" : ""}`}
              onClick={() => {
                if (!previewOnly) selectSection(section.id);
              }}
              draggable={!previewOnly}
              onDragStart={(e) => handleDragStart(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={handleDragOver}
              style={{
                opacity: (section.visible || previewOnly) ? 1 : 0.4,
                position: "relative",
              }}
            >
              {/* Section Label */}
              {!previewOnly && (
                <div
                  className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold"
                  style={{
                    background: "rgba(0,0,0,0.6)",
                    color: "#fff",
                    backdropFilter: "blur(4px)",
                    opacity: isSelected ? 1 : 0,
                    transition: "opacity 0.2s",
                  }}
                >
                  <GripVertical size={12} className="drag-handle" />
                  {meta?.label || section.type}
                </div>
              )}

              {/* Section Actions */}
              {!previewOnly && (
                <div className="section-actions">
                  <button
                    className="btn-icon"
                    onClick={(e) => { e.stopPropagation(); toggleSectionVisibility(section.id); }}
                    title={section.visible ? "Hide" : "Show"}
                    style={{ width: 28, height: 28, background: "rgba(0,0,0,0.6)", borderColor: "transparent", color: "#fff" }}
                  >
                    {section.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    className="btn-icon"
                    onClick={(e) => { e.stopPropagation(); duplicateSection(section.id); }}
                    title="Duplicate"
                    style={{ width: 28, height: 28, background: "rgba(0,0,0,0.6)", borderColor: "transparent", color: "#fff" }}
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    className="btn-icon"
                    onClick={(e) => { e.stopPropagation(); removeSection(section.id); }}
                    title="Delete"
                    style={{ width: 28, height: 28, background: "rgba(239,68,68,0.8)", borderColor: "transparent", color: "#fff" }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}

              {/* Rendered Section */}
              <SectionRenderer section={section} pageAnimation={theme.pageAnimation} previewOnly={previewOnly} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function hexToRgba(color: string, alpha: number): string {
  if (!color) return `rgba(255, 56, 11, ${alpha})`;
  if (color.startsWith("rgba") || color.startsWith("rgb")) return color;
  const cleanHex = color.replace("#", "");
  let r = 255, g = 56, b = 11;
  try {
    if (cleanHex.length === 3) {
      r = parseInt(cleanHex[0] + cleanHex[0], 16);
      g = parseInt(cleanHex[1] + cleanHex[1], 16);
      b = parseInt(cleanHex[2] + cleanHex[2], 16);
    } else if (cleanHex.length === 6) {
      r = parseInt(cleanHex.substring(0, 2), 16);
      g = parseInt(cleanHex.substring(2, 4), 16);
      b = parseInt(cleanHex.substring(4, 6), 16);
    }
  } catch (e) {
    console.error("Error parsing hex color", e);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
