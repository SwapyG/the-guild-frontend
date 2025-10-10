// src/app/dashboard/page.tsx (Interactive Drag-and-Drop Version)

"use client";

import { useEffect, useState, useCallback } from 'react';
import { Mission, MissionStatus } from '@/types';
import { getMissions, updateMissionStatus } from '@/services/api';
import { Button } from '@/components/ui/button';
import { CreateMissionModal } from '@/components/missions/CreateMissionModal';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { ClipboardList, Activity, CheckCircle2 } from 'lucide-react';
import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { MissionColumn } from '@/components/missions/MissionColumn';
import { SortableMissionCard } from '@/components/missions/SortableMissionCard';
import { toast } from 'react-hot-toast';

const statusConfig: Record<MissionStatus, { title: string; icon: React.ReactNode }> = {
  Proposed: { title: 'Proposed', icon: <ClipboardList className="h-5 w-5 mr-2 text-muted-foreground" /> },
  Active: { title: 'Active', icon: <Activity className="h-5 w-5 mr-2 text-muted-foreground" /> },
  Completed: { title: 'Completed', icon: <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" /> },
};

export default function DashboardPage() {
  const { user } = useAuth();
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
      setError('An error occurred while fetching missions.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const missionId = active.id as string;
    const newStatus = over.id as MissionStatus;

    // Optimistic UI Update: Move the card immediately
    setMissions(currentMissions => {
      const missionToUpdate = currentMissions.find(m => m.id === missionId);
      if (missionToUpdate) {
        missionToUpdate.status = newStatus;
      }
      return [...currentMissions];
    });

    // Call the API to persist the change
    try {
      await updateMissionStatus(missionId, newStatus);
      toast.success('Mission status updated!');
    } catch (error) {
      toast.error('Failed to update mission status. Reverting.');
      console.error(error);
      // Revert the optimistic update on failure
      fetchMissions(); 
    }
  };

  const missionsByStatus = missions.reduce((acc, mission) => {
    if (!acc[mission.status]) acc[mission.status] = [];
    acc[mission.status].push(mission);
    return acc;
  }, {} as Record<MissionStatus, Mission[]>);

  const canCreateMissions = user?.role === 'Manager' || user?.role === 'Admin';

  return (
    <ProtectedRoute>
      <>
        <main className="p-4 md:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">The Guild Dashboard</h1>
            {canCreateMissions && <Button onClick={() => setIsCreateModalOpen(true)}>Create New Mission</Button>}
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground">Loading missions...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(['Proposed', 'Active', 'Completed'] as MissionStatus[]).map((status) => (
                  <MissionColumn key={status} status={status}>
                    <div className="flex items-center mb-6 px-2">
                      {statusConfig[status].icon}
                      <h2 className="text-lg font-semibold tracking-tight text-foreground">
                        {statusConfig[status].title}
                      </h2>
                    </div>
                    <SortableContext items={missionsByStatus[status]?.map(m => m.id) || []} strategy={verticalListSortingStrategy}>
                      <div className="space-y-4">
                        {missionsByStatus[status]?.length > 0 ? (
                          missionsByStatus[status].map((mission) => (
                            <SortableMissionCard key={mission.id} mission={mission} />
                          ))
                        ) : (
                          <div className="text-center text-sm text-muted-foreground py-8 border-2 border-dashed border-border rounded-lg">
                            No missions in this stage.
                          </div>
                        )}
                      </div>
                    </SortableContext>
                  </MissionColumn>
                ))}
              </div>
            </DndContext>
          )}
        </main>

        <CreateMissionModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onMissionCreated={fetchMissions} />
      </>
    </ProtectedRoute>
  );
}