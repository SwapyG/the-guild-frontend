// src/components/missions/DraftMemberModal.tsx

"use client";

import { useState, useEffect } from 'react';
import { User } from '@/types';
import { getUsers, draftUserToRole } from '@/services/api';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DraftMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleId: string | null;
  onDraftSuccess: () => void; // Callback to refresh the parent component
}

export const DraftMemberModal = ({ isOpen, onClose, roleId, onDraftSuccess }: DraftMemberModalProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch users only when the modal is opened
    if (isOpen) {
      setLoading(true);
      getUsers()
        .then(setUsers)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleSelectUser = async (userId: string) => {
    if (!roleId) return;

    try {
      await draftUserToRole(roleId, userId);
      onDraftSuccess(); // Notify parent component of success
      onClose(); // Close the modal
    } catch (error) {
      console.error('Failed to draft user:', error);
      // Here you could add user-facing error handling, like a toast notification
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Draft a Guild Member</DialogTitle>
          <DialogDescription>
            Search and select a member to assign to this role.
          </DialogDescription>
        </DialogHeader>
        <Command>
          <CommandInput placeholder="Search for a member..." />
          <CommandList>
            {loading && <div className="p-4 text-sm text-center">Loading members...</div>}
            <CommandEmpty>No members found.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={`${user.name} ${user.email}`} // Value used for searching
                  onSelect={() => handleSelectUser(user.id)}
                  className="flex items-center gap-3"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photo_url} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.title}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};