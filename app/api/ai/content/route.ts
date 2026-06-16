/* ── AI Section Content Generation API ── */
import { NextResponse } from "next/server";
import { generateSectionContent } from "@/lib/services/ai.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sectionType, context, currentProps } = body;

    if (!sectionType) {
      return NextResponse.json({ error: "sectionType is required" }, { status: 400 });
    }

    const props = await generateSectionContent(sectionType, context || {}, currentProps);

    return NextResponse.json({ success: true, props });
  } catch (error: unknown) {
    console.error("[AI Content] Error:", error);
    const message = error instanceof Error ? error.message : "AI content generation failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
