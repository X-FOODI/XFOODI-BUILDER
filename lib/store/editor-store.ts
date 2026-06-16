/* ──────────────────────────────────────────────
 *  Zustand store for the Builder Editor
 *  Supports visual edit history & theme syncing
 * ────────────────────────────────────────────── */

import { create } from "zustand";
import type { SectionConfig, LayoutTheme, LayoutSEO, RestaurantLayout } from "@/lib/types/layout";
import { getDefaultProps, getSectionMeta } from "@/lib/sections/registry";
import type { SectionType } from "@/lib/types/layout";

export interface HistorySnapshot {
  sections: SectionConfig[];
  theme: LayoutTheme;
  seo: LayoutSEO;
  layoutName: string;
  label: string;
  timestamp: string;
}

interface EditorState {
  /* ── Layout data ── */
  layoutId: string | null;
  tenantId: string;
  tenantHostname: string;
  layoutName: string;
  status: "draft" | "published";
  theme: LayoutTheme;
  sections: SectionConfig[];
  seo: LayoutSEO;

  /* ── Editor UI state ── */
  selectedSectionId: string | null;
  previewMode: "desktop" | "mobile";
  previewOnly: boolean;
  isDirty: boolean;
  saving: boolean;
  generating: boolean;

  /* ── History (undo/redo snapshots) ── */
  history: HistorySnapshot[];
  historyIndex: number;

  /* ── Actions ── */
  loadLayout: (layout: RestaurantLayout) => void;
  setTenantInfo: (tenantId: string, tenantHostname: string) => void;
  resetEditor: () => void;

  // Section CRUD
  addSection: (type: SectionType) => void;
  removeSection: (id: string) => void;
  duplicateSection: (id: string) => void;
  updateSectionProps: (id: string, props: Record<string, unknown>) => void;
  toggleSectionVisibility: (id: string) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  selectSection: (id: string | null) => void;
  setSections: (sections: SectionConfig[]) => void;

  // Theme & SEO
  updateTheme: (partial: Partial<LayoutTheme>) => void;
  updateSEO: (partial: Partial<LayoutSEO>) => void;
  setLayoutName: (name: string) => void;

  // Preview
  setPreviewMode: (mode: "desktop" | "mobile") => void;
  setPreviewOnly: (v: boolean) => void;

  // Save state
  setSaving: (v: boolean) => void;
  setGenerating: (v: boolean) => void;
  markClean: () => void;

  // History Actions
  undo: () => void;
  redo: () => void;
  commitHistorySnapshot: (label: string) => void;
  jumpToHistory: (index: number) => void;
  applyTemplate: (sections: SectionConfig[], theme: LayoutTheme, seo: LayoutSEO, templateName: string) => void;
}

function generateId(): string {
  return `sec_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

const DEFAULT_THEME: LayoutTheme = {
  primaryColor: "#FF380B",
  fontFamily: "Inter, sans-serif",
  mode: "dark",
  borderRadius: "rounded",
  pageAnimation: "none",
};

const DEFAULT_SEO: LayoutSEO = {
  title: "Restaurant",
  description: "Welcome to our restaurant",
};

export const useEditorStore = create<EditorState>((set, get) => ({
  layoutId: null,
  tenantId: "demo",
  tenantHostname: "demo.xfoodi.website",
  layoutName: "Untitled Layout",
  status: "draft",
  theme: { ...DEFAULT_THEME },
  sections: [],
  seo: { ...DEFAULT_SEO },
  selectedSectionId: null,
  previewMode: "desktop",
  previewOnly: false,
  isDirty: false,
  saving: false,
  generating: false,
  history: [],
  historyIndex: -1,

  loadLayout: (layout) => {
    const initSnapshot: HistorySnapshot = {
      sections: layout.sections,
      theme: layout.theme,
      seo: layout.seo,
      layoutName: layout.name,
      label: "Tải giao diện lưu trữ",
      timestamp: new Date().toLocaleTimeString("vi-VN")
    };
    set({
      layoutId: layout._id ?? null,
      tenantId: layout.tenantId || "demo",
      tenantHostname: layout.tenantHostname || "demo.xfoodi.website",
      layoutName: layout.name,
      status: layout.status,
      theme: layout.theme,
      sections: layout.sections,
      seo: layout.seo,
      isDirty: false,
      history: [initSnapshot],
      historyIndex: 0,
    });
  },

  setTenantInfo: (tenantId, tenantHostname) =>
    set({ tenantId, tenantHostname }),

  resetEditor: () => {
    const initSnapshot: HistorySnapshot = {
      sections: [],
      theme: { ...DEFAULT_THEME },
      seo: { ...DEFAULT_SEO },
      layoutName: "Untitled Layout",
      label: "Khởi tạo thiết kế mới",
      timestamp: new Date().toLocaleTimeString("vi-VN")
    };
    set({
      layoutId: null,
      tenantId: "demo",
      tenantHostname: "demo.xfoodi.website",
      layoutName: "Untitled Layout",
      status: "draft",
      theme: { ...DEFAULT_THEME },
      sections: [],
      seo: { ...DEFAULT_SEO },
      selectedSectionId: null,
      isDirty: false,
      history: [initSnapshot],
      historyIndex: 0,
    });
  },

  addSection: (type) => {
    set((state) => {
      const newSection: SectionConfig = {
        id: generateId(),
        type,
        visible: true,
        order: state.sections.length,
        props: { ...getDefaultProps(type) },
      };
      const updated = [...state.sections, newSection];
      const meta = getSectionMeta(type);
      const labelName = meta?.label || type;

      const nextHistory = state.history.slice(0, state.historyIndex + 1);
      nextHistory.push({
        sections: updated,
        theme: state.theme,
        seo: state.seo,
        layoutName: state.layoutName,
        label: `Thêm phần: ${labelName}`,
        timestamp: new Date().toLocaleTimeString("vi-VN")
      });

      return {
        sections: updated,
        selectedSectionId: newSection.id,
        isDirty: true,
        history: nextHistory,
        historyIndex: nextHistory.length - 1,
      };
    });
  },

  removeSection: (id) => {
    set((state) => {
      const target = state.sections.find((s) => s.id === id);
      if (!target) return {};
      const meta = getSectionMeta(target.type);
      const labelName = meta?.label || target.type;

      const updated = state.sections
        .filter((s) => s.id !== id)
        .map((s, i) => ({ ...s, order: i }));

      const nextHistory = state.history.slice(0, state.historyIndex + 1);
      nextHistory.push({
        sections: updated,
        theme: state.theme,
        seo: state.seo,
        layoutName: state.layoutName,
        label: `Xóa phần: ${labelName}`,
        timestamp: new Date().toLocaleTimeString("vi-VN")
      });

      return {
        sections: updated,
        selectedSectionId: state.selectedSectionId === id ? null : state.selectedSectionId,
        isDirty: true,
        history: nextHistory,
        historyIndex: nextHistory.length - 1,
      };
    });
  },

  duplicateSection: (id) => {
    set((state) => {
      const original = state.sections.find((s) => s.id === id);
      if (!original) return {};
      const meta = getSectionMeta(original.type);
      const labelName = meta?.label || original.type;

      const idx = state.sections.findIndex((s) => s.id === id);
      const duplicate: SectionConfig = {
        ...original,
        id: generateId(),
        props: { ...original.props },
      };
      const updated = [...state.sections];
      updated.splice(idx + 1, 0, duplicate);
      const reordered = updated.map((s, i) => ({ ...s, order: i }));

      const nextHistory = state.history.slice(0, state.historyIndex + 1);
      nextHistory.push({
        sections: reordered,
        theme: state.theme,
        seo: state.seo,
        layoutName: state.layoutName,
        label: `Nhân bản: ${labelName}`,
        timestamp: new Date().toLocaleTimeString("vi-VN")
      });

      return {
        sections: reordered,
        selectedSectionId: duplicate.id,
        isDirty: true,
        history: nextHistory,
        historyIndex: nextHistory.length - 1,
      };
    });
  },

  updateSectionProps: (id, props) => {
    const state = get();
    const updated = state.sections.map((s) =>
      s.id === id ? { ...s, props: { ...s.props, ...props } } : s
    );
    set({ sections: updated, isDirty: true });
  },

  toggleSectionVisibility: (id) => {
    set((state) => {
      const target = state.sections.find((s) => s.id === id);
      if (!target) return {};
      const meta = getSectionMeta(target.type);
      const labelName = meta?.label || target.type;
      const isNowVisible = !target.visible;

      const updated = state.sections.map((s) =>
        s.id === id ? { ...s, visible: !s.visible } : s
      );

      const nextHistory = state.history.slice(0, state.historyIndex + 1);
      nextHistory.push({
        sections: updated,
        theme: state.theme,
        seo: state.seo,
        layoutName: state.layoutName,
        label: `${isNowVisible ? "Hiện" : "Ẩn"} phần: ${labelName}`,
        timestamp: new Date().toLocaleTimeString("vi-VN")
      });

      return {
        sections: updated,
        isDirty: true,
        history: nextHistory,
        historyIndex: nextHistory.length - 1,
      };
    });
  },

  reorderSections: (fromIndex, toIndex) => {
    set((state) => {
      const updated = [...state.sections];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      const reordered = updated.map((s, i) => ({ ...s, order: i }));

      const nextHistory = state.history.slice(0, state.historyIndex + 1);
      nextHistory.push({
        sections: reordered,
        theme: state.theme,
        seo: state.seo,
        layoutName: state.layoutName,
        label: "Sắp xếp lại thứ tự phần",
        timestamp: new Date().toLocaleTimeString("vi-VN")
      });

      return {
        sections: reordered,
        isDirty: true,
        history: nextHistory,
        historyIndex: nextHistory.length - 1,
      };
    });
  },

  selectSection: (id) => set({ selectedSectionId: id }),

  setSections: (sections) => {
    set((state) => {
      const nextHistory = state.history.slice(0, state.historyIndex + 1);
      nextHistory.push({
        sections,
        theme: state.theme,
        seo: state.seo,
        layoutName: state.layoutName,
        label: "Cập nhật bố cục thiết kế",
        timestamp: new Date().toLocaleTimeString("vi-VN")
      });

      return {
        sections,
        isDirty: true,
        history: nextHistory,
        historyIndex: nextHistory.length - 1,
      };
    });
  },

  updateTheme: (partial) => {
    set((state) => {
      const updatedTheme = { ...state.theme, ...partial };
      const nextHistory = state.history.slice(0, state.historyIndex + 1);
      nextHistory.push({
        sections: state.sections,
        theme: updatedTheme,
        seo: state.seo,
        layoutName: state.layoutName,
        label: `Cập nhật phong cách (${Object.keys(partial).join(", ")})`,
        timestamp: new Date().toLocaleTimeString("vi-VN")
      });

      return {
        theme: updatedTheme,
        isDirty: true,
        history: nextHistory,
        historyIndex: nextHistory.length - 1,
      };
    });
  },

  updateSEO: (partial) => {
    set((state) => {
      const updatedSEO = { ...state.seo, ...partial };
      const nextHistory = state.history.slice(0, state.historyIndex + 1);
      nextHistory.push({
        sections: state.sections,
        theme: state.theme,
        seo: updatedSEO,
        layoutName: state.layoutName,
        label: "Thay đổi thông tin SEO",
        timestamp: new Date().toLocaleTimeString("vi-VN")
      });

      return {
        seo: updatedSEO,
        isDirty: true,
        history: nextHistory,
        historyIndex: nextHistory.length - 1,
      };
    });
  },

  setLayoutName: (name) => {
    set((state) => {
      const nextHistory = state.history.slice(0, state.historyIndex + 1);
      nextHistory.push({
        sections: state.sections,
        theme: state.theme,
        seo: state.seo,
        layoutName: name,
        label: `Đổi tên thiết kế: "${name}"`,
        timestamp: new Date().toLocaleTimeString("vi-VN")
      });
      return {
        layoutName: name,
        isDirty: true,
        history: nextHistory,
        historyIndex: nextHistory.length - 1
      };
    });
  },

  setPreviewMode: (mode) => set({ previewMode: mode }),
  setPreviewOnly: (v) => set({ previewOnly: v, selectedSectionId: v ? null : get().selectedSectionId }),

  setSaving: (v) => set({ saving: v }),
  setGenerating: (v) => set({ generating: v }),
  markClean: () => set({ isDirty: false }),

  // History implementation
  undo: () => {
    const state = get();
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      const snapshot = state.history[newIndex];
      set({
        sections: snapshot.sections,
        theme: snapshot.theme,
        seo: snapshot.seo,
        layoutName: snapshot.layoutName,
        historyIndex: newIndex,
        isDirty: true,
      });
    }
  },

  redo: () => {
    const state = get();
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      const snapshot = state.history[newIndex];
      set({
        sections: snapshot.sections,
        theme: snapshot.theme,
        seo: snapshot.seo,
        layoutName: snapshot.layoutName,
        historyIndex: newIndex,
        isDirty: true,
      });
    }
  },

  commitHistorySnapshot: (label) => {
    set((state) => {
      const nextHistory = state.history.slice(0, state.historyIndex + 1);
      // Avoid duplicate consecutive identical snapshots
      const lastSnapshot = nextHistory[nextHistory.length - 1];
      if (
        lastSnapshot &&
        JSON.stringify(lastSnapshot.sections) === JSON.stringify(state.sections) &&
        JSON.stringify(lastSnapshot.theme) === JSON.stringify(state.theme) &&
        lastSnapshot.layoutName === state.layoutName
      ) {
        return {};
      }
      nextHistory.push({
        sections: state.sections,
        theme: state.theme,
        seo: state.seo,
        layoutName: state.layoutName,
        label,
        timestamp: new Date().toLocaleTimeString("vi-VN")
      });
      return {
        history: nextHistory,
        historyIndex: nextHistory.length - 1
      };
    });
  },

  jumpToHistory: (index) => {
    const state = get();
    if (index >= 0 && index < state.history.length) {
      const snapshot = state.history[index];
      set({
        sections: snapshot.sections,
        theme: snapshot.theme,
        seo: snapshot.seo,
        layoutName: snapshot.layoutName,
        historyIndex: index,
        isDirty: true,
      });
    }
  },

  applyTemplate: (sections, theme, seo, templateName) => {
    set((state) => {
      const nextHistory = state.history.slice(0, state.historyIndex + 1);
      nextHistory.push({
        sections,
        theme,
        seo,
        layoutName: state.layoutName,
        label: `Áp dụng Template: ${templateName}`,
        timestamp: new Date().toLocaleTimeString("vi-VN")
      });
      return {
        sections,
        theme,
        seo,
        isDirty: true,
        history: nextHistory,
        historyIndex: nextHistory.length - 1
      };
    });
  }
}));
