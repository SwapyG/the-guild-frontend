"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Custom ThemeProvider with smooth theme transitions
 * and hydration-safe flicker prevention.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // Disable transitions during SSR to prevent flash/flicker
  React.useEffect(() => {
    document.documentElement.dataset.themeTransition = "false";
    const timeout = setTimeout(() => {
      document.documentElement.dataset.themeTransition = "true";
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
