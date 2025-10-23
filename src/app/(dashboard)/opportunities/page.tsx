"use client";

import { useEffect, useState } from "react";
import { Mission } from "@/types";
import { getMissions } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FadeIn } from "@/components/animations/FadeIn";
import { Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

const OpportunityCard = ({ mission }: { mission: Mission }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ type: "spring", stiffness: 220, damping: 25 }}
  >
    <Card className="border-border/60 bg-card/50 backdrop-blur-md hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{mission.title}</CardTitle>
        <CardDescription>Led by {mission.lead.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {mission.description}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-2">
            {mission.roles.slice(0, 3).map((role) => (
              <Badge key={role.id} variant="outline">
                {role.required_skill.name}
              </Badge>
            ))}
            {mission.roles.length > 3 && (
              <Badge variant="outline">
                +{mission.roles.length - 3} more
              </Badge>
            )}
          </div>
          <Button asChild size="sm" className="ml-2">
            <Link href={`/missions/${mission.id}`}>View & Pitch</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function OpportunitiesPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [opportunities, setOpportunities] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getMissions()
        .then((allMissions) => {
          const proposedMissions = allMissions.filter(
            (m) => m.status === "Proposed"
          );
          setOpportunities(proposedMissions);
        })
        .catch((error) => {
          console.error("Failed to fetch opportunities:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

  return (
    <main className="relative min-h-screen overflow-hidden p-4 md:p-8">
      {/* 🌌 Animated Background */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: isDark
            ? "radial-gradient(600px circle at 0% 0%, rgba(59,130,246,0.12), transparent 60%), radial-gradient(600px circle at 100% 100%, rgba(147,197,253,0.12), transparent 60%)"
            : "radial-gradient(600px circle at 0% 0%, rgba(234,179,8,0.08), transparent 60%), radial-gradient(600px circle at 100% 100%, rgba(37,99,235,0.08), transparent 60%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* === Foreground Content === */}
      <div className="relative z-10">
        <FadeIn>
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-6 w-6 text-primary animate-pulse" />
            <h1 className="text-3xl font-bold tracking-tight">
              Mission Opportunities
            </h1>
          </div>
          <p className="text-muted-foreground mb-8">
            Browse proposed missions and pitch to join the ones that match your
            skills and passion.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          {loading ? (
            <p className="text-center text-muted-foreground py-16">
              Loading Opportunities...
            </p>
          ) : opportunities.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence>
                {opportunities.map((mission) => (
                  <OpportunityCard key={mission.id} mission={mission} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-center">
              <Target className="h-10 w-10 mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No Open Opportunities</h3>
              <p className="text-sm text-muted-foreground">
                Check back soon for new proposed missions.
              </p>
            </div>
          )}
        </FadeIn>
      </div>
    </main>
  );
}
