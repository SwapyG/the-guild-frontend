// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; 
import { cn } from "@/lib/utils";
import { Toaster } from 'react-hot-toast'; // <-- 1. IMPORT

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
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {children}
        <Toaster position="bottom-right" /> {/* <-- 2. ADD THE COMPONENT */}
      </body>
    </html>
  );
}