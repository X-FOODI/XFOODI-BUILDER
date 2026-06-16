import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "XFoodi Builder — AI Restaurant Storefront Generator",
  description:
    "Create beautiful restaurant landing pages with AI-powered content generation and drag-and-drop sections.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
