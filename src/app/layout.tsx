// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; 
import { cn } from "@/lib/utils";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/layout/Header"; // <-- IMPORT

const fontSans = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header /> 
            <div className="flex-1">{children}</div>
          </div>
        </AuthProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}