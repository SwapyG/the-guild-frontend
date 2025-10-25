"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getMissions } from "@/services/api";
import { Mission } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ClipboardCheck, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

// ===== Individual Assignment Card =====
const AssignmentCard = ({
  assignment,
  userId,
}: {
  assignment: Mission;
  userId: string | undefined;
}) => {
  const myRole = assignment.roles.find((r) => r.assignee?.id === userId);
  const roleDescription =
    assignment.lead_user_id === userId
      ? "Mission Lead"
      : myRole?.role_description || "Assigned Member";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
      transition={{ type: "spring", stiffness: 80 }}
    >
      <Card className="group flex flex-col border-border/50 bg-card/50 backdrop-blur-md hover:border-primary/40 hover:shadow-[0_0_30px_-10px_var(--primary)] transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
            {assignment.title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Led by: {assignment.lead.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="font-semibold text-sm">Your Role</p>
          <p className="text-muted-foreground">{roleDescription}</p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full" variant="outline">
            <Link href={`/missions/${assignment.id}`}>Go to Mission</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// ===== Main Page =====
export default function AssignmentsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignments = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);

    try {
      const allMissions = await getMissions();

      if (!allMissions || allMissions.length === 0) {
        setAssignments([]);
        return;
      }

      const myAssignments = allMissions.filter(
        (mission) =>
          mission.status === "Active" &&
          (mission.lead_user_id === user.id ||
            mission.roles.some((role) => role.assignee?.id === user.id))
      );

      setAssignments(myAssignments);
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
      toast.error("Failed to load assignments.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) fetchAssignments();
  }, [fetchAssignments, user?.id]);

  return (
    <div className="relative p-6 md:p-10 overflow-hidden">
      {/* === Cinematic Gradient Background === */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/80 to-background" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_60%)]" />

      {/* === Page Header === */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
          My Assignments
        </h1>
        <p className="text-muted-foreground">
          These are the active missions you are currently a part of.
        </p>
      </motion.div>

      {/* === Content Section === */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-3 text-primary" />
          Loading Assignments...
        </div>
      ) : assignments.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08 },
            },
          }}
        >
          {assignments.map((a) => (
            <AssignmentCard key={a.id} assignment={a} userId={user?.id} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border/40 rounded-xl bg-card/40 backdrop-blur-sm"
        >
          <ClipboardCheck className="h-12 w-12 mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold">No Active Assignments</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Find a new mission in the <span className="font-medium">Opportunities</span> tab.
          </p>
        </motion.div>
      )}
    </div>
  );
}
