// src/components/providers/ThemeProvider.tsx (Corrected)

"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// --- THE FIX IS HERE ---
// Instead of importing the type from a deep path, we use React's built-in
// ComponentProps utility type to get the props directly from the provider component.
// This is a much more stable and future-proof way to do it.
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;
// ---------------------

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}