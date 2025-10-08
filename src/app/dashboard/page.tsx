// src/app/dashboard/page.tsx (FINAL AND CORRECTED)
// Forcing a fresh Vercel build to pick up new environment variables.
"use client";

import { useEffect, useState, useCallback } from 'react';
import { Mission, MissionStatus } from '@/types';
import { getMissions } from '@/services/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CreateMissionModal } from '@/components/missions/CreateMissionModal';

const getStatusTitle = (status: MissionStatus) => {
  const titles: Record<MissionStatus, string> = {
    Proposed: '🚀 Proposed',
    Active: '🔥 Active',
    Completed: '✅ Completed',
  };
  return titles[status];
};

const MissionCard = ({ mission }: { mission: Mission }) => (
  <Link href={`/missions/${mission.id}`} className="block">
    <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-secondary h-full">
      <CardHeader>
        <CardTitle className="text-lg">{mission.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Lead: {mission.lead.name}</p>
        <p className="text-sm text-muted-foreground">
          {mission.roles.length} role(s)
        </p>
      </CardContent>
    </Card>
  </Link>
);

export default function DashboardPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchMissions = useCallback(async () => {
    try {
      const data = await getMissions();
      setMissions(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch missions. Is the backend server running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  const handleMissionCreated = () => {
    fetchMissions();
  };

  // --- LOGIC MOVED BACK INSIDE ---
  const missionsByStatus = missions.reduce((acc, mission) => {
    if (!acc[mission.status]) {
      acc[mission.status] = [];
    }
    acc[mission.status].push(mission);
    return acc;
  }, {} as Record<MissionStatus, Mission[]>);

  if (loading) return <p className="text-center p-8">Loading missions...</p>;
  if (error) return <p className="text-center text-red-500 p-8">{error}</p>;

  return (
    <>
      <main className="p-8 bg-background min-h-screen text-foreground">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">The Guild Dashboard</h1>
          <Button onClick={() => setIsCreateModalOpen(true)}>Create New Mission</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(['Proposed', 'Active', 'Completed'] as MissionStatus[]).map((status) => (
            <div key={status} className="bg-muted rounded-lg p-4">
              <h2 className="text-2xl font-semibold mb-6 text-center">
                {getStatusTitle(status)}
              </h2>
              <div className="space-y-4">
                {missionsByStatus[status]?.length > 0 ? (
                  missionsByStatus[status].map((mission) => (
                    <MissionCard key={mission.id} mission={mission} />
                  ))
                ) : (
                  <p className="text-muted-foreground text-center">No missions in this stage.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <CreateMissionModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onMissionCreated={handleMissionCreated}
      />
    </>
  );
}