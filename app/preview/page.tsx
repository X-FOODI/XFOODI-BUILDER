"use client";

import { useEditorStore } from "@/lib/store/editor-store";
import SectionRenderer from "@/components/sections/SectionRenderer";

export default function PreviewPage() {
  const sections = useEditorStore((s) => s.sections);
  const theme = useEditorStore((s) => s.theme);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.mode === "dark" ? "#0A0E14" : "#F8FAFC",
        fontFamily: theme.fontFamily || "Inter, sans-serif",
        // Override CSS variables with theme
        ["--primary" as string]: theme.primaryColor || "#FF380B",
      }}
    >
      {sections.filter((s) => s.visible).map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
      {sections.length === 0 && (
        <div className="flex items-center justify-center" style={{ minHeight: "100vh" }}>
          <p className="text-lg" style={{ color: "var(--text-muted)" }}>
            No sections to preview. Go back to the editor and add some.
          </p>
        </div>
      )}
    </div>
  );
}
