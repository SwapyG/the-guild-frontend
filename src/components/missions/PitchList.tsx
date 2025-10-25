"use client";

import { useState, useEffect, useCallback } from "react";
import { getPitchesForMission, updatePitchStatus } from "@/services/api";
import { MissionPitch, PitchStatus } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const statusConfig = {
  Submitted: {
    text: "Submitted",
    className:
      "bg-blue-500/10 text-blue-400 border border-blue-400/20 backdrop-blur-sm",
  },
  Accepted: {
    text: "Accepted",
    className:
      "bg-green-500/10 text-green-400 border border-green-400/20 backdrop-blur-sm",
  },
  Rejected: {
    text: "Rejected",
    className:
      "bg-red-500/10 text-red-400 border border-red-400/20 backdrop-blur-sm",
  },
};

const PitchCard = ({
  pitch,
  isMissionLead,
  onStatusChange,
}: {
  pitch: MissionPitch;
  isMissionLead: boolean;
  onStatusChange: (pitchId: string, status: PitchStatus) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusUpdate = async (status: PitchStatus) => {
    setIsLoading(true);
    await onStatusChange(pitch.id, status);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        className={cn(
          "transition-all border border-border/60 bg-card/40 backdrop-blur-sm shadow-sm hover:shadow-[0_0_25px_rgba(59,130,246,0.1)]",
          pitch.status === "Accepted" && "border-green-400/40",
          pitch.status === "Rejected" && "border-red-400/40"
        )}
      >
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12 border border-border/60">
              <AvatarImage src={pitch.user.photo_url} alt={pitch.user.name} />
              <AvatarFallback className="font-semibold">
                {pitch.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-base">{pitch.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {pitch.user.title}
                  </p>
                </div>
                <Badge
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    statusConfig[pitch.status].className
                  )}
                >
                  {statusConfig[pitch.status].text}
                </Badge>
              </div>

              <p className="mt-3 text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {pitch.pitch_text}
              </p>
            </div>
          </div>
        </CardContent>

        {isMissionLead && pitch.status === "Submitted" && (
          <CardFooter className="gap-3 border-t border-border/40 pt-4">
            <motion.div whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-green-400/30 hover:bg-green-500/10 text-green-400 hover:text-green-300 transition-all"
                onClick={() => handleStatusUpdate("Accepted")}
                disabled={isLoading}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Accept Pitch
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-red-400/30 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all"
                onClick={() => handleStatusUpdate("Rejected")}
                disabled={isLoading}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                Reject Pitch
              </Button>
            </motion.div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export const PitchList = ({
  missionId,
  isMissionLead,
}: {
  missionId: string;
  isMissionLead: boolean;
}) => {
  const [pitches, setPitches] = useState<MissionPitch[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPitches = useCallback(() => {
    if (!missionId) return;
    setLoading(true);
    getPitchesForMission(missionId)
      .then(setPitches)
      .catch(() => toast.error("Failed to load pitches."))
      .finally(() => setLoading(false));
  }, [missionId]);

  useEffect(() => {
    fetchPitches();
  }, [fetchPitches]);

  const handleStatusChange = async (pitchId: string, status: PitchStatus) => {
    const toastId = toast.loading(`Updating pitch to ${status}...`);
    try {
      const updatedPitch = await updatePitchStatus(pitchId, status);
      setPitches((current) =>
        current.map((p) => (p.id === pitchId ? updatedPitch : p))
      );
      toast.success("Pitch status updated!", { id: toastId });
    } catch {
      toast.error("Failed to update pitch.", { id: toastId });
    }
  };

  if (loading)
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 rounded-md bg-muted/10 animate-pulse border border-border/40"
          />
        ))}
      </div>
    );

  if (pitches.length === 0)
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-border/40 rounded-lg bg-card/30 backdrop-blur-sm">
        <p className="text-lg font-medium text-foreground/80">
          No pitches submitted yet.
        </p>
        <p className="text-sm text-muted-foreground">
          Once team members pitch their ideas, they’ll appear here.
        </p>
      </div>
    );

  return (
    <div className="space-y-5">
      <AnimatePresence>
        {pitches.map((pitch) => (
          <PitchCard
            key={pitch.id}
            pitch={pitch}
            isMissionLead={isMissionLead}
            onStatusChange={handleStatusChange}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
