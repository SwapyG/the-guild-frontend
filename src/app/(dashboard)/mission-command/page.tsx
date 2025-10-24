"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Mission, MissionStatus } from "@/types";
import { getMissions, updateMissionStatus } from "@/services/api";
import { Button } from "@/components/ui/button";
import { CreateMissionModal } from "@/components/missions/CreateMissionModal";
import { useAuth } from "@/context/AuthContext";
import {
  ClipboardList,
  Activity,
  CheckCircle2,
  Sparkles,
  GripVertical,
} from "lucide-react";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { MissionColumn } from "@/components/missions/MissionColumn";
import { toast } from "react-hot-toast";
import { FadeIn } from "@/components/animations/FadeIn";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

/* ───────────────────────────────────────────── */
/* SortableExpandableMissionCard                 */
/* ───────────────────────────────────────────── */
function SortableExpandableMissionCard({
  mission,
  expanded,
  onToggle,
}: {
  mission: Mission;
  expanded: boolean;
  onToggle: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: mission.id });

  const { theme } = useTheme();
  const router = useRouter();
  const isDark = theme === "dark";

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  } as React.CSSProperties;

  const glowColor = isDark
    ? "rgba(147,197,253,0.25)"
    : "rgba(37,99,235,0.15)";

  const handleClick = () => {
    if (!isDragging) {
      router.push(`/missions/${mission.id}`);
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm select-none",
        isDragging
          ? "shadow-[0_0_20px_rgba(59,130,246,0.4)] z-[50]"
          : "hover:shadow-[0_0_14px_rgba(59,130,246,0.25)] transition-all cursor-pointer"
      )}
      onClick={handleClick}
    >
      <div className="p-3 md:p-4">
        <div className="flex items-start gap-2">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className={cn(
              "mt-0.5 shrink-0 rounded-md border border-border/60 bg-background/50",
              "p-1.5 text-muted-foreground hover:text-foreground cursor-grab"
            )}
            aria-label="Drag"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          {/* Card Header */}
          <div className="flex-1">
            <h3 className="font-semibold text-sm md:text-base leading-tight text-foreground">
              {mission.title}
            </h3>
            <p className="text-xs text-muted-foreground">
              Lead: {mission.lead.name}
            </p>
          </div>
        </div>

        {/* Expanded Info (visible on hover or when active) */}
        <AnimatePresence initial={false}>
          {expanded && !isDragging && (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-3 space-y-3 text-sm text-muted-foreground"
            >
              <p>
                <span className="font-semibold text-foreground/90">Status:</span>{" "}
                {mission.status}
              </p>
              <p>
                <span className="font-semibold text-foreground/90">Roles:</span>{" "}
                {mission.roles.length} defined
              </p>
              <div className="flex flex-wrap gap-2">
                {mission.roles.slice(0, 3).map((r) => (
                  <span
                    key={r.id}
                    className="text-xs px-2 py-1 rounded-md bg-primary/10 border border-primary/20"
                  >
                    {r.role_description}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Animated Glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          background: `radial-gradient(circle at 30% 70%, ${glowColor}, transparent 70%)`,
        }}
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

/* ───────────────────────────────────────────── */
/* Status Icons                                  */
/* ───────────────────────────────────────────── */
const statusConfig: Record<MissionStatus, { title: string; icon: React.ReactNode }> =
  {
    Proposed: {
      title: "Proposed",
      icon: (
        <ClipboardList className="h-5 w-5 mr-2 text-muted-foreground" />
      ),
    },
    Active: {
      title: "Active",
      icon: <Activity className="h-5 w-5 mr-2 text-sky-500" />,
    },
    Completed: {
      title: "Completed",
      icon: <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />,
    },
  };

/* ───────────────────────────────────────────── */
/* Page Component                                */
/* ───────────────────────────────────────────── */
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
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

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

  const handleExpandToggle = (id: string) =>
    setExpandedCardId((prev) => (prev === id ? null : id));

  const handleDragStart = (event: DragStartEvent) => {
    const mission = missions.find((m) => m.id === event.active.id);
    if (mission) setActiveMission(mission);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveMission(null);
    const { active, over } = event;
    if (!over) return;

    const missionId = active.id as string;
    const sortableData: any = over.data?.current?.sortable;
    const targetColumn = sortableData?.containerId || (over.id as MissionStatus);

    if (!targetColumn) return;

    const missionToMove = missions.find((m) => m.id === missionId);
    if (!missionToMove || missionToMove.status === targetColumn) return;

    if (user?.id !== missionToMove.lead_user_id) {
      toast.error("Only the mission lead can change the status.");
      return;
    }

    const original = [...missions];
    setMissions((prev) =>
      prev.map((m) =>
        m.id === missionId ? { ...m, status: targetColumn! } : m
      )
    );

    try {
      await updateMissionStatus(missionId, targetColumn);
      toast.success("Mission status updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update mission status. Reverting.");
      setMissions(original);
    }
  };

  const displayedMissions = useMemo(
    () =>
      isCommander
        ? missions
        : missions.filter(
            (m) =>
              m.status === "Proposed" ||
              (m.status === "Active" &&
                m.roles.some((r) => r.assignee?.id === user?.id))
          ),
    [missions, isCommander, user?.id]
  );

  const missionsByStatus = displayedMissions.reduce(
    (acc, m) => {
      (acc[m.status] ||= []).push(m);
      return acc;
    },
    {} as Record<MissionStatus, Mission[]>
  );

  return (
    <main className="relative min-h-screen overflow-hidden p-4 md:p-8">
      <FadeIn>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary/80 animate-pulse" />
            <h1 className="text-3xl font-bold tracking-tight">
              Mission Command
            </h1>
          </div>

          {isCommander && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Propose New Mission
            </Button>
          )}
        </div>
      </FadeIn>

      {loading ? (
        <p className="text-center text-muted-foreground py-16">
          Loading missions...
        </p>
      ) : error ? (
        <p className="text-center text-red-500 py-16">{error}</p>
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCenter}
          modifiers={[snapCenterToCursor]}
        >
          <div
            className={cn(
              "grid gap-4 md:gap-6",
              isCommander ? "md:grid-cols-3" : "md:grid-cols-2"
            )}
          >
            {(["Proposed", "Active", "Completed"] as MissionStatus[]).map(
              (status) => {
                if (!isCommander && status === "Completed") return null;
                const list = missionsByStatus[status] || [];

                return (
                  <MissionColumn key={status} status={status}>
                    <motion.div
                      className="rounded-2xl p-4 border border-border/50 bg-card/40 backdrop-blur-sm"
                      whileHover={{
                        boxShadow: "0 0 18px rgba(59,130,246,0.15)",
                      }}
                    >
                      <div className="flex items-center mb-4 px-2">
                        {statusConfig[status].icon}
                        <h2 className="text-lg font-semibold tracking-tight text-foreground">
                          {statusConfig[status].title}
                        </h2>
                      </div>

                      {/* Independent Scrollable Column */}
                      <SortableContext
                        id={status}
                        items={list.map((m) => m.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div
                          className="space-y-3 overflow-y-auto pr-2"
                          style={{ maxHeight: "calc(100vh - 280px)" }}
                        >
                          <AnimatePresence>
                            {list.length > 0 ? (
                              list.map((m) => (
                                <SortableExpandableMissionCard
                                  key={m.id}
                                  mission={m}
                                  expanded={expandedCardId === m.id}
                                  onToggle={handleExpandToggle}
                                />
                              ))
                            ) : (
                              <div className="text-center text-sm text-muted-foreground py-8 border-2 border-dashed rounded-lg">
                                No missions here.
                              </div>
                            )}
                          </AnimatePresence>
                        </div>
                      </SortableContext>
                    </motion.div>
                  </MissionColumn>
                );
              }
            )}
          </div>

          <DragOverlay>
            {activeMission ? (
              <motion.div className="p-4 rounded-xl bg-card/90 shadow-lg">
                {activeMission.title}
              </motion.div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      <CreateMissionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onMissionCreated={fetchMissions}
      />
    </main>
  );
}
