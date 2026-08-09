import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Young Lions League",
    template: "%s | Young Lions League",
  },
  description: "Young Lions Sports Club Oddamavadi league management system.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={oswald.variable}>
      <body>{children}</body>
    </html>
  );
}
