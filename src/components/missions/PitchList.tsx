// src/components/missions/PitchList.tsx

"use client";

import { useState, useEffect } from "react";
import { getPitchesForMission } from "@/services/api";
import { MissionPitch } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PitchCard = ({ pitch }: { pitch: MissionPitch }) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarImage src={pitch.user.photo_url} alt={pitch.user.name} />
          <AvatarFallback>{pitch.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{pitch.user.name}</p>
              <p className="text-sm text-muted-foreground">{pitch.user.title}</p>
            </div>
            {/* Future: Add Accept/Reject buttons here */}
          </div>
          <p className="mt-3 text-sm whitespace-pre-wrap">{pitch.pitch_text}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const PitchList = ({ missionId }: { missionId: string }) => {
  const [pitches, setPitches] = useState<MissionPitch[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!missionId) return;
    getPitchesForMission(missionId)
      .then(setPitches)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [missionId]);

  if (loading) return <p className="text-sm text-muted-foreground">Loading pitches...</p>;
  if (pitches.length === 0) return <p className="text-sm text-muted-foreground">No pitches submitted yet.</p>;

  return (
    <div className="space-y-4">
      {pitches.map(pitch => <PitchCard key={pitch.id} pitch={pitch} />)}
    </div>
  );
};