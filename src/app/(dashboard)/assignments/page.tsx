// src/app/(dashboard)/assignments/page.tsx (Complete & Final)

"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from "@/context/AuthContext";
import { getMissions } from '@/services/api';
import { Mission } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { FadeIn } from "@/components/animations/FadeIn";
import { ClipboardCheck } from "lucide-react";

const AssignmentCard = ({ assignment }: { assignment: Mission }) => (
    <Card>
      <CardHeader>
        <CardTitle>{assignment.title}</CardTitle>
        <CardDescription>Your Role: <span className="font-semibold">{assignment.roles.find(r => r.assignee?.id === assignment.lead.id)?.role_description || 'Mission Lead'}</span></CardDescription>
      </CardHeader>
      <CardContent className="flex justify-end">
        <Button asChild>
            <Link href={`/missions/${assignment.id}`}>Go to Mission</Link>
        </Button>
      </CardContent>
    </Card>
);

export default function AssignmentsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignments = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const allMissions = await getMissions();
      const myActiveAssignments = allMissions.filter(mission => 
        mission.status === 'Active' && 
        (mission.lead_user_id === user.id || mission.roles.some(role => role.assignee?.id === user.id))
      );
      setAssignments(myActiveAssignments);
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  return (
    <div className="p-4 md:p-8">
      <FadeIn>
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Assignments</h1>
        <p className="text-muted-foreground mb-8">
          These are the active missions you are currently a part of.
        </p>
      </FadeIn>
      <FadeIn delay={0.2}>
        {loading ? (
            <p className="text-center text-muted-foreground py-16">Loading Assignments...</p>
        ) : assignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignments.map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <ClipboardCheck className="h-10 w-10 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold">No Active Assignments</h3>
            <p className="text-sm text-muted-foreground">Your focus is clear. Find a new mission in the Opportunities tab.</p>
          </div>
        )}
      </FadeIn>
    </div>
  );
}