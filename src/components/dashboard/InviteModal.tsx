// src/components/dashboard/InviteModal.tsx

"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { User, Mission } from "@/types";
import { getMissions, createInvite } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToInvite: User | null;
}

interface UnfilledRole {
  roleId: string;
  roleDescription: string;
  missionId: string;
  missionTitle: string;
}

export const InviteModal = ({ isOpen, onClose, userToInvite }: InviteModalProps) => {
  const { user: currentUser } = useAuth();
  const [unfilledRoles, setUnfilledRoles] = useState<UnfilledRole[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && currentUser) {
      setIsLoading(true);
      getMissions()
        .then((allMissions) => {
          const roles: UnfilledRole[] = [];
          allMissions
            .filter((mission) => mission.lead_user_id === currentUser.id) // Only missions led by me
            .forEach((mission) => {
              mission.roles
                .filter((role) => !role.assignee) // Only roles that are not filled
                .forEach((role) => {
                  roles.push({
                    roleId: role.id,
                    roleDescription: role.role_description,
                    missionId: mission.id,
                    missionTitle: mission.title,
                  });
                });
            });
          setUnfilledRoles(roles);
        })
        .catch(() => toast.error("Failed to load your mission roles."))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, currentUser]);

  const handleSendInvite = async () => {
    if (!selectedRoleId || !userToInvite) {
      toast.error("Please select a role for the invitation.");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Sending invitation...");
    try {
      await createInvite({
        mission_role_id: selectedRoleId,
        invited_user_id: userToInvite.id,
      });
      toast.success(`Invitation sent to ${userToInvite.name}!`, { id: toastId });
      onClose();
      setSelectedRoleId("");
    } catch (error: any) {
      const detail = error.response?.data?.detail || "An unexpected error occurred.";
      toast.error(detail, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };
  
  const groupedRoles = unfilledRoles.reduce((acc, role) => {
      acc[role.missionTitle] = acc[role.missionTitle] || [];
      acc[role.missionTitle].push(role);
      return acc;
  }, {} as Record<string, UnfilledRole[]>);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite to Mission</DialogTitle>
          <DialogDescription>
            Select an unfilled role from one of your missions to invite{" "}
            <span className="font-bold">{userToInvite?.name}</span> to.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select onValueChange={setSelectedRoleId} value={selectedRoleId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a mission role..." />
            </SelectTrigger>
            <SelectContent>
                {isLoading && <SelectItem value="loading" disabled>Loading roles...</SelectItem>}
                {!isLoading && unfilledRoles.length === 0 && <SelectItem value="no-roles" disabled>You have no unfilled roles.</SelectItem>}
                {Object.entries(groupedRoles).map(([missionTitle, roles]) => (
                    <SelectGroup key={missionTitle}>
                        <SelectLabel>{missionTitle}</SelectLabel>
                        {roles.map(role => (
                            <SelectItem key={role.roleId} value={role.roleId}>{role.roleDescription}</SelectItem>
                        ))}
                    </SelectGroup>
                ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSendInvite} disabled={isLoading || !selectedRoleId}>
            {isLoading ? "Sending..." : "Send Invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};