// src/components/layout/ThemeToggle.tsx (Updated for Direct Toggle)

"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // This function will be called when the button is clicked
  const toggleTheme = () => {
    // If the current theme is dark (or hasn't been set yet, defaulting to system dark),
    // switch to light. Otherwise, switch to dark.
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {/* The Sun icon is shown only in dark mode */}
      <Sun className="h-[1.2rem] w-[1.2rem] scale-0 transition-all dark:scale-100" />
      {/* The Moon icon is shown only in light mode */}
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-100 transition-all dark:scale-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}