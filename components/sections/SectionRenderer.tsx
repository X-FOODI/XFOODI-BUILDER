"use client";

import { useEffect, useRef, useState } from "react";
import type { SectionConfig } from "@/lib/types/layout";
import HeaderSection from "./HeaderSection";
import HeroSection from "./HeroSection";
import StatsSection from "./StatsSection";
import InfoCardsSection from "./InfoCardsSection";
import MenuGridSection from "./MenuGridSection";
import MenuFeaturedSection from "./MenuFeaturedSection";
import AboutSection from "./AboutSection";
import GallerySection from "./GallerySection";
import TestimonialsSection from "./TestimonialsSection";
import ReservationCTASection from "./ReservationCTASection";
import OpeningHoursSection from "./OpeningHoursSection";
import LocationMapSection from "./LocationMapSection";
import ContactSection from "./ContactSection";
import FooterSection from "./FooterSection";

interface Props {
  section: SectionConfig;
  pageAnimation?: string;
  previewOnly?: boolean;
}

const SECTION_MAP: Record<string, React.ComponentType<{ props: Record<string, unknown> }>> = {
  header: HeaderSection,
  hero: HeroSection,
  stats: StatsSection,
  "info-cards": InfoCardsSection,
  "menu-grid": MenuGridSection,
  "menu-featured": MenuFeaturedSection,
  about: AboutSection,
  gallery: GallerySection,
  testimonials: TestimonialsSection,
  "reservation-cta": ReservationCTASection,
  "opening-hours": OpeningHoursSection,
  "location-map": LocationMapSection,
  contact: ContactSection,
  footer: FooterSection,
};

export default function SectionRenderer({ section, pageAnimation = "none", previewOnly = false }: Props) {
  const Component = SECTION_MAP[section.type];

  const sectionAnimation = (section.props?.animation as string) || "none";
  const animation = sectionAnimation !== "none" ? sectionAnimation : pageAnimation;

  // In the editor canvas, animate immediately so the designer sees it right away.
  // In preview/live mode, wait until the section actually scrolls into view.
  const [inView, setInView] = useState(!previewOnly);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!previewOnly || animation === "none") return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [previewOnly, animation]);

  if (!Component) {
    return (
      <div className="p-8 text-center" style={{ background: "var(--bg-elevated)" }}>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Unknown section type: <code>{section.type}</code>
        </p>
      </div>
    );
  }

  // Dynamic inline styles for animation preview
  const animationStyle: React.CSSProperties = {};
  if (animation !== "none" && inView) {
    const duration = "0.8s";
    const fillMode = "both";
    if (animation === "fadeIn") {
      animationStyle.animation = `aiFadeIn ${duration} ease-out ${fillMode}`;
    } else if (animation === "slideUp") {
      animationStyle.animation = `aiSlideUp ${duration} cubic-bezier(0.16, 1, 0.3, 1) ${fillMode}`;
    } else if (animation === "slideLeft") {
      animationStyle.animation = `aiSlideLeft ${duration} cubic-bezier(0.16, 1, 0.3, 1) ${fillMode}`;
    }
  } else if (animation !== "none" && !inView) {
    // Hold the section in its pre-animation state until it scrolls into view
    animationStyle.opacity = 0;
  }

  const keyframesStyle = `
    @keyframes aiFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes aiSlideUp {
      from { opacity: 0; transform: translateY(45px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes aiSlideLeft {
      from { opacity: 0; transform: translateX(45px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `;

  return (
    <>
      <style>{keyframesStyle}</style>
      <div ref={ref} style={{ width: "100%", ...animationStyle }}>
        <Component props={section.props} />
      </div>
    </>
  );
}
