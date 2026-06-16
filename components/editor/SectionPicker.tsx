"use client";

import { SECTION_REGISTRY } from "@/lib/sections/registry";
import { useEditorStore } from "@/lib/store/editor-store";
import type { SectionType } from "@/lib/types/layout";
import { Plus } from "lucide-react";
import * as Icons from "lucide-react";

export default function SectionPicker() {
  const addSection = useEditorStore((s) => s.addSection);

  return (
    <div style={{ padding: "20px" }}>
      <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text-secondary)" }}>
        Add Section
      </h3>
      <div className="flex flex-col gap-2">
        {SECTION_REGISTRY.map((section) => {
          const IconComp = ((Icons as unknown) as Record<string, React.ComponentType<{ size?: number }>>)[section.icon] || Icons.LayoutGrid;
          return (
            <button
              key={section.type}
              onClick={() => addSection(section.type as SectionType)}
              className="section-card"
              style={{ background: "transparent" }}
            >
              <div
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: 40,
                  height: 40,
                  background: "var(--primary-light)",
                  color: "var(--primary)",
                  flexShrink: 0,
                }}
              >
                <IconComp size={20} />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {section.label}
                </div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {section.description}
                </div>
              </div>
              <Plus size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
