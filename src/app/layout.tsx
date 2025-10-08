// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";

// 1. IMPORT THE CSS FILE
import "./globals.css"; 

// 2. IMPORT THE 'cn' UTILITY FUNCTION
import { cn } from "@/lib/utils";

const fontSans = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "The Guild",
  description: "An Operating System for a Post-Job Economy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      {/* 3. APPLY THE FONT AND BASE CLASSES TO THE BODY */}
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}