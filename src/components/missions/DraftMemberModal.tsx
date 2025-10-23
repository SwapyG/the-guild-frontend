"use client";

import { useState, useEffect } from "react";
import { User } from "@/types";
import { getAllUsers, draftUserToRole } from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface DraftMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleId: string | null;
  onDraftSuccess: () => void;
}

export const DraftMemberModal = ({
  isOpen,
  onClose,
  roleId,
  onDraftSuccess,
}: DraftMemberModalProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getAllUsers()
        .then(setUsers)
        .catch(() => toast.error("Failed to load Guild members."))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleSelectUser = async (userId: string) => {
    if (!roleId) return;
    const toastId = toast.loading("Drafting member...");
    try {
      await draftUserToRole(roleId, userId);
      toast.success("Member drafted successfully!", { id: toastId });
      onDraftSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to draft member.", { id: toastId });
      console.error("Failed to draft user:", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent className="sm:max-w-[440px] max-h-[85vh] overflow-y-auto rounded-2xl backdrop-blur-md border border-border/40 bg-background/80 shadow-xl">
            <motion.div
              key="draft-modal"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <DialogHeader className="pb-2">
                <DialogTitle className="text-lg font-semibold">
                  Draft a Guild Member
                </DialogTitle>
                <DialogDescription>
                  Search and select a member to assign to this role.
                </DialogDescription>
              </DialogHeader>

              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search by name or email..."
                  onValueChange={(value) => setSearchQuery(value)}
                  value={searchQuery}
                />
                <CommandList className="max-h-[300px]">
                  {loading ? (
                    <div className="flex justify-center items-center py-8 text-sm text-muted-foreground">
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Loading members...
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <CommandEmpty>No members found.</CommandEmpty>
                  ) : (
                    <CommandGroup heading="Guild Members">
                      {filteredUsers.map((user) => (
                        <CommandItem
                          key={user.id}
                          value={`${user.name} ${user.email}`}
                          onSelect={() => handleSelectUser(user.id)}
                          className="flex items-center gap-3 cursor-pointer transition hover:bg-accent/60 rounded-md p-2"
                        >
                          <Avatar className="h-8 w-8 border border-border/30">
                            <AvatarImage src={user.photo_url} alt={user.name} />
                            <AvatarFallback>
                              {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">
                              {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {user.title || user.email}
                            </p>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};
