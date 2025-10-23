"use client";

import { useAuth } from "@/context/AuthContext";
import { FadeIn } from "@/components/animations/FadeIn";
import { AwaitingCommandWidget } from "@/components/dashboard/AwaitingCommandWidget";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const { theme } = useTheme();

  const isCommander = user?.role === "Manager" || user?.role === "Admin";
  const isDark = theme === "dark";

  const commanderGlow = isDark
    ? "rgba(147,197,253,0.25)"
    : "rgba(59,130,246,0.25)";
  const operativeGlow = isDark
    ? "rgba(251,191,36,0.25)"
    : "rgba(234,179,8,0.2)";

  const commanderBorder = isDark
    ? "rgba(147,197,253,0.35)"
    : "rgba(37,99,235,0.3)";
  const operativeBorder = isDark
    ? "rgba(251,191,36,0.3)"
    : "rgba(234,179,8,0.25)";

  return (
    <div
      className="relative min-h-screen p-6 md:p-10 overflow-x-hidden overflow-y-auto"
      style={{
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE/Edge
      }}
    >
      <style jsx>{`
        /* Hide scrollbar visually but keep scroll functionality */
        ::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* 🌌 Animated Background Layer */}
      <motion.div
        className="absolute inset-0 z-0 bg-gradient-to-br from-background via-background/95 to-background/70"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundImage: isDark
            ? "radial-gradient(800px circle at 0% 0%, rgba(59,130,246,0.25), transparent 60%), radial-gradient(800px circle at 100% 100%, rgba(147,197,253,0.25), transparent 60%)"
            : "radial-gradient(800px circle at 0% 0%, rgba(234,179,8,0.2), transparent 60%), radial-gradient(800px circle at 100% 100%, rgba(37,99,235,0.15), transparent 60%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10">
        <FadeIn>
          <motion.div
            className="space-y-3"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              Welcome back,&nbsp;
              <motion.span
                className="text-primary"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{
                  duration: 2.2,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              >
                {user?.name?.split(" ")[0] || "Operative"}
              </motion.span>
            </h1>

            <p className="text-muted-foreground text-base md:text-lg">
              {isCommander
                ? "Your command deck is live. Assess, deploy, and orchestrate the Guild."
                : "Your mission board is ready. Review your active assignments and progress."}
            </p>
          </motion.div>
        </FadeIn>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        >
          {isCommander ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <motion.div
                animate={{
                  boxShadow: `0 0 40px ${commanderGlow}`,
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  repeatType: "mirror",
                }}
              >
                <AwaitingCommandWidget />
              </motion.div>

              {/* Placeholder Commander Widget */}
              <motion.div
                className="rounded-2xl border p-10 text-center backdrop-blur-md bg-card/40"
                style={{ borderColor: commanderBorder }}
                whileHover={{
                  scale: 1.02,
                  borderColor: "rgba(59,130,246,0.45)",
                  boxShadow: `0 0 28px ${commanderGlow}`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 22,
                }}
              >
                <h3 className="text-lg font-semibold mb-3 text-foreground/90">
                  Mission Velocity
                </h3>
                <p className="text-muted-foreground text-sm">
                  Coming soon — Real-time ops analytics and deployment efficiency
                  insights.
                </p>
              </motion.div>
            </div>
          ) : (
            <motion.div
              className="rounded-2xl border p-10 text-center backdrop-blur-md bg-card/40"
              style={{ borderColor: operativeBorder }}
              whileHover={{
                scale: 1.02,
                borderColor: isDark
                  ? "rgba(234,179,8,0.45)"
                  : "rgba(234,179,8,0.35)",
                boxShadow: `0 0 26px ${operativeGlow}`,
              }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 22,
              }}
            >
              <h3 className="text-lg font-semibold mb-3 text-foreground/90">
                My Active Assignment
              </h3>
              <p className="text-muted-foreground text-sm">
                Your next operation feed will appear here — stay sharp.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
