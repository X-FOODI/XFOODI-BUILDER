/* ── Layout CRUD API ── */
import { NextResponse } from "next/server";
import { getLayoutsByTenant, createLayout } from "@/lib/services/layout.service";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get("tenantId");

  if (!tenantId) {
    return NextResponse.json({ error: "tenantId is required" }, { status: 400 });
  }

  try {
    const layouts = await getLayoutsByTenant(tenantId);
    return NextResponse.json(layouts);
  } catch (error) {
    console.error("Failed to fetch layouts due to database/network error:", error);
    return NextResponse.json([]);
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.tenantId) {
      return NextResponse.json({ error: "tenantId is required" }, { status: 400 });
    }

    const id = await createLayout(body);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error: unknown) {
    console.error("Failed to create layout due to error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
