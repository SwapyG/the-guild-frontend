// src/app/layout.tsx (Corrected with Explicit Favicon Links)

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css"; 
import { cn } from "@/lib/utils";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer"; 
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AnimatedBackground } from "@/components/layout/AnimatedBackground";
import { CustomCursor } from "@/components/layout/CustomCursor";

export const metadata = {
  title: "The Guild™",
  description: "An Operating System for a Post-Job Economy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      {/* --- NANO: EXPLICIT FAVICON LINKS DEPLOYED --- */}
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      {/* ------------------------------------------- */}
      <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <AnimatedBackground />
          <AuthProvider>
            <CustomCursor />
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </AuthProvider>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}