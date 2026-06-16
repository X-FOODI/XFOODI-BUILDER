/* ── AI Full Layout Generation API ── */
import { NextResponse } from "next/server";
import { generateFullLayout } from "@/lib/services/ai.service";
import type { AIGenerateRequest } from "@/lib/types/ai";

export async function POST(req: Request) {
  try {
    const body: AIGenerateRequest & { tenantId: string; tenantHostname: string } =
      await req.json();

    if (!body.prompt) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    const layout = await generateFullLayout(
      body,
      body.tenantId || "demo",
      body.tenantHostname || "demo.xfoodi.website",
    );

    return NextResponse.json({ success: true, layout });
  } catch (error: unknown) {
    console.error("[AI Generate] Error:", error);
    const message = error instanceof Error ? error.message : "AI generation failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
