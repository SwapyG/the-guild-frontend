// src/components/providers/ThemeProvider.tsx
"use client";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      enableColorScheme
      themes={["light","dark"]}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
