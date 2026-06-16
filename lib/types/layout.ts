/* ──────────────────────────────────────────────
 *  Layout & Section type definitions
 *  for the XFoodi AI Builder
 * ────────────────────────────────────────────── */

export type SectionType =
  | "header"
  | "hero"
  | "stats"
  | "info-cards"
  | "menu-grid"
  | "menu-featured"
  | "about"
  | "gallery"
  | "testimonials"
  | "reservation-cta"
  | "opening-hours"
  | "location-map"
  | "contact"
  | "footer";

export interface SectionConfig {
  id: string;
  type: SectionType;
  visible: boolean;
  order: number;
  props: Record<string, unknown>;
}

export interface LayoutTheme {
  primaryColor: string;
  fontFamily: string;
  mode: "light" | "dark" | "auto";
  borderRadius: "sharp" | "rounded" | "pill";
  pageAnimation?: "none" | "fadeIn" | "slideUp" | "slideLeft";
}

export interface LayoutSEO {
  title: string;
  description: string;
  ogImage?: string;
}

export interface RestaurantLayout {
  _id?: string;
  tenantId: string;
  tenantHostname: string;
  name: string;
  status: "draft" | "published";
  version: number;
  theme: LayoutTheme;
  sections: SectionConfig[];
  seo: LayoutSEO;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/* ── Default props per section type ── */

export interface HeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
  overlayOpacity: number;
}

export interface MenuGridProps {
  title: string;
  subtitle: string;
  categories: { name: string; items: MenuItem[] }[];
  layout: "grid" | "list";
  showPrices: boolean;
}

export interface MenuItem {
  name: string;
  description: string;
  price: string;
  image?: string;
  badge?: string;
}

export interface MenuFeaturedProps {
  title: string;
  items: MenuItem[];
}

export interface AboutProps {
  heading: string;
  story: string;
  image: string;
  values: { icon: string; title: string; description: string }[];
}

export interface GalleryProps {
  title: string;
  images: { src: string; alt: string }[];
  layout: "masonry" | "grid" | "carousel";
  columns: number;
}

export interface TestimonialItem {
  name: string;
  avatar?: string;
  rating: number;
  text: string;
  date?: string;
}

export interface TestimonialsProps {
  title: string;
  reviews: TestimonialItem[];
  showRating: boolean;
}

export interface ReservationCTAProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage?: string;
}

export interface OpeningHoursProps {
  title: string;
  hours: { day: string; open: string; close: string; closed: boolean }[];
  note?: string;
}

export interface LocationMapProps {
  title: string;
  address: string;
  phone: string;
  email: string;
  mapEmbedUrl?: string;
  coordinates?: { lat: number; lng: number };
}

export interface ContactProps {
  title: string;
  subtitle: string;
  fields: { label: string; type: string; required: boolean }[];
  submitText: string;
}

export interface FooterProps {
  businessName: string;
  description: string;
  links: { label: string; href: string }[];
  socialMedia: { platform: string; url: string }[];
  copyright: string;
}

export interface StatsProps {
  stats: { value: string; label: string }[];
  backgroundColor?: string;
}

export interface InfoCardsProps {
  cards: { icon: string; title: string; content: string; sub?: string }[];
}

export interface HeaderProps {
  businessName: string;
  logoUrl?: string;
  links: { label: string; href: string }[];
  ctaText: string;
  ctaLink: string;
}
