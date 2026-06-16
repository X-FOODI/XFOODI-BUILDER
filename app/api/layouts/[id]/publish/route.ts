/* ── Publish Layout API ── */
import { NextResponse } from "next/server";
import { publishLayout } from "@/lib/services/layout.service";export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const success = await publishLayout(id);

    if (!success) {
      return NextResponse.json({ error: "Layout not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Layout published" });
  } catch (error: unknown) {
    console.error("Failed to publish layout due to error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
