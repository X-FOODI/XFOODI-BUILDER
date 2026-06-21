/* ── AI Section Content Generation API ── */
import { NextResponse } from "next/server";
import { generateSectionContent, editSectionWithAI } from "@/lib/services/ai.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sectionType, context, currentProps, instruction } = body;

    if (!sectionType) {
      return NextResponse.json({ error: "sectionType is required" }, { status: 400 });
    }

    let props;
    if (instruction) {
      props = await editSectionWithAI(sectionType, instruction, currentProps || {});
    } else {
      props = await generateSectionContent(sectionType, context || {}, currentProps);
    }

    return NextResponse.json({ success: true, props });
  } catch (error: unknown) {
    console.error("[AI Content] Error:", error);
    const message = error instanceof Error ? error.message : "AI content generation failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
