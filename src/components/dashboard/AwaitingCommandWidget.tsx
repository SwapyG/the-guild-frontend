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
import { Inbox, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export const AwaitingCommandWidget = () => {
  const [actionItems, setActionItems] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    getActionItems()
      .then((data) => setActionItems(data))
      .catch(() => toast.error("Failed to load action items."))
      .finally(() => setLoading(false));
  }, []);

  const glowColor = isDark
    ? "rgba(147,197,253,0.25)"
    : "rgba(59,130,246,0.2)";

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Background glow layer */}
      <motion.div
        className="absolute inset-0 rounded-2xl blur-2xl"
        style={{
          background: `radial-gradient(circle at 30% 70%, ${glowColor}, transparent 70%)`,
        }}
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main content */}
      <Card className="relative border border-border/70 bg-card/60 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Inbox className="h-5 w-5 text-primary" />
            <span>Awaiting Command</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Decisions pending your review.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-4 pr-4">
              {loading ? (
                <p className="text-sm text-muted-foreground p-4">
                  Loading action items...
                </p>
              ) : actionItems.length > 0 ? (
                actionItems.map((mission, i) => {
                  const pendingPitches = mission.pitches.filter(
                    (p) => p.status === "Submitted"
                  ).length;
                  return (
                    <motion.div
                      key={mission.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={`/missions/${mission.id}`}
                        className="block rounded-lg border bg-secondary/40 p-4 backdrop-blur-md transition-all hover:scale-[1.02] hover:border-primary/40 hover:bg-primary/10"
                      >
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-foreground pr-2">
                            {mission.title}
                          </p>
                          <Badge
                            variant="secondary"
                            className="text-xs font-semibold"
                          >
                            {pendingPitches} New Pitch
                            {pendingPitches !== 1 ? "es" : ""}
                          </Badge>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CheckCircle2 className="h-10 w-10 mb-3 text-green-500/80" />
                  <p className="font-semibold">All Clear, Commander.</p>
                  <p className="text-sm">
                    No pending missions at this time.
                  </p>
                </motion.div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
};
