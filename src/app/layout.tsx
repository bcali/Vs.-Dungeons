import type { Metadata, Viewport } from "next";
import { Press_Start_2P, Exo_2 } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "../globals.css";

const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  weight: "400",
  subsets: ["latin"],
});

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vs. Dungeons — Digital GM Toolkit",
  description: "Tablet-optimized RPG toolkit for Vs. Dungeons tabletop sessions",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Vs. Dungeons",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0d0221",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${pressStart.variable} ${exo2.variable} antialiased bg-bg-page text-text-primary min-h-screen`}
      >
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
