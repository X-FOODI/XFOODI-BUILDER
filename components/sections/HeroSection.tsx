"use client";

import type { HeroProps } from "@/lib/types/layout";

export default function HeroSection({ props }: { props: Record<string, unknown> }) {
  const p = props as unknown as HeroProps & { logoUrl?: string };

  const hasLogo = !!p.logoUrl;

  return (
    <div
      className="relative flex items-center min-h-[500px] py-16 px-6 md:px-12"
      style={{
        backgroundImage: `url(${p.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, rgba(0,0,0,${(p.overlayOpacity || 0.5) * 1.3}) 0%, rgba(0,0,0,${p.overlayOpacity || 0.5}) 100%)` }}
      />
      
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        {hasLogo ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-left space-y-6">
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight m-0"
                style={{ color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
              >
                {p.title}
              </h1>
              <p
                className="text-lg md:text-xl m-0 leading-relaxed"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                {p.subtitle}
              </p>
              {p.ctaText && (
                <div className="pt-2">
                  <a
                    href={p.ctaLink || "#"}
                    className="transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    style={{
                      background: "var(--primary, #FF380B)",
                      color: "#fff",
                      boxShadow: "0 8px 24px rgba(255,56,11,0.35)",
                      textDecoration: "none",
                      padding: "14px 32px",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      display: "inline-block"
                    }}
                  >
                    {p.ctaText}
                  </a>
                </div>
              )}
            </div>

            {/* Right Logo Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                className="flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-105"
                style={{
                  width: 240,
                  height: 240,
                  borderRadius: "24%",
                  background: "rgba(255,255,255,0.1)",
                  border: "3px solid rgba(255,255,255,0.2)",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 20px 48px rgba(0,0,0,0.3)",
                }}
              >
                <img
                  src={p.logoUrl}
                  alt={p.title}
                  className="w-[88%] h-[88%] object-contain"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Standard Centered Layout */
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight m-0"
              style={{ color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
            >
              {p.title}
            </h1>
            <p
              className="text-lg md:text-xl m-0 leading-relaxed"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              {p.subtitle}
            </p>
            {p.ctaText && (
              <div className="pt-2">
                <a
                  href={p.ctaLink || "#"}
                  className="transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  style={{
                    background: "var(--primary, #FF380B)",
                    color: "#fff",
                    boxShadow: "0 8px 24px rgba(255,56,11,0.35)",
                    textDecoration: "none",
                    padding: "14px 32px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    display: "inline-block"
                  }}
                >
                  {p.ctaText}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
