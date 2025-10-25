"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { pitchForMission } from "@/services/api";
import { cn } from "@/lib/utils";

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

  // ✨ Styling constants
  const maxLength = 500;
  const remaining = maxLength - pitchText.length;
  const glowColor = "rgba(59,130,246,0.35)";

  // 🧠 Auto-resize textarea
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [pitchText]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent
            className="sm:max-w-[500px] rounded-2xl border border-border/40 bg-background/80 backdrop-blur-xl shadow-[0_0_40px_rgba(59,130,246,0.15)] overflow-hidden"
          >
            <motion.div
              key="pitch-modal"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative"
            >
              {/* ✨ Animated blue pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                initial={{ opacity: 0, boxShadow: `0 0 0px ${glowColor}` }}
                animate={{
                  opacity: 1,
                  boxShadow: [
                    `0 0 0px ${glowColor}`,
                    `0 0 20px ${glowColor}`,
                    `0 0 0px ${glowColor}`,
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* HEADER */}
              <DialogHeader className="relative z-10">
                <DialogTitle className="text-xl font-semibold tracking-tight">
                  Pitch for this Mission
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Explain why you’re a great fit — your pitch will be visible to
                  the mission lead.
                </DialogDescription>
              </DialogHeader>

              {/* BODY */}
              <div className="relative z-10 grid gap-4 py-4">
                <div className="grid w-full gap-1.5">
                  <Label
                    htmlFor="pitch"
                    className="text-sm font-medium text-foreground/80"
                  >
                    Your Pitch
                  </Label>

                  <motion.div
                    initial={false}
                    animate={{
                      boxShadow:
                        pitchText.length > 0
                          ? `0 0 15px ${glowColor}`
                          : "0 0 0 transparent",
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="rounded-lg border border-border/40 transition-all"
                  >
                    <Textarea
                      ref={textAreaRef}
                      id="pitch"
                      placeholder="I have extensive experience in..."
                      value={pitchText}
                      onChange={(e) => setPitchText(e.target.value)}
                      rows={4}
                      maxLength={maxLength}
                      className="resize-none bg-background/40 focus:ring-2 focus:ring-primary/40 text-sm placeholder:text-muted-foreground/60 border-none"
                    />
                  </motion.div>

                  {/* CHARACTER COUNTER */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: pitchText.length > 0 ? 1 : 0,
                      y: pitchText.length > 0 ? 0 : 4,
                    }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "text-xs text-right mt-1",
                      remaining < 50
                        ? "text-red-400"
                        : "text-muted-foreground/70"
                    )}
                  >
                    {remaining} characters left
                  </motion.p>
                </div>
              </div>

              {/* FOOTER */}
              <DialogFooter className="relative z-10">
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !pitchText.trim()}
                    className="min-w-[130px] rounded-full shadow-md bg-primary/90 hover:bg-primary text-white hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] transition-all"
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
                </motion.div>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};
