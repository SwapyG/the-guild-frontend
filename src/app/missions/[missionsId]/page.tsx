// src/app/missions/[missionId]/page.tsx (FINAL, CORRECTED STATE MANAGEMENT)

"use client";

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getMissionById } from '@/services/api';
import { Mission, MissionRole } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { DraftMemberModal } from '@/components/missions/DraftMemberModal';
import { PitchModal } from '@/components/missions/PitchModal';
import { PitchList } from '@/components/missions/PitchList';

const RoleCard = ({ role, onDraftClick }: { role: MissionRole, onDraftClick: (roleId: string) => void }) => (
    <Card className="bg-secondary">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{role.role_description}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span>Requires: {role.required_skill.name}</span>
            <Badge variant="outline">{role.proficiency_required}</Badge>
          </div>
        </div>
        {role.assignee ? (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={role.assignee.photo_url} alt={role.assignee.name} />
              <AvatarFallback>{role.assignee.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{role.assignee.name}</p>
              <p className="text-xs text-muted-foreground">{role.assignee.title}</p>
            </div>
          </div>
        ) : (
          <Button size="sm" onClick={() => onDraftClick(role.id)}>Draft Member</Button>
        )}
      </CardContent>
    </Card>
);

export default function MissionDetailPage() { 
  const params = useParams();
  const missionId = params.missionsId as string; 

  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);

  // --- THIS IS THE FIX: A state variable to trigger re-renders ---
  const [pitchListKey, setPitchListKey] = useState(Date.now());

  const fetchMission = useCallback(async () => {
    if (!missionId) return;
    try {
      setLoading(true);
      const data = await getMissionById(missionId);
      setMission(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching mission:", err);
      setError('Failed to fetch mission details.');
    } finally {
      setLoading(false);
    }
  }, [missionId]);

  useEffect(() => {
    fetchMission();
  }, [fetchMission]);

  const handleOpenDraftModal = (roleId: string) => {
    setSelectedRoleId(roleId);
    setIsDraftModalOpen(true);
  };
  
  const handleDraftSuccess = () => {
    fetchMission();
  };

  // --- THIS IS THE FIX: Update the key on success ---
  const handlePitchSuccess = () => {
    toast.success("Pitch submitted! The mission lead has been notified.");
    // Update the key to a new value, forcing the PitchList component to re-mount and re-fetch.
    setPitchListKey(Date.now());
  };

  if (loading) return <div className="p-8 text-center">Loading Mission...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!mission) return <div className="p-8 text-center">Mission not found.</div>;

  return (
    <>
      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* ... Header and Roles sections are the same ... */}
          <div className="mb-4">
            <Link href="/dashboard" className="text-sm text-primary hover:underline">
              &larr; Back to Dashboard
            </Link>
          </div>
          <header className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold">{mission.title}</h1>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                <span>Led by:</span>
                <div className="flex items-center gap-2 font-semibold">
                  <Avatar className="h-6 w-6">
                      <AvatarImage src={mission.lead.photo_url} alt={mission.lead.name} />
                      <AvatarFallback>{mission.lead.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{mission.lead.name}</span>
                </div>
              </div>
            </div>
            <Button onClick={() => setIsPitchModalOpen(true)}>Pitch for this Mission</Button>
          </header>
          <p className="mb-8 text-lg text-muted-foreground">{mission.description}</p>
          <Separator className="my-8" />
          <section>
            <h2 className="text-3xl font-semibold mb-6">Mission Roles</h2>
            <div className="space-y-4">
              {mission.roles.map((role) => (
                <RoleCard key={role.id} role={role} onDraftClick={handleOpenDraftModal} />
              ))}
            </div>
          </section>

          <Separator className="my-8" />
          <section>
            <h2 className="text-3xl font-semibold mb-6">Aspiration Ledger (Pitches)</h2>
            {/* --- THIS IS THE FIX: Pass the key to the component --- */}
            <PitchList key={pitchListKey} missionId={mission.id} />
          </section>
        </div>
      </main>

      {/* ... Modals are the same ... */}
       <DraftMemberModal 
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
        roleId={selectedRoleId}
        onDraftSuccess={handleDraftSuccess}
      />
      <PitchModal
        isOpen={isPitchModalOpen}
        onClose={() => setIsPitchModalOpen(false)}
        missionId={mission.id}
        onPitchSuccess={handlePitchSuccess}
      />
    </>
  );
}