"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Mission } from "@/types";
import { getActionItems } from "@/services/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Inbox, CheckCircle2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export const AwaitingCommandWidget = () => {
  const [actionItems, setActionItems] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getActionItems();
        setActionItems(data);
      } catch {
        toast.error("Failed to load action items.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const glowColor = isDark
    ? "rgba(147,197,253,0.25)"
    : "rgba(59,130,246,0.15)";

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Subtle Ambient Glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl blur-3xl"
        style={{
          background: `radial-gradient(circle at 45% 65%, ${glowColor}, transparent 70%)`,
        }}
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Card Container */}
      <Card className="relative border border-border/60 bg-card/70 backdrop-blur-lg shadow-[0_0_25px_rgba(59,130,246,0.08)] hover:shadow-[0_0_30px_rgba(59,130,246,0.12)] transition-all duration-500 rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <Inbox className="h-5 w-5 text-primary" />
            <span>Awaiting Command</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Missions or pitches pending your review.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-72 pr-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Loader2 className="h-6 w-6 mb-2 animate-spin" />
                <p className="text-sm">Loading action items...</p>
              </div>
            ) : actionItems.length > 0 ? (
              <div className="space-y-3">
                {actionItems.map((mission, i) => {
                  const pendingPitches = mission.pitches?.filter(
                    (p) => p.status === "Submitted"
                  ).length;

                  const label =
                    pendingPitches === 0
                      ? "No Pitches"
                      : pendingPitches === 1
                      ? "1 Pending"
                      : `${pendingPitches} Pending`;

                  const badgeTone =
                    pendingPitches > 0
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "bg-green-100 text-green-600 border border-green-300 dark:bg-green-900/20 dark:text-green-400";

                  return (
                    <motion.div
                      key={mission.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={`/missions/${mission.id}`}
                        className="group block relative rounded-xl border border-border/50 bg-background/30 hover:bg-primary/5 transition-all duration-300 backdrop-blur-sm p-4"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                              {mission.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Lead: {mission.lead.name}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className={`text-xs font-semibold ${badgeTone} transition-colors duration-300`}
                          >
                            {label}
                          </Badge>
                        </div>

                        {/* Animated Glow Line */}
                        <motion.div
                          className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary/60 group-hover:w-full rounded-full"
                          transition={{ duration: 0.4 }}
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div
                className="flex flex-col items-center justify-center h-56 text-center text-muted-foreground"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <CheckCircle2 className="h-10 w-10 mb-3 text-green-500/80" />
                <p className="font-semibold text-foreground/90">
                  All Clear, Commander.
                </p>
                <p className="text-sm text-muted-foreground">
                  No pending missions at this time.
                </p>
              </motion.div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
};
