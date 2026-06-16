"use client";

import { useEditorStore } from "@/lib/store/editor-store";
import { History, Clock, ArrowLeft, ArrowRight, RotateCcw, AlertTriangle } from "lucide-react";

export default function HistoryPanel() {
  const { history, historyIndex, jumpToHistory, undo, redo } = useEditorStore();

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div className="p-4 select-none h-full flex flex-col">
      {/* Header */}
      <div className="mb-4 shrink-0">
        <h3 className="text-sm font-bold text-white flex items-center gap-1.5 mb-1">
          <History size={16} className="text-gray-400" />
          Lịch Sử Chỉnh Sửa
        </h3>
        <p className="text-xs text-gray-400">Xem và khôi phục lại bất kỳ thời điểm chỉnh sửa nào trong phiên thiết kế</p>
      </div>

      {/* Undo/Redo Buttons */}
      <div className="flex gap-2 mb-4 shrink-0">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="flex-1 py-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          style={{
            background: "rgba(255,255,255,0.02)",
            borderColor: "rgba(255,255,255,0.08)",
            color: canUndo ? "#fff" : "var(--text-muted)",
            opacity: canUndo ? 1 : 0.4,
            cursor: canUndo ? "pointer" : "not-allowed"
          }}
        >
          <RotateCcw size={13} />
          Hoàn tác
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="flex-1 py-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          style={{
            background: "rgba(255,255,255,0.02)",
            borderColor: "rgba(255,255,255,0.08)",
            color: canRedo ? "#fff" : "var(--text-muted)",
            opacity: canRedo ? 1 : 0.4,
            cursor: canRedo ? "pointer" : "not-allowed"
          }}
        >
          Tiếp tục
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Timeline Scroll List */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 max-h-[380px]">
        {history.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-500">
            Không có lịch sử chỉnh sửa nào được ghi nhận.
          </div>
        ) : (
          history.map((snapshot, index) => {
            const isCurrent = index === historyIndex;
            const isFuture = index > historyIndex;

            return (
              <div
                key={index}
                onClick={() => jumpToHistory(index)}
                className="relative pl-6 py-1 cursor-pointer group"
              >
                {/* Timeline vertical bar */}
                {index < history.length - 1 && (
                  <div
                    className="absolute left-[7px] top-4 bottom-0 w-[2px]"
                    style={{
                      background: isFuture ? "rgba(255,255,255,0.05)" : "var(--primary-light, rgba(255, 56, 11, 0.15))",
                    }}
                  />
                )}

                {/* Timeline Dot Indicator */}
                <div
                  className="absolute left-0 top-2.5 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                  style={{
                    background: isCurrent ? "var(--primary)" : isFuture ? "#1E293B" : "rgba(255,56,11,0.2)",
                    borderColor: isCurrent ? "var(--primary)" : isFuture ? "rgba(255,255,255,0.1)" : "var(--primary)",
                    boxShadow: isCurrent ? "0 0 8px var(--primary)" : "none",
                  }}
                />

                {/* Content Card */}
                <div
                  className="p-3 rounded-lg border transition-all duration-200"
                  style={{
                    background: isCurrent ? "rgba(255, 56, 11, 0.04)" : "rgba(255, 255, 255, 0.01)",
                    borderColor: isCurrent ? "var(--primary)" : "rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-xs font-bold transition-colors"
                      style={{
                        color: isCurrent ? "#fff" : isFuture ? "var(--text-muted)" : "gray",
                      }}
                    >
                      {snapshot.label}
                    </span>
                    <span className="text-[9px] text-gray-600 flex items-center gap-0.5 shrink-0">
                      <Clock size={9} />
                      {snapshot.timestamp}
                    </span>
                  </div>
                  <div className="text-[9px] text-gray-500 mt-1 flex items-center gap-2">
                    <span>{snapshot.sections.length} sections</span>
                    <span>•</span>
                    <span className="capitalize">{snapshot.theme.mode} theme</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Notice info */}
      <div 
        className="mt-4 p-3 rounded-lg border shrink-0 flex gap-2"
        style={{
          background: "rgba(245, 158, 11, 0.02)",
          borderColor: "rgba(245, 158, 11, 0.1)",
        }}
      >
        <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
        <span className="text-[10px] text-amber-500/80 leading-relaxed">
          Chú ý: Các chỉnh sửa mới khi ở trạng thái cũ trong lịch sử sẽ ghi đè lên các trạng thái phía sau.
        </span>
      </div>
    </div>
  );
}
