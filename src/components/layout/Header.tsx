// src/components/layout/Header.tsx (Final Code with Dynamic SVG Logo)

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LayoutDashboard, LogOut, User as UserIcon } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
// --- NANO: IMPORTING OUR NEW DYNAMIC COMPONENT ---
import GuildLogo from "./GuildLogo";

export const Header = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();

  if (loading) {
    return <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"><div className="container flex h-14 items-center"></div></header>;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            
            <motion.div
              whileHover={{ scale: 1.15, rotate: -15 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {/* --- NANO: DYNAMIC SVG DEPLOYED --- */}
              <GuildLogo 
                className="
                  h-7 w-7 
                  text-neutral-800 dark:text-neutral-200 
                  drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]
                  dark:drop-shadow-[0_1px_1px_rgba(255,255,255,0.25)]
                "
              />
              {/* ---------------------------------- */}
            </motion.div>

            <span className="font-bold">The Guild™</span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.photo_url || ""} alt={user?.name || "User"} />
                      <AvatarFallback>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link href="/profile"><UserIcon className="mr-2 h-4 w-4" /><span>My Profile</span></Link></DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}><LogOut className="mr-2 h-4 w-4" /><span>Log out</span></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <nav className="flex items-center space-x-2">
              <Button variant="ghost" asChild><Link href="/auth/login">Log In</Link></Button>
              <Button asChild><Link href="/auth/register">Sign Up</Link></Button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};