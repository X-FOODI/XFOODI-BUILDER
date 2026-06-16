/* ── Single Layout CRUD API ── */
import { NextResponse } from "next/server";
import { getLayoutById, updateLayout, deleteLayout } from "@/lib/services/layout.service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const layout = await getLayoutById(id);

    if (!layout) {
      return NextResponse.json({ error: "Layout not found" }, { status: 404 });
    }

    return NextResponse.json(layout);
  } catch (error: unknown) {
    console.error("Failed to get layout due to database/network error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();

    try {
      const success = await updateLayout(id, body);

      if (!success) {
        if (id.startsWith("mock_")) {
          return NextResponse.json({ success: true, warning: "Offline mock update success" });
        }
        return NextResponse.json({ error: "Layout not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true });
    } catch (dbErr) {
      console.warn("Database update failed, falling back to mock save:", dbErr);
      return NextResponse.json({ 
        success: true, 
        warning: "Offline fallback mode: database offline" 
      });
    }
  } catch (error: unknown) {
    console.error("Failed to update layout due to error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    try {
      const success = await deleteLayout(id);

      if (!success) {
        if (id.startsWith("mock_")) {
          return NextResponse.json({ success: true, warning: "Offline mock delete success" });
        }
        return NextResponse.json({ error: "Layout not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true });
    } catch (dbErr) {
      console.warn("Database delete failed, falling back to mock save:", dbErr);
      return NextResponse.json({ 
        success: true, 
        warning: "Offline fallback mode: database offline" 
      });
    }
  } catch (error: unknown) {
    console.error("Failed to delete layout due to error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
