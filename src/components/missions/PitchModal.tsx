// src/components/missions/PitchModal.tsx (Fully Corrected)

"use client";

import { useState } from 'react';
import { pitchForMission } from '@/services/api';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import axios from 'axios';

interface PitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  missionId: string | null;
  onPitchSuccess: () => void;
}

// The user ID is now a constant at the top level of the module.
const PITCHING_USER_ID = "49c731ca-417c-420e-b3a0-cb74d698fe52";

export const PitchModal = ({ isOpen, onClose, missionId, onPitchSuccess }: PitchModalProps) => {
  const [pitchText, setPitchText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async () => {
    if (!missionId || !pitchText.trim()) return;

    setIsSubmitting(true);
    try {
      await pitchForMission(missionId, PITCHING_USER_ID, pitchText);
      onPitchSuccess();
      onClose();
      setPitchText('');
    } catch (error) { // 'error' is of type 'unknown'
      console.error('Failed to submit pitch:', error);
      
      // --- THE TYPE-SAFE FIX IS HERE ---
      // Use the axios type guard to check the error shape
      if (axios.isAxiosError(error) && error.response) {
        // Now TypeScript knows 'error.response' exists
        if (error.response.status === 409) {
          alert("You have already pitched for this mission.");
        } else {
          // For any other API error, show a generic message
          alert(`An API error occurred: ${error.response.statusText}`);
        }
      } else {
        // This handles network errors or other non-API issues
        alert('An unexpected error occurred. Please try again.');
      }
      // ---------------------------------

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
            Explain why you &apos re a great fit for this mission. Your pitch will be visible to the mission lead.
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