import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css"; 
import { cn } from "@/lib/utils";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer"; 
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CursorGlow } from "@/components/layout/CursorGlow";

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
      <head />
      <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <AuthProvider>
            <CursorGlow />
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