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

    const success = await updateLayout(id, body);

    if (!success) {
      return NextResponse.json({ error: "Layout not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
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

    const success = await deleteLayout(id);

    if (!success) {
      return NextResponse.json({ error: "Layout not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Failed to delete layout due to error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
