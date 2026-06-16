/* ──────────────────────────────────────────────
 *  AI Service — Google Gemini integration
 *  for generating restaurant layouts & content
 * ────────────────────────────────────────────── */

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIGenerateRequest } from "@/lib/types/ai";
import type { RestaurantLayout, SectionConfig } from "@/lib/types/layout";
import { SECTION_REGISTRY } from "@/lib/sections/registry";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

function generateId(): string {
  return `sec_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

const SYSTEM_PROMPT = `You are an expert restaurant web designer AI. Your job is to generate a complete layout configuration (JSON) for a restaurant landing page.

Available section types and their prop schemas:

1. "hero" — props: { title: string, subtitle: string, backgroundImage: string (unsplash URL), ctaText: string, ctaLink: string, overlayOpacity: number (0-1) }
2. "menu-grid" — props: { title: string, subtitle: string, categories: [{ name: string, items: [{ name: string, description: string, price: string, badge?: string }] }], layout: "grid"|"list", showPrices: boolean }
3. "menu-featured" — props: { title: string, items: [{ name: string, description: string, price: string, badge?: string }] }
4. "about" — props: { heading: string, story: string, image: string (unsplash URL), values: [{ icon: string (emoji), title: string, description: string }] }
5. "gallery" — props: { title: string, images: [{ src: string (unsplash URL with food/restaurant), alt: string }], layout: "grid"|"masonry"|"carousel", columns: number }
6. "testimonials" — props: { title: string, reviews: [{ name: string, rating: number (1-5), text: string }], showRating: boolean }
7. "reservation-cta" — props: { title: string, description: string, buttonText: string, buttonLink: string, backgroundImage?: string }
8. "opening-hours" — props: { title: string, hours: [{ day: string, open: string (HH:mm), close: string (HH:mm), closed: boolean }], note?: string }
9. "location-map" — props: { title: string, address: string, phone: string, email: string }
10. "contact" — props: { title: string, subtitle: string, fields: [{ label: string, type: "text"|"email"|"tel"|"textarea", required: boolean }], submitText: string }
11. "footer" — props: { businessName: string, description: string, links: [{ label: string, href: string }], socialMedia: [{ platform: string, url: string }], copyright: string }

Rules:
- Generate content in the SAME LANGUAGE as the user's prompt (Vietnamese if prompt is in Vietnamese, English if in English)
- Use real Unsplash image URLs (format: https://images.unsplash.com/photo-XXXXX?w=WIDTH&q=80)
- Tailor all content to the restaurant's cuisine, style, and brand
- If tenant data includes menu items, use them
- If tenant data includes business hours, use them
- Include at least these sections in order: hero, menu (grid or featured), about, gallery, reservation-cta, opening-hours, location-map, footer
- Make content feel premium and authentic, not generic
- Prices should be in VND (₫) format unless specified otherwise
- Return ONLY valid JSON, no markdown code blocks, no explanation`;

export async function generateFullLayout(
  request: AIGenerateRequest,
  tenantId: string,
  tenantHostname: string,
): Promise<RestaurantLayout> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const tenantContext = request.tenantData
    ? `
Restaurant Business Data:
- Name: ${request.tenantData.businessName || "Unknown"}
- About: ${request.tenantData.aboutUs || "Not provided"}
- Address: ${request.tenantData.address || "Not provided"}
- Phone: ${request.tenantData.phone || "Not provided"}
- Email: ${request.tenantData.email || "Not provided"}
- Primary Color: ${request.tenantData.primaryColor || "#FF380B"}
${request.tenantData.openingHours ? `- Opening Hours: ${JSON.stringify(request.tenantData.openingHours)}` : ""}
${request.tenantData.menuCategories ? `- Menu: ${JSON.stringify(request.tenantData.menuCategories)}` : ""}
`
    : "";

  const styleContext = request.style
    ? `
Style Preferences:
- Mood: ${request.style.mood || "modern"}
- Color Scheme: ${request.style.colorScheme || "Use tenant primary color"}
- Font: ${request.style.fontPreference || "sans-serif"}
`
    : "";

  const userPrompt = `${SYSTEM_PROMPT}

${tenantContext}
${styleContext}

User's request: "${request.prompt}"

Generate a complete layout JSON with the following structure:
{
  "sections": [array of section objects with { "type": string, "visible": true, "props": { ... } }],
  "theme": { "primaryColor": string, "fontFamily": string, "mode": "dark"|"light"|"auto", "borderRadius": "sharp"|"rounded"|"pill" },
  "seo": { "title": string, "description": string }
}`;

  const result = await model.generateContent(userPrompt);
  const text = result.response.text();

  // Parse JSON — strip markdown fences if present
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const parsed = JSON.parse(cleaned);

  // Normalize sections with IDs and order
  const sections: SectionConfig[] = (parsed.sections || []).map(
    (s: { type: string; visible?: boolean; props?: Record<string, unknown> }, i: number) => ({
      id: generateId(),
      type: s.type,
      visible: s.visible !== false,
      order: i,
      props: s.props || {},
    })
  );

  const now = new Date().toISOString();

  return {
    tenantId,
    tenantHostname,
    name: `AI Generated — ${request.prompt.slice(0, 50)}`,
    status: "draft",
    version: 1,
    theme: parsed.theme || {
      primaryColor: request.tenantData?.primaryColor || "#FF380B",
      fontFamily: "Inter, sans-serif",
      mode: "dark",
      borderRadius: "rounded",
    },
    sections,
    seo: parsed.seo || {
      title: request.tenantData?.businessName || "Restaurant",
      description: request.prompt.slice(0, 160),
    },
    publishedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

export async function generateSectionContent(
  sectionType: string,
  context: { businessName?: string; cuisine?: string; description?: string },
  currentProps?: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const meta = SECTION_REGISTRY.find((s) => s.type === sectionType);
  if (!meta) throw new Error(`Unknown section type: ${sectionType}`);

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `You are a restaurant web copywriter. Generate content for a "${meta.label}" section.

Restaurant context:
- Name: ${context.businessName || "Restaurant"}
- Cuisine: ${context.cuisine || "International"}
- Description: ${context.description || "A premium dining experience"}

${currentProps ? `Current content (improve it): ${JSON.stringify(currentProps)}` : ""}

Return ONLY valid JSON matching this prop schema:
${JSON.stringify(meta.defaultProps, null, 2)}

Make the content feel premium, authentic, and specific to this restaurant. Use Vietnamese language. Return ONLY JSON, no markdown.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  return JSON.parse(cleaned);
}
