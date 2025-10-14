// src/components/layout/Footer.tsx

import Link from "next/link";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
        <div className="text-center text-sm leading-loose text-muted-foreground">
          Copyright © {currentYear} Swapnil Gaikwad. All Rights Reserved.
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/legal/terms" className="hover:text-foreground">Terms of Service</Link>
          <Link href="/legal/privacy" className="hover:text-foreground">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};