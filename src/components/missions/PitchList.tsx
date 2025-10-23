"use client";

import { useState, useEffect, memo } from "react";
import { getPitchesForMission } from "@/services/api";
import { MissionPitch } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

const PitchCard = memo(({ pitch }: { pitch: MissionPitch }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.25 }}
  >
    <Card className="bg-card/40 backdrop-blur-sm border border-border/40 hover:border-primary/40 transition-all hover:shadow-lg">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10 border border-border/30">
            <AvatarImage src={pitch.user.photo_url} alt={pitch.user.name} />
            <AvatarFallback>{pitch.user.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="truncate">
                <p className="font-semibold text-base text-foreground">
                  {pitch.user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {pitch.user.title || "Guild Operative"}
                </p>
              </div>
              {/* 🚀 Future: Accept/Reject buttons go here */}
            </div>

            <p className="mt-3 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap break-words">
              {pitch.pitch_text.length > 400
                ? pitch.pitch_text.slice(0, 400) + "..."
                : pitch.pitch_text}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
));

PitchCard.displayName = "PitchCard";

export const PitchList = ({ missionId }: { missionId: string }) => {
  const [pitches, setPitches] = useState<MissionPitch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!missionId) return;
    setLoading(true);
    getPitchesForMission(missionId)
      .then(setPitches)
      .catch((err) => console.error("Failed to fetch pitches:", err))
      .finally(() => setLoading(false));
  }, [missionId]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
        <Loader2 className="animate-spin mr-2 h-4 w-4" />
        Fetching pitches...
      </div>
    );

  if (pitches.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
        <Inbox className="h-8 w-8 mb-2 opacity-60" />
        <p className="text-sm">No pitches submitted yet.</p>
      </div>
    );

  return (
    <div className={cn("space-y-4 overflow-y-auto pr-1 max-h-[80vh]")}>
      <AnimatePresence>
        {pitches.map((pitch) => (
          <PitchCard key={pitch.id} pitch={pitch} />
        ))}
      </AnimatePresence>
    </div>
  );
};
