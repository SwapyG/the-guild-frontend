"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  KanbanSquare,
  Users,
  Inbox,
  User as UserIcon,
  Target,
  ClipboardCheck,
  Mail,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const commanderNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/mission-command", icon: KanbanSquare, label: "Mission Command" },
  { href: "/roster", icon: Users, label: "Talent Roster" },
  { href: "/action-items", icon: Inbox, label: "Action Items" },
  { href: "/profile", icon: UserIcon, label: "My Profile" },
];

const operativeNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "My Dashboard" },
  { href: "/opportunities", icon: Target, label: "Opportunities" },
  { href: "/assignments", icon: ClipboardCheck, label: "My Assignments" },
  { href: "/invites", icon: Mail, label: "My Invitations" },
  { href: "/profile", icon: UserIcon, label: "My Profile" },
];

export const Sidebar = () => {
  const { user } = useAuth();
  const pathname = usePathname();
  const isCommander = user?.role === "Manager" || user?.role === "Admin";
  const navItems = isCommander ? commanderNavItems : operativeNavItems;

  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 72 : 256 }}
      transition={{ duration: 0.18, ease: "easeInOut" }}
      className={cn(
        "hidden md:flex flex-col border-r border-border/40 bg-secondary/40 backdrop-blur-md p-4 relative overflow-hidden"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed((p) => !p)}
        className={cn(
          "absolute -right-3 top-5 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground shadow-sm hover:bg-primary/10 hover:text-primary transition-all duration-150"
        )}
      >
        {isCollapsed ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <Menu className="h-4 w-4" />
        )}
      </button>

      {/* Header */}
      <div className="mb-5 flex items-center gap-3 px-2">
        <KanbanSquare className="h-6 w-6 text-primary" />
        <AnimatePresence>
          {!isCollapsed && (
            <motion.h2
              key="title"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="text-lg font-semibold tracking-tight text-foreground/90"
            >
              {isCommander ? "Command Panel" : "Operative Panel"}
            </motion.h2>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-100",
                "text-muted-foreground hover:bg-primary/10 hover:text-primary",
                isActive &&
                  "bg-primary/15 text-primary border border-primary/20 shadow-[inset_0_0_6px_rgba(59,130,246,0.25)]"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-transform duration-100 group-hover:scale-110",
                  isActive && "text-primary"
                )}
              />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    key="label"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.12 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            key="footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-auto pt-6 border-t border-border/30 text-xs text-muted-foreground"
          >
            <p className="px-2">The Guild™ v1.0</p>
            <p className="px-2 opacity-70">Post-Job Economy OS</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
};
