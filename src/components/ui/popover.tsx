"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────── */
/* Root + Trigger                                 */
/* ────────────────────────────────────────────── */

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Trigger
    ref={ref}
    data-slot="popover-trigger"
    className={cn(
      "inline-flex items-center justify-center rounded-md outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-all",
      className
    )}
    {...props}
  />
));
PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName;

/* ────────────────────────────────────────────── */
/* Popover Content                                */
/* ────────────────────────────────────────────── */

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    glow?: boolean;
  }
>(({ className, align = "center", sideOffset = 6, glow = true, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      data-slot="popover-content"
      className={cn(
        "z-50 w-72 origin-[var(--radix-popover-content-transform-origin)] rounded-xl border border-border/60 bg-popover/80 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.15)]",
        "p-4 outline-hidden transition-all duration-200 ease-out",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
        className
      )}
      {...props}
    >
      {props.children}

      {/* Optional glow animation */}
      {glow && (
        <div className="pointer-events-none absolute inset-0 rounded-xl opacity-20 blur-2xl bg-gradient-to-tr from-primary/20 to-transparent" />
      )}
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

/* ────────────────────────────────────────────── */
/* Popover Anchor                                 */
/* ────────────────────────────────────────────── */

const PopoverAnchor = PopoverPrimitive.Anchor;

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
