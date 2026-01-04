import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google"; // Persian Font
import "./globals.css";
import ThemeWrapper from "@/components/layout/ThemeWrapper";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  title: "ترک عادت | مسیر سلامتی",
  description: "اپلیکیشن هوشمند ترک عادت با کمک هوش مصنوعی",
  keywords: ["Habit Tracker", "ترک عادت", "سلامتی", "هوش مصنوعی"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={`${vazirmatn.variable} font-sans antialiased`}
      >
        <ThemeWrapper>
          {children}
        </ThemeWrapper>
      </body>
    </html>
  );
}
