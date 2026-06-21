/* ──────────────────────────────────────────────
 *  Section registry — metadata, default props,
 *  and icons for each pre-built section type
 * ────────────────────────────────────────────── */

import type { SectionType } from "@/lib/types/layout";

export interface SectionMeta {
  type: SectionType;
  label: string;
  description: string;
  icon: string; // lucide icon name
  defaultProps: Record<string, unknown>;
  aiGeneratable: boolean;
}

export const SECTION_REGISTRY: SectionMeta[] = [
  {
    type: "header",
    label: "Header / Navigation",
    description: "Website header with logo, navigation links, and CTA",
    icon: "PanelTop",
    aiGeneratable: false,
    defaultProps: {
      businessName: "Restaurant Name",
      logoUrl: "",
      links: [
        { label: "Sản phẩm", href: "#products" },
        { label: "Quy trình", href: "#process" },
        { label: "Nhà hàng", href: "#restaurants" },
        { label: "Về chúng tôi", href: "#about" },
        { label: "Khách hàng", href: "#customers" },
        { label: "Liên hệ", href: "#contact" },
        { label: "Mạng xã hội", href: "#social" }
      ],
      ctaText: "Đặt Bàn Ngay",
      ctaLink: "#reservation"
    }
  },
  {
    type: "hero",
    label: "Hero Banner",
    description: "Full-width hero with background image, title, and call-to-action",
    icon: "Image",
    aiGeneratable: true,
    defaultProps: {
      title: "Welcome to Our Restaurant",
      subtitle: "Experience the finest cuisine in town",
      backgroundImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80",
      ctaText: "Reserve a Table",
      ctaLink: "#reservation",
      overlayOpacity: 0.5,
      logoUrl: "",
    },
  },
  {
    type: "stats",
    label: "Stats Bar",
    description: "Display numbers and statistics (e.g. happy customers, dishes, ratings)",
    icon: "BarChart3",
    aiGeneratable: true,
    defaultProps: {
      stats: [
        { value: "500+", label: "Khách hàng hằng ngày" },
        { value: "50+", label: "Món ăn đặc sắc" },
        { value: "10+", label: "Không gian sảnh" },
        { value: "4.8+", label: "Đánh giá sao" },
      ],
      backgroundColor: "#FF380B",
    },
  },
  {
    type: "info-cards",
    label: "Info Cards",
    description: "Display quick info cards (Address, Hours, Contact details)",
    icon: "LayoutGrid",
    aiGeneratable: true,
    defaultProps: {
      cards: [
        { icon: "MapPin", title: "Địa Chỉ", content: "123 Đường Hải Phòng, Hải Châu, Đà Nẵng" },
        { icon: "Clock", title: "Giờ Hoạt Động", content: "Hôm nay: 08:00 - 22:00" },
        { icon: "Phone", title: "Liên Hệ", content: "0905 123 456", sub: "contact@giadinhquan.vn" },
      ],
    },
  },
  {
    type: "menu-grid",
    label: "Menu Grid",
    description: "Display your menu categories and items in a grid layout",
    icon: "UtensilsCrossed",
    aiGeneratable: true,
    defaultProps: {
      title: "Our Menu",
      subtitle: "Discover our carefully crafted dishes",
      categories: [
        {
          name: "Appetizers",
          items: [
            { name: "Spring Rolls", description: "Crispy vegetable rolls", price: "85,000₫" },
            { name: "Bruschetta", description: "Toasted bread with tomato", price: "95,000₫" },
          ],
        },
        {
          name: "Main Course",
          items: [
            { name: "Grilled Salmon", description: "Fresh Atlantic salmon", price: "285,000₫" },
            { name: "Beef Steak", description: "Premium Wagyu steak", price: "450,000₫" },
          ],
        },
      ],
      layout: "grid",
      showPrices: true,
    },
  },
  {
    type: "menu-featured",
    label: "Featured Dishes",
    description: "Highlight your best-selling or seasonal dishes",
    icon: "Star",
    aiGeneratable: true,
    defaultProps: {
      title: "Chef's Specials",
      items: [
        { name: "Signature Phở", description: "Our award-winning traditional recipe", price: "120,000₫", badge: "Best Seller" },
        { name: "Seafood Platter", description: "Fresh catch of the day", price: "550,000₫", badge: "New" },
        { name: "Truffle Risotto", description: "Italian Arborio with black truffle", price: "320,000₫", badge: "Popular" },
      ],
    },
  },
  {
    type: "about",
    label: "About Us",
    description: "Tell your restaurant's story and values",
    icon: "BookOpen",
    aiGeneratable: true,
    defaultProps: {
      heading: "Our Story",
      story: "Founded with passion for authentic cuisine, we bring you the finest dining experience combining traditional recipes with modern techniques.",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
      values: [
        { icon: "🍽️", title: "Quality Ingredients", description: "Only the freshest, locally-sourced ingredients" },
        { icon: "👨‍🍳", title: "Expert Chefs", description: "Trained in world-renowned culinary schools" },
        { icon: "❤️", title: "Made with Love", description: "Every dish prepared with care and passion" },
      ],
    },
  },
  {
    type: "gallery",
    label: "Photo Gallery",
    description: "Showcase your restaurant ambiance and dishes",
    icon: "GalleryHorizontal",
    aiGeneratable: false,
    defaultProps: {
      title: "Gallery",
      images: [
        { src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80", alt: "Restaurant interior" },
        { src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", alt: "Signature dish" },
        { src: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80", alt: "Fresh ingredients" },
        { src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80", alt: "Dining area" },
        { src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80", alt: "Pizza" },
        { src: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80", alt: "Dessert" },
      ],
      layout: "grid",
      columns: 3,
    },
  },
  {
    type: "testimonials",
    label: "Testimonials",
    description: "Customer reviews and ratings",
    icon: "MessageSquareQuote",
    aiGeneratable: true,
    defaultProps: {
      title: "What Our Guests Say",
      reviews: [
        { name: "Nguyễn Văn A", rating: 5, text: "Amazing food and wonderful atmosphere! The staff was incredibly friendly." },
        { name: "Trần Thị B", rating: 5, text: "Best dining experience in the city. The chef's special was outstanding." },
        { name: "Lê Minh C", rating: 4, text: "Great location and delicious menu. Will definitely come back!" },
      ],
      showRating: true,
    },
  },
  {
    type: "reservation-cta",
    label: "Reservation CTA",
    description: "Call-to-action for table reservations",
    icon: "CalendarCheck",
    aiGeneratable: true,
    defaultProps: {
      title: "Reserve Your Table",
      description: "Book your dining experience today and enjoy our exclusive chef's menu",
      buttonText: "Make a Reservation",
      buttonLink: "/login?redirect=/customer",
      backgroundImage: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920&q=80",
    },
  },
  {
    type: "opening-hours",
    label: "Opening Hours",
    description: "Display your business hours",
    icon: "Clock",
    aiGeneratable: true,
    defaultProps: {
      title: "Opening Hours",
      hours: [
        { day: "Monday", open: "09:00", close: "22:00", closed: false },
        { day: "Tuesday", open: "09:00", close: "22:00", closed: false },
        { day: "Wednesday", open: "09:00", close: "22:00", closed: false },
        { day: "Thursday", open: "09:00", close: "22:00", closed: false },
        { day: "Friday", open: "09:00", close: "23:00", closed: false },
        { day: "Saturday", open: "10:00", close: "23:00", closed: false },
        { day: "Sunday", open: "10:00", close: "21:00", closed: false },
      ],
      note: "Kitchen closes 30 minutes before closing time",
    },
  },
  {
    type: "location-map",
    label: "Location & Map",
    description: "Show your address and map",
    icon: "MapPin",
    aiGeneratable: true,
    defaultProps: {
      title: "Find Us",
      address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      phone: "0123 456 789",
      email: "info@restaurant.com",
      mapEmbedUrl: "",
    },
  },
  {
    type: "contact",
    label: "Contact Form",
    description: "A contact form for inquiries",
    icon: "Mail",
    aiGeneratable: false,
    defaultProps: {
      title: "Get in Touch",
      subtitle: "Have a question or want to make a special request?",
      fields: [
        { label: "Name", type: "text", required: true },
        { label: "Email", type: "email", required: true },
        { label: "Phone", type: "tel", required: false },
        { label: "Message", type: "textarea", required: true },
      ],
      submitText: "Send Message",
    },
  },
  {
    type: "footer",
    label: "Footer",
    description: "Site footer with links and social media",
    icon: "PanelBottom",
    aiGeneratable: true,
    defaultProps: {
      businessName: "Restaurant Name",
      description: "Experience the finest dining in the heart of the city.",
      links: [
        { label: "Menu", href: "#menu" },
        { label: "About", href: "#about" },
        { label: "Reservations", href: "#reservation" },
        { label: "Contact", href: "#contact" },
      ],
      socialMedia: [
        { platform: "facebook", url: "#" },
        { platform: "instagram", url: "#" },
      ],
      copyright: `© ${new Date().getFullYear()} Restaurant Name. All rights reserved.`,
    },
  },
];

export function getSectionMeta(type: SectionType): SectionMeta | undefined {
  return SECTION_REGISTRY.find((s) => s.type === type);
}

export function getDefaultProps(type: SectionType): Record<string, unknown> {
  const defaults = getSectionMeta(type)?.defaultProps ?? {};
  return { animation: "none", ...defaults };
}
