// src/components/dashboard/TalentScoutWidget.tsx (Upgraded with Invite Functionality)

"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { User, SkillProficiency } from "@/types";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Search, Target, PlusCircle } from "lucide-react";

// NANO: Importing the new modal component.
import { InviteModal } from "./InviteModal";

const searchUsers = async (skillName: string, proficiency: SkillProficiency): Promise<User[]> => {
    const response = await apiClient.get('/users/search', { params: { skill_name: skillName, proficiency } });
    return response.data;
};

export const TalentScoutWidget = () => {
  const { user: currentUser } = useAuth();
  const [skillName, setSkillName] = useState("");
  const [proficiency, setProficiency] = useState<SkillProficiency>("Intermediate");
  const [results, setResults] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(false);

  // NANO: State for managing the invitation modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [userToInvite, setUserToInvite] = useState<User | null>(null);

  const handleSearch = async () => {
    if (!skillName.trim()) {
      toast.error("Please enter a skill to search for.");
      return;
    }
    setLoading(true);
    setResults(null);
    try {
      const users = await searchUsers(skillName, proficiency);
      setResults(users);
      if (users.length === 0) {
        toast.success("Search complete. No members found.");
      }
    } catch (error) {
      toast.error("An error occurred during the search.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenInviteModal = (user: User) => {
      setUserToInvite(user);
      setIsInviteModalOpen(true);
  }

  const canInvite = currentUser?.role === 'Manager' || currentUser?.role === 'Admin';

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            <span>Talent Scout</span>
          </CardTitle>
          <CardDescription>Find and deploy the right talent for your mission.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Input
              placeholder="e.g., Python, React..."
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Select onValueChange={(value) => setProficiency(value as SkillProficiency)} defaultValue={proficiency}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Proficiency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner+</SelectItem>
                <SelectItem value="Intermediate">Intermediate+</SelectItem>
                <SelectItem value="Advanced">Advanced+</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={loading} size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="h-80 border rounded-md">
            <div className="p-4">
              {loading && <p className="text-center text-sm text-muted-foreground">Scouting the Guild...</p>}
              
              {!loading && results === null && (
                <div className="text-center text-sm text-muted-foreground pt-16">
                  <Users className="mx-auto h-8 w-8 mb-2" />
                  <p>Enter a skill to begin your search.</p>
                </div>
              )}

              {!loading && results && results.length === 0 && (
                <div className="text-center text-sm text-muted-foreground pt-16">
                  <Users className="mx-auto h-8 w-8 mb-2" />
                  <p>No members found matching your criteria.</p>
                </div>
              )}
              
              {!loading && results && results.length > 0 && (
                <div className="space-y-3">
                  {results.map(user => (
                    <div key={user.id} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.photo_url} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.title}</p>
                      </div>
                      {/* --- NANO: THE INVITE BUTTON --- */}
                      {canInvite && user.id !== currentUser?.id && (
                        <Button variant="outline" size="sm" onClick={() => handleOpenInviteModal(user)}>
                          <PlusCircle className="h-4 w-4 mr-2"/>
                          Invite
                        </Button>
                      )}
                      {/* ------------------------------- */}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* --- NANO: THE MODAL IS RENDERED HERE --- */}
      <InviteModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        userToInvite={userToInvite}
      />
      {/* -------------------------------------- */}
    </>
  );
};