import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/components/providers";
import CommandPalette from "@/components/layout/CommandPalette";
import AIChatWidget from "@/components/features/AIChatWidget";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Portfolio OS — The Ultimate Developer Portfolio As A Service",
  description: "Transform your software projects, experiences, and accomplishments into isolated, multi-tenant interactive web spaces complete with AI assistance and analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-100 min-h-screen selection:bg-teal-500/30`}
      >
        <Providers>
          <CommandPalette />
          {children}
          <AIChatWidget />
        </Providers>
      </body>
    </html>
  );
}

