"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import GuildLogo from "./GuildLogo";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { useTheme } from "next-themes";

export const Header = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center"></div>
      </header>
    );
  }

  const handleProfileClick = () => router.push("/profile");

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-colors duration-500
      ${
        isDark
          ? "bg-[rgba(15,23,42,0.65)] border-white/10 shadow-[0_2px_30px_rgba(0,0,0,0.3)]"
          : "bg-[rgba(255,255,255,0.7)] border-blue-100 shadow-[0_2px_25px_rgba(0,0,0,0.05)]"
      }`}
    >
      <div className="container flex h-14 items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.15, rotate: -10 }}
              transition={{ type: "spring", stiffness: 400, damping: 12 }}
            >
              <GuildLogo
                className={`h-7 w-7 text-neutral-800 dark:text-neutral-200 drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_1px_1px_rgba(255,255,255,0.2)] transition-transform group-hover:rotate-[10deg]`}
              />
            </motion.div>
            <span
              className={`font-bold tracking-tight ${
                isDark
                  ? "text-slate-100 group-hover:text-white"
                  : "text-slate-800 group-hover:text-black"
              } transition-colors`}
            >
              The Guild<span className="text-primary">™</span>
            </span>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                asChild
                className={`transition-all hover:scale-105 ${
                  isDark
                    ? "text-slate-200 hover:text-white hover:bg-white/10"
                    : "text-slate-700 hover:text-black hover:bg-blue-50"
                }`}
              >
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </Link>
              </Button>

              <NotificationsDropdown />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full hover:ring-2 hover:ring-primary/40 transition-all duration-200"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={user?.photo_url || ""}
                          alt={user?.name || "User"}
                        />
                        <AvatarFallback>
                          {user?.name
                            ? user.name.charAt(0).toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className={`w-56 backdrop-blur-md border ${
                    isDark
                      ? "bg-[rgba(30,41,59,0.8)] border-white/10"
                      : "bg-[rgba(255,255,255,0.9)] border-blue-100"
                  }`}
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleProfileClick}
                    className="cursor-pointer flex items-center hover:text-primary"
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer flex items-center hover:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <motion.nav
              className="flex items-center space-x-2"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="ghost"
                asChild
                className={`hover:scale-105 transition-all ${
                  isDark
                    ? "text-slate-200 hover:text-white hover:bg-white/10"
                    : "text-slate-700 hover:text-black hover:bg-blue-50"
                }`}
              >
                <Link href="/auth/login">Log In</Link>
              </Button>
              <Button
                asChild
                className={`ripple-btn text-sm font-semibold px-4 py-2 rounded-md transition-all animate-[pulse-glow_10s_ease-in-out_infinite]
                ${
                  isDark
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <Link href="/auth/register">Sign Up</Link>
              </Button>
            </motion.nav>
          )}
        </div>
      </div>
    </motion.header>
  );
};
