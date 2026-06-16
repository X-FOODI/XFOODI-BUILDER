/* ──────────────────────────────────────────────
 *  AI Generation request / response types
 * ────────────────────────────────────────────── */

export interface AIGenerateRequest {
  /** Free-text prompt describing the restaurant style */
  prompt: string;

  /** Tenant business data (auto-fetched from XFoodi API) */
  tenantData?: {
    businessName?: string;
    aboutUs?: string;
    address?: string;
    phone?: string;
    email?: string;
    primaryColor?: string;
    openingHours?: { day: string; open: string; close: string; closed: boolean }[];
    menuCategories?: {
      name: string;
      items: { name: string; description: string; price: string; image?: string }[];
    }[];
  };

  /** Style preferences */
  style?: {
    mood?: "modern" | "classic" | "cozy" | "elegant" | "street-food" | "luxury";
    colorScheme?: string;
    fontPreference?: "sans-serif" | "serif" | "display";
  };
}

export interface AIGenerateResponse {
  success: boolean;
  layout?: import("./layout").RestaurantLayout;
  error?: string;
}

export interface AIContentRequest {
  sectionType: string;
  context: {
    businessName?: string;
    cuisine?: string;
    description?: string;
  };
  currentProps?: Record<string, unknown>;
}

export interface AIContentResponse {
  success: boolean;
  props?: Record<string, unknown>;
  error?: string;
}
