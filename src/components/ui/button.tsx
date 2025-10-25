// src/components/ui/button.tsx (Definitive - Protocol Scorched Earth)

"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden select-none",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-primary/90 to-primary/70 text-primary-foreground hover:from-primary hover:to-primary/90 shadow-[0_0_12px_rgba(59,130,246,0.25)] hover:shadow-[0_0_20px_rgba(59,130,246,0.35)]",
        secondary: "bg-gradient-to-br from-muted/60 to-muted/40 border border-border/60 text-foreground hover:bg-muted/70 hover:border-border/80",
        outline: "border border-primary/40 text-primary bg-transparent hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]",
        ghost: "hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors",
        destructive: "bg-gradient-to-br from-red-600/90 to-red-500/80 text-white hover:from-red-500 hover:to-red-600 shadow-[0_0_10px_rgba(220,38,38,0.35)] hover:shadow-[0_0_20px_rgba(220,38,38,0.45)]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  pulse?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, pulse = false, children, ...props }, ref) => {
    
    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cn(buttonVariants({ variant, size, className }))}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    // --- NANO: PROTOCOL SCORCHED EARTH ---
    // Manually deconstruct the motion-specific props from the rest.
    // This is the brute-force method to appease TypeScript.
    const { 
        initial, animate, exit, variants, transition, whileHover, whileTap, 
        // We list all potential motion props to separate them from standard HTML props
        onHoverStart, onHoverEnd, onTap, onTapStart, onTapCancel,
        layout, layoutId, ...rest 
    } = props as any; // Use `as any` to bypass the initial type conflict

    const motionProps = { 
        whileHover: { scale: 1.03 }, 
        whileTap: { scale: 0.97 },
        transition: { type: "spring", stiffness: 300, damping: 18 },
    };

    return (
      // We explicitly cast the combined props to `any` as a final command to the compiler.
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...motionProps}
        {...rest} // Pass only the sanitized, non-conflicting props
      >
        {pulse && (
          <motion.span
            className="absolute inset-0 rounded-md bg-gradient-to-br from-primary/25 to-transparent opacity-30 blur-xl"
            animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.1, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };