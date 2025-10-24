"use client";

import { AwaitingCommandWidget } from "@/components/dashboard/AwaitingCommandWidget";
import { FadeIn } from "@/components/animations/FadeIn";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function ActionItemsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // 🧭 Redirect unauthorized users silently
  useEffect(() => {
    if (user && user.role !== "Manager" && user.role !== "Admin") {
      router.replace("/dashboard");
    }
  }, [user, router]);

  // Avoid flash of restricted content
  if (!user || (user.role !== "Manager" && user.role !== "Admin")) {
    return null;
  }

  return (
    <div className="relative min-h-screen p-6 md:p-10 overflow-hidden">
      {/* === Animated Ambient Background === */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: isDark
            ? `
              radial-gradient(600px circle at 25% 25%, rgba(99,102,241,0.12), transparent 70%),
              radial-gradient(800px circle at 90% 80%, rgba(59,130,246,0.1), transparent 70%)
            `
            : `
              radial-gradient(600px circle at 25% 25%, rgba(59,130,246,0.1), transparent 70%),
              radial-gradient(800px circle at 90% 80%, rgba(234,179,8,0.08), transparent 70%)
            `,
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* === Main Content === */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* --- Header --- */}
        <FadeIn>
          <motion.div
            className="space-y-3 mb-12"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight flex flex-col md:flex-row md:items-end gap-2">
              <span className="relative inline-block">
                Action Items
                <motion.span
                  className="absolute left-0 -bottom-1 h-[3px] w-full bg-gradient-to-r from-primary/70 to-blue-500/40 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3], scaleX: [0.8, 1, 0.8] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </span>
            </h1>

            <p className="text-muted-foreground text-base md:text-lg">
              A unified view of all pending actions requiring your approval or
              intervention across{" "}
              <span className="font-semibold text-foreground/90">
                The Guild
              </span>.
            </p>
          </motion.div>
        </FadeIn>

        {/* --- Command Widget Section --- */}
        <FadeIn delay={0.25}>
          <motion.div
            className="mt-6 backdrop-blur-xl bg-card/50 border border-border/40 rounded-2xl 
                       shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:shadow-[0_0_40px_rgba(59,130,246,0.25)] 
                       transition-all duration-700 p-6 md:p-10 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Subtle animated border glow */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(59,130,246,0.05), transparent 70%)",
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <AwaitingCommandWidget />
          </motion.div>
        </FadeIn>

        {/* --- Mission Intelligence (Future Insights) --- */}
        <FadeIn delay={0.45}>
          <motion.div
            className="mt-10 relative border border-border/30 rounded-2xl p-6 text-center 
                       backdrop-blur-sm bg-card/30 overflow-hidden"
            whileHover={{
              scale: 1.02,
              boxShadow: isDark
                ? "0 0 24px rgba(147,197,253,0.25)"
                : "0 0 24px rgba(37,99,235,0.15)",
            }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
          >
            {/* flowing data background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <div className="relative z-10">
              <h3 className="text-lg font-semibold mb-2 text-foreground/90">
                Mission Intelligence
              </h3>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                Soon — AI-assisted insight panels will surface mission summaries,
                identify blockers, and highlight high-impact decisions awaiting
                your attention.
              </p>
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </div>
  );
}
