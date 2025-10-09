// src/components/missions/PitchModal.tsx (Corrected for Auth)

"use client";

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { pitchForMission } from '@/services/api';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface PitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  missionId: string | null;
  onPitchSuccess: () => void;
}

// The hardcoded user ID is now completely removed.

export const PitchModal = ({ isOpen, onClose, missionId, onPitchSuccess }: PitchModalProps) => {
  const [pitchText, setPitchText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!missionId || !pitchText.trim()) return;

    setIsSubmitting(true);
    const toastId = toast.loading('Submitting your pitch...');

    try {
      // --- THE FIX IS HERE: No longer passing the user ID ---
      await pitchForMission(missionId, pitchText);
      // ----------------------------------------------------
      
      toast.success('Pitch submitted successfully!', { id: toastId });
      onPitchSuccess();
      onClose();
      setPitchText('');
    } catch (error) {
      console.error('Failed to submit pitch:', error);
      
      let errorMessage = 'An unexpected error occurred.';
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          errorMessage = "You have already pitched for this mission.";
        } else {
          errorMessage = `An API error occurred: ${error.response.data.detail || error.response.statusText}`;
        }
      }
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Pitch for this Mission</DialogTitle>
          <DialogDescription>
            Explain why you're a great fit for this mission. Your pitch will be visible to the mission lead.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="pitch">Your Pitch</Label>
            <Textarea
              id="pitch"
              placeholder="I have extensive experience in..."
              value={pitchText}
              onChange={(e) => setPitchText(e.target.value)}
              rows={6}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting || !pitchText.trim()}>
            {isSubmitting ? 'Submitting...' : 'Submit Pitch'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};