// src/app/dashboard/page.tsx (With Role-Based UI)

"use client";

import { useEffect, useState, useCallback } from 'react';
import { Mission, MissionStatus } from '@/types';
import { getMissions } from '@/services/api';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CreateMissionModal } from '@/components/missions/CreateMissionModal';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext'; // <-- 1. Import useAuth
import { ClipboardList, Activity, CheckCircle2 } from 'lucide-react';

const statusConfig: Record<MissionStatus, { title: string; icon: React.ReactNode }> = {
  Proposed: { title: 'Proposed', icon: <ClipboardList className="h-5 w-5 mr-2 text-muted-foreground" /> },
  Active: { title: 'Active', icon: <Activity className="h-5 w-5 mr-2 text-muted-foreground" /> },
  Completed: { title: 'Completed', icon: <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" /> },
};

const MissionCard = ({ mission }: { mission: Mission }) => (
  <Link href={`/missions/${mission.id}`} className="block">
    <Card className="h-full bg-card hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
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
  </Link>
);

export default function DashboardPage() {
  const { user } = useAuth(); // <-- 2. Get the user from the context
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
      setError('Failed to fetch missions. Please check if the backend server is running and you are logged in.');
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

  const missionsByStatus = missions.reduce((acc, mission) => {
    if (!acc[mission.status]) acc[mission.status] = [];
    acc[mission.status].push(mission);
    return acc;
  }, {} as Record<MissionStatus, Mission[]>);

  // Determine if the user has permission to create missions
  const canCreateMissions = user?.role === 'Manager' || user?.role === 'Admin';

  return (
    <ProtectedRoute>
      <>
        <main className="p-4 md:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">The Guild Dashboard</h1>
            
            {/* --- 3. THIS IS THE FIX --- */}
            {/* Only render the button if the user has the correct role */}
            {canCreateMissions && (
              <Button onClick={() => setIsCreateModalOpen(true)}>Create New Mission</Button>
            )}
            {/* ------------------------- */}

          </div>

          {loading ? (
            <p className="text-center text-muted-foreground">Loading missions...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(['Proposed', 'Active', 'Completed'] as MissionStatus[]).map((status) => (
                <div key={status} className="bg-secondary/50 rounded-lg p-4">
                  <div className="flex items-center mb-6 px-2">
                    {statusConfig[status].icon}
                    <h2 className="text-lg font-semibold tracking-tight text-foreground">
                      {statusConfig[status].title}
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {missionsByStatus[status]?.length > 0 ? (
                      missionsByStatus[status].map((mission) => (
                        <MissionCard key={mission.id} mission={mission} />
                      ))
                    ) : (
                      <div className="text-center text-sm text-muted-foreground py-8">
                        No missions in this stage.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <CreateMissionModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onMissionCreated={handleMissionCreated}
        />
      </>
    </ProtectedRoute>
  );
}