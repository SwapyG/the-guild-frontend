"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { pitchForMission } from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface PitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  missionId: string | null;
  onPitchSuccess: () => void;
}

export const PitchModal = ({
  isOpen,
  onClose,
  missionId,
  onPitchSuccess,
}: PitchModalProps) => {
  const [pitchText, setPitchText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && textAreaRef.current) {
      setTimeout(() => textAreaRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!missionId || !pitchText.trim()) {
      toast.error("Please write your pitch before submitting.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Submitting your pitch...");

    try {
      await pitchForMission(missionId, pitchText.trim());
      toast.success("Pitch submitted successfully!", { id: toastId });
      setPitchText("");
      onPitchSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to submit pitch:", error);
      let message = "An unexpected error occurred. Please try again.";
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409)
          message = "You’ve already pitched for this mission.";
        else if (error.response.status === 401)
          message = "You must be logged in to submit a pitch.";
        else message = error.response.data.detail || message;
      }
      toast.error(message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent className="sm:max-w-[500px] rounded-2xl backdrop-blur-md bg-background/80 border border-border/40 shadow-2xl">
            <motion.div
              key="pitch-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">
                  Pitch for this Mission
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Explain why you’re a great fit — your pitch will be visible to
                  the mission lead.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="pitch">Your Pitch</Label>
                  <Textarea
                    ref={textAreaRef}
                    id="pitch"
                    placeholder="I have extensive experience in..."
                    value={pitchText}
                    onChange={(e) => setPitchText(e.target.value)}
                    rows={6}
                    className="resize-none focus:ring-2 focus:ring-primary/50 border-border/40"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !pitchText.trim()}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Pitch"
                  )}
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};
