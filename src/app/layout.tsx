import type { Metadata, Viewport } from "next";
import { Manrope, DM_Sans, JetBrains_Mono } from "next/font/google";
import { MotionProvider } from "@/components/site/motion-provider";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ArkaShine · Healthy Soils. Brighter Tomorrows.",
  description:
    "ArkaShine designs and manufactures soil intelligence devices. SoiLenz 2.0: 12 nutrients plus pH & EC, built-in printer, Bluetooth app.",
  openGraph: {
    type: "website",
    siteName: "ArkaShine Innovations",
    title: "ArkaShine · Soil Intelligence Devices Made in India",
    description: "Engineered in India. Built for the field. Trusted by farmers.",
  },
};

export const viewport: Viewport = {
  themeColor: "#071712",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${manrope.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-forest-deep text-ivory font-sans">
        <a
          href="#main-content"
          className="sr-only z-[100] rounded-full bg-[#1E7A33] px-5 py-2.5 text-[#fff] font-medium focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to main content
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
