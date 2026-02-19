import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlassSidebar } from "@/components/glass-sidebar";
import { GlassNavbar } from "@/components/glass-navbar";
import { HeroBackground } from "@/components/hero-background";
import { QuickActionMenu } from "@/components/quick-action-menu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DAM | Digital Asset Manager",
  description: "Next Generation Liquid Glassmorphism Asset Management",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans selection:bg-primary/30`}>
        <div className="flex min-h-screen text-foreground overflow-x-hidden">
          <HeroBackground />

          <GlassSidebar />

          <div className="flex-1 flex flex-col relative z-10">
            <GlassNavbar />
            <main className="flex-1 p-4 md:p-8">
              {children}
            </main>
          </div>
          <QuickActionMenu />
        </div>
      </body>
    </html>
  );
}
