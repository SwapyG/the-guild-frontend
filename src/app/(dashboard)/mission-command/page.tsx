"use client";

import { useEffect, useState, useCallback } from "react";
import { Mission, MissionStatus } from "@/types";
import { getMissions, updateMissionStatus } from "@/services/api";
import { Button } from "@/components/ui/button";
import { CreateMissionModal } from "@/components/missions/CreateMissionModal";
import { useAuth } from "@/context/AuthContext";
import { ClipboardList, Activity, CheckCircle2, Sparkles } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { MissionColumn } from "@/components/missions/MissionColumn";
import { SortableMissionCard } from "@/components/missions/SortableMissionCard";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/animations/FadeIn";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const MissionCardOverlay = ({ mission }: { mission: Mission }) => (
  <Card className="bg-card border-primary/50 shadow-lg backdrop-blur-md">
    <CardHeader>
      <CardTitle className="text-lg tracking-tight">{mission.title}</CardTitle>
    </CardHeader>
    <CardContent className="text-sm text-muted-foreground">
      <p>Lead: {mission.lead.name}</p>
    </CardContent>
    <CardFooter className="text-xs text-muted-foreground">
      <p>{mission.roles.length} role(s) defined</p>
    </CardFooter>
  </Card>
);

const statusConfig: Record<MissionStatus, { title: string; icon: React.ReactNode }> = {
  Proposed: { title: "Proposed", icon: <ClipboardList className="h-5 w-5 mr-2 text-muted-foreground" /> },
  Active: { title: "Active", icon: <Activity className="h-5 w-5 mr-2 text-sky-500" /> },
  Completed: { title: "Completed", icon: <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" /> },
};

export default function MissionCommandPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isCommander = user?.role === "Manager" || user?.role === "Admin";

  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);

  // === Fetch Missions ===
  const fetchMissions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMissions();
      setMissions(data.map((m: any) => ({ ...m, id: m.id.toString() })));
      setError(null);
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching missions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchMissions();
  }, [fetchMissions, user]);

  // === DnD Handlers ===
  const handleDragStart = (event: DragStartEvent) => {
    const mission = missions.find((m) => m.id === event.active.id);
    if (mission) setActiveMission(mission);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveMission(null);
    const { active, over } = event;
    if (!over || !over.id || active.id === over.id) return;

    const missionId = active.id as string;
    const newStatus = over.id as MissionStatus;
    const missionToMove = missions.find((m) => m.id === missionId);
    if (!missionToMove || missionToMove.status === newStatus) return;

    if (user?.id !== missionToMove.lead_user_id) {
      toast.error("Only the mission lead can change the status.");
      return;
    }

    const original = [...missions];
    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, status: newStatus } : m))
    );

    try {
      await updateMissionStatus(missionId, newStatus);
      toast.success("Mission status updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update mission status. Reverting.");
      setMissions(original);
    }
  };

  // === Filter & Group ===
  const displayedMissions = isCommander
    ? missions
    : missions.filter(
        (m) =>
          m.status === "Proposed" ||
          (m.status === "Active" &&
            m.roles.some((r) => r.assignee?.id === user?.id))
      );

  const missionsByStatus = displayedMissions.reduce(
    (acc, m) => {
      if (!acc[m.status]) acc[m.status] = [];
      acc[m.status].push(m);
      return acc;
    },
    {} as Record<MissionStatus, Mission[]>
  );

  const commanderGlow = isDark
    ? "rgba(147,197,253,0.2)"
    : "rgba(59,130,246,0.2)";
  const operativeGlow = isDark
    ? "rgba(251,191,36,0.25)"
    : "rgba(234,179,8,0.2)";

  return (
    <main className="relative min-h-screen overflow-hidden p-4 md:p-8">
      {/* 🌌 Animated Background */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: isDark
            ? "radial-gradient(700px circle at 0% 0%, rgba(59,130,246,0.15), transparent 60%), radial-gradient(700px circle at 100% 100%, rgba(147,197,253,0.15), transparent 60%)"
            : "radial-gradient(700px circle at 0% 0%, rgba(234,179,8,0.1), transparent 60%), radial-gradient(700px circle at 100% 100%, rgba(37,99,235,0.1), transparent 60%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* === Foreground === */}
      <div className="relative z-10">
        <FadeIn>
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary/80 animate-pulse" />
              <h1 className="text-3xl font-bold tracking-tight">
                Mission Command
              </h1>
            </div>

            {isCommander && (
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="shadow-md hover:shadow-primary/30"
              >
                Propose New Mission
              </Button>
            )}
          </div>
        </FadeIn>

        <FadeIn delay={0.25}>
          {loading ? (
            <p className="text-center text-muted-foreground py-16">
              Loading missions...
            </p>
          ) : error ? (
            <p className="text-center text-red-500 py-16">{error}</p>
          ) : (
            <DndContext
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              collisionDetection={closestCorners}
            >
              <div
                className={cn(
                  "grid gap-6",
                  isCommander ? "md:grid-cols-3" : "md:grid-cols-2"
                )}
              >
                {(["Proposed", "Active", "Completed"] as MissionStatus[]).map(
                  (status) => {
                    if (!isCommander && status === "Completed") return null;

                    return (
                      <MissionColumn key={status} status={status}>
                        <motion.div
                          whileHover={{
                            scale: 1.01,
                            boxShadow: `0 0 25px ${
                              isCommander ? commanderGlow : operativeGlow
                            }`,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 220,
                            damping: 25,
                          }}
                          className="rounded-2xl p-4 border border-border/50 bg-card/40 backdrop-blur-sm"
                        >
                          <div className="flex items-center mb-6 px-2">
                            {statusConfig[status].icon}
                            <h2 className="text-lg font-semibold tracking-tight text-foreground">
                              {statusConfig[status].title}
                            </h2>
                          </div>

                          <SortableContext
                            items={(missionsByStatus[status] || []).map(
                              (m) => m.id
                            )}
                            strategy={verticalListSortingStrategy}
                          >
                            <AnimatePresence>
                              <div className="space-y-4 min-h-[220px]">
                                {(missionsByStatus[status] || []).length > 0 ? (
                                  missionsByStatus[status].map((m) => (
                                    <motion.div
                                      key={m.id}
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.9 }}
                                      transition={{
                                        type: "spring",
                                        stiffness: 250,
                                        damping: 22,
                                      }}
                                    >
                                      <SortableMissionCard mission={m} />
                                    </motion.div>
                                  ))
                                ) : (
                                  <div className="text-center text-sm text-muted-foreground py-8 border-2 border-dashed border-border rounded-lg">
                                    No missions here.
                                  </div>
                                )}
                              </div>
                            </AnimatePresence>
                          </SortableContext>
                        </motion.div>
                      </MissionColumn>
                    );
                  }
                )}
              </div>

              <DragOverlay>
                {activeMission ? (
                  <MissionCardOverlay mission={activeMission} />
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </FadeIn>
      </div>

      <CreateMissionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onMissionCreated={fetchMissions}
      />
    </main>
  );
}
