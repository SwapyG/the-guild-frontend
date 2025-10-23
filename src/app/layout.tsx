import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AnimatedBackground } from "@/components/layout/AnimatedBackground";
import { CustomCursor } from "@/components/layout/CustomCursor";

export const metadata: Metadata = {
  title: "The Guild™",
  description: "An Operating System for a Post-Job Economy.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  openGraph: {
    title: "The Guild™",
    description:
      "Lead missions, not departments. The Guild is the future of organizational flow.",
    url: "https://theguild.app",
    siteName: "The Guild",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Guild Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Guild™",
    description:
      "Lead missions, not departments. The Guild is the future of organizational flow.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(GeistSans.variable)} suppressHydrationWarning>
      <head>
        {/* --- Favicon Fallbacks for Legacy Browsers --- */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="theme-color" content="#111827" />
      </head>

      <body
        className={cn(
          "relative antialiased min-h-screen overflow-x-hidden selection:bg-primary/20"
        )}
      >
        {/* === THEME PROVIDER === */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* === BACKGROUND LAYER === */}
          <AnimatedBackground />

          {/* === APP CONTEXT === */}
          <AuthProvider>
            {/* === GLOBAL CUSTOM CURSOR === */}
            <CustomCursor />

            {/* === MAIN APP STRUCTURE === */}
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>

            {/* === GLOBAL TOASTER === */}
            <Toaster position="bottom-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
