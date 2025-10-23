"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 text-center text-sm text-muted-foreground md:h-16 md:flex-row md:text-left md:py-0">
        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col md:flex-row md:items-center md:gap-2"
        >
          <span>
            © {currentYear} <span className="font-semibold text-foreground/90">Swapnil Gaikwad</span>.
          </span>
          <span className="hidden md:inline">·</span>
          <span>All Rights Reserved.</span>
        </motion.div>

        {/* Right Section */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="flex items-center gap-4"
        >
          <FooterLink href="/legal/terms" label="Terms of Service" />
          <FooterLink href="/legal/privacy" label="Privacy Policy" />
          <FooterLink href="/contact" label="Contact" />
        </motion.div>
      </div>
    </footer>
  );
};

// ✨ Reusable Animated Link Component
const FooterLink = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className="relative transition-colors hover:text-foreground"
  >
    <motion.span
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15 }}
      className="inline-block"
    >
      {label}
    </motion.span>
    <span className="absolute -bottom-0.5 left-0 h-[1px] w-0 bg-primary transition-all duration-200 group-hover:w-full" />
  </Link>
);
