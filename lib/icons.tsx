import React from "react";
import * as Icons from "lucide-react";

// Map common emojis to Lucide icon names
const EMOJI_TO_LUCIDE_MAP: Record<string, string> = {
  // Flag emojis
  "🇻🇳": "Soup",
  "🇯🇵": "Fish",
  "🇮🇹": "Pizza",
  "🇰🇷": "Flame",
  "🇨🇳": "Soup",
  "🇹🇭": "Flame",
  "🇫🇷": "Wine",
  "🇺🇸": "Utensils",
  "🌎": "Globe",
  "🦐": "Fish",
  "🔥": "Flame",
  "🥬": "Leaf",
  "☕": "Coffee",
  "🦞": "Fish",
  
  // Value emojis
  "🐟": "Fish",
  "🔪": "ChefHat",
  "🥩": "Utensils",
  "🍲": "Soup",
  "🍷": "Wine",
  "🍝": "Soup",
  "🌊": "Waves",
  "🏆": "Trophy",
  "🥩 ": "Utensils",
  
  // Atmosphere/Price emojis
  "💰": "Coins",
  "💰💰": "Coins",
  "💰💰💰": "Coins",
  "💎": "Gem",
  "✨": "Sparkles",
  "🏛️": "Landmark",
  "🕯️": "Flame",
  "🎉": "PartyPopper",
  
  // Tabs & panels
  "📦": "Layers",
  "🎨": "Palette",
  "🏗️": "LayoutGrid",
};

type LucideIconComponent = React.ComponentType<{
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}>;

export function getIconComponent(iconNameOrEmoji: string): LucideIconComponent {
  const name = EMOJI_TO_LUCIDE_MAP[iconNameOrEmoji] || iconNameOrEmoji;
  
  // Clean up name to match Lucide exports (CamelCase)
  const formattedName = name
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  const IconsRecord = Icons as unknown as Record<string, LucideIconComponent>;
  const IconComp = IconsRecord[formattedName] || IconsRecord[name];
  
  if (IconComp) return IconComp;
  
  // Fallbacks
  if (name.toLowerCase().includes("map") || name.toLowerCase().includes("pin")) return Icons.MapPin;
  if (name.toLowerCase().includes("phone")) return Icons.Phone;
  if (name.toLowerCase().includes("mail") || name.toLowerCase().includes("email")) return Icons.Mail;
  if (name.toLowerCase().includes("clock") || name.toLowerCase().includes("time")) return Icons.Clock;
  if (name.toLowerCase().includes("utensil") || name.toLowerCase().includes("dish") || name.toLowerCase().includes("food")) return Icons.UtensilsCrossed;
  
  return Icons.Sparkles; // ultimate fallback
}

interface IconRendererProps extends React.ComponentPropsWithoutRef<"svg"> {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function IconRenderer({ name, size = 20, className, style, ...props }: IconRendererProps) {
  const IconComp = getIconComponent(name);
  return React.createElement(IconComp, { size, className, style, ...props });
}
