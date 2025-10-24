"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SkillManager } from "@/components/profile/SkillManager";
import { FadeIn } from "@/components/animations/FadeIn";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const isDark = theme === "dark";
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);

  if (!user) {
    return (
      <ProtectedRoute>
        <div className="text-center py-24 text-muted-foreground text-lg">
          Loading Profile...
        </div>
      </ProtectedRoute>
    );
  }

  const accentGlow = isDark
    ? "rgba(147,197,253,0.25)"
    : "rgba(37,99,235,0.15)";

  const handleBackClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipple({ x, y });

    setTimeout(() => {
      setRipple(null);
      router.push("/mission-command");
    }, 500);
  };

  return (
    <ProtectedRoute>
      <main className="relative min-h-screen overflow-hidden py-12 px-4">
        {/* 🌌 Animated Background Layer */}
        <motion.div
          className="absolute inset-0 z-0"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage: isDark
              ? "radial-gradient(800px circle at 0% 0%, rgba(59,130,246,0.15), transparent 60%), radial-gradient(800px circle at 100% 100%, rgba(147,197,253,0.1), transparent 60%)"
              : "radial-gradient(800px circle at 0% 0%, rgba(234,179,8,0.1), transparent 60%), radial-gradient(800px circle at 100% 100%, rgba(37,99,235,0.1), transparent 60%)",
            backgroundSize: "200% 200%",
          }}
        />

        {/* Content Layer */}
        <div className="relative z-10 container mx-auto max-w-4xl space-y-8">
          {/* 🔙 Back Button */}
          <motion.button
            onClick={handleBackClick}
            className="relative overflow-hidden inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 backdrop-blur-md bg-card/40 text-sm text-foreground/80 shadow-sm hover:shadow-lg hover:bg-primary/10 hover:text-primary transition-all cursor-pointer w-fit"
            whileHover={{ scale: 1.05, boxShadow: `0 0 15px ${accentGlow}` }}
            whileTap={{ scale: 0.97 }}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Mission Command</span>

            {/* ⚡ Ripple effect */}
            <AnimatePresence>
              {ripple && (
                <motion.span
                  key="ripple"
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 8, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    top: ripple.y,
                    left: ripple.x,
                    width: 20,
                    height: 20,
                    background: isDark
                      ? "radial-gradient(circle, rgba(147,197,253,0.4), transparent 70%)"
                      : "radial-gradient(circle, rgba(59,130,246,0.3), transparent 70%)",
                    borderRadius: "50%",
                    pointerEvents: "none",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              )}
            </AnimatePresence>
          </motion.button>

          {/* === User Header Section === */}
          <FadeIn>
            <motion.div
              className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-card/40 backdrop-blur-md border border-border/60 rounded-2xl p-6 shadow-md"
              whileHover={{
                boxShadow: `0 0 30px ${accentGlow}`,
              }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Avatar className="h-28 w-28 border-2 border-primary/30 shadow-lg">
                  <AvatarImage src={user.photo_url || ""} alt={user.name} />
                  <AvatarFallback className="text-4xl font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </motion.div>

              <div className="text-center sm:text-left">
                <motion.h1
                  className="text-4xl font-bold tracking-tight leading-tight"
                  animate={{
                    textShadow: `0 0 12px ${accentGlow}`,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "mirror",
                  }}
                >
                  {user.name}
                </motion.h1>
                <p className="text-xl text-muted-foreground mt-1">
                  {user.title || "Guild Operative"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {user.email}
                </p>
              </div>
            </motion.div>
          </FadeIn>

          <Separator className="my-10" />

          {/* === Skill Ledger Section === */}
          <FadeIn delay={0.2}>
            <motion.div
              whileHover={{
                scale: 1.01,
                boxShadow: `0 0 25px ${accentGlow}`,
              }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 20,
              }}
            >
              <Card className="bg-card/50 backdrop-blur-lg border border-border/60">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">
                    My Skill Ledger
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    Your personal record of abilities and proficiencies.  
                    Add new skills and set proficiency to increase visibility  
                    for upcoming Guild missions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <SkillManager initialSkills={user.skills} />
                </CardContent>
              </Card>
            </motion.div>
          </FadeIn>
        </div>
      </main>
    </ProtectedRoute>
  );
}
