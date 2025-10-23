// src/app/missions/[missionId]/page.tsx (Definitive, Corrected Version)

"use client";

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getMissionById } from '@/services/api';
import { Mission, MissionRole } from '@/types';
import { useAuth } from '@/context/AuthContext';
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
import { ArrowLeft, Loader2 } from 'lucide-react';

const MissionLoadingState = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground">
        <Loader2 className="h-12 w-12 animate-spin mb-4" />
        <h2 className="text-xl font-semibold">Loading Mission Data...</h2>
        <p>Acquiring tactical overview.</p>
    </div>
);

const RoleCard = ({ 
    role, 
    onDraftClick,
    canDraft
}: { 
    role: MissionRole, 
    onDraftClick: (roleId: string) => void,
    canDraft: boolean 
}) => (
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
          canDraft && <Button size="sm" onClick={() => onDraftClick(role.id)}>Draft Member</Button>
        )}
      </CardContent>
    </Card>
);

export default function MissionDetailPage() { 
  const params = useParams();
  // --- NANO: CRITICAL CORRECTION ---
  // The parameter name now correctly matches the folder name `[missionId]`.
  const missionId = params.missionId as string; 
  // -------------------------------

  const { user } = useAuth();
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [pitchListKey, setPitchListKey] = useState(Date.now());

  useEffect(() => {
    if (!missionId) {
      return; 
    }

    const fetchMission = async () => {
      setLoading(true);
      try {
        const data = await getMissionById(missionId);
        setMission(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching mission:", err);
        setError('Failed to fetch mission details.');
      } finally {
        setLoading(false);
      }
    };

    fetchMission();
  }, [missionId]);

  const handleOpenDraftModal = (roleId: string) => {
    setSelectedRoleId(roleId);
    setIsDraftModalOpen(true);
  };
  
  const handleDraftSuccess = () => {
    if (missionId) {
        const refetch = async () => {
            const data = await getMissionById(missionId);
            setMission(data);
        };
        refetch();
        toast.success("Role assigned successfully.");
    }
    setIsDraftModalOpen(false);
  };

  const handlePitchSuccess = () => {
    toast.success("Pitch submitted! The mission lead has been notified.");
    setPitchListKey(Date.now());
  };

  const isMissionLead = user?.id === mission?.lead_user_id;

  if (loading) return <main className="container mx-auto max-w-4xl py-12 px-4"><MissionLoadingState /></main>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!mission) return <div className="p-8 text-center">Mission not found.</div>;

  return (
    <>
      <main className="container mx-auto max-w-4xl py-12 px-4">
          <div className="mb-6">
            <Button variant="ghost" asChild>
                <Link href="/mission-command" className="text-sm text-primary hover:underline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Mission Command
                </Link>
            </Button>
          </div>
          <header className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">{mission.title}</h1>
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
            {!isMissionLead && <Button onClick={() => setIsPitchModalOpen(true)}>Pitch for this Mission</Button>}
          </header>
          <p className="mb-8 text-lg text-muted-foreground">{mission.description}</p>
          <Separator className="my-8" />
          <section>
            <h2 className="text-2xl font-semibold mb-6">Mission Roles</h2>
            <div className="space-y-4">
              {mission.roles.map((role) => (
                <RoleCard key={role.id} role={role} onDraftClick={handleOpenDraftModal} canDraft={isMissionLead} />
              ))}
            </div>
          </section>
          <Separator className="my-8" />
          <section>
            <h2 className="text-2xl font-semibold mb-6">Aspiration Ledger (Pitches)</h2>
            <PitchList key={pitchListKey} missionId={mission.id} />
          </section>
      </main>

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