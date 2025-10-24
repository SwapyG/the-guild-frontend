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
import { FadeIn } from "@/components/animations/FadeIn";
import { ClipboardCheck } from "lucide-react";
import { toast } from "react-hot-toast";

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
    <Card className="flex flex-col border-border/60 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight">
          {assignment.title}
        </CardTitle>
        <CardDescription>Led by: {assignment.lead.name}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="font-semibold text-sm">Your Role:</p>
        <p className="text-muted-foreground">{roleDescription}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/missions/${assignment.id}`}>Go to Mission</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

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
    // ✅ Fetch only when user is ready
    if (user?.id) {
      fetchAssignments();
    }
  }, [fetchAssignments, user?.id]);

  return (
    <div className="p-4 md:p-8">
      <FadeIn>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          My Assignments
        </h1>
        <p className="text-muted-foreground mb-8">
          These are the active missions you are currently a part of.
        </p>
      </FadeIn>

      <FadeIn delay={0.2}>
        {loading ? (
          <p className="text-center text-muted-foreground py-16">
            Loading Assignments...
          </p>
        ) : assignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((a) => (
              <AssignmentCard key={a.id} assignment={a} userId={user?.id} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <ClipboardCheck className="h-10 w-10 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold">No Active Assignments</h3>
            <p className="text-sm text-muted-foreground">
              Find a new mission in the Opportunities tab.
            </p>
          </div>
        )}
      </FadeIn>
    </div>
  );
}
