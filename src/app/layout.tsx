// src/app/layout.tsx

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css"; 
import { cn } from "@/lib/utils";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/components/providers/ThemeProvider"; // <-- 1. IMPORT

export const metadata = {
  title: "The Guild",
  description: "An Operating System for a Post-Job Economy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      <head />
      <body>
        {/* 2. WRAP everything in the ThemeProvider */}
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <div className="flex-1">{children}</div>
            </div>
          </AuthProvider>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}