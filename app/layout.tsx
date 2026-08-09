import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/Toast";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Young Lions League",
    default: "Young Lions League — Oddamavadi",
  },
  description:
    "Official Football League Management & Match Scheduling System for Young Lions Sports Club Oddamavadi.",
  keywords: ["football", "league", "young lions", "oddamavadi", "sports"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)] font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
