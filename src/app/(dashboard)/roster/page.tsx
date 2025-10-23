// src/app/(dashboard)/roster/page.tsx (Corrected)

"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { User, SkillProficiency } from "@/types";
// --- NANO: CRITICAL CORRECTION ---
// Updated to use the correct function names from our API service.
import { getAllUsers, searchUsersBySkill } from "@/services/api";
// --------------------------------
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Search, PlusCircle } from "lucide-react";
import { InviteModal } from "@/components/dashboard/InviteModal";
import { FadeIn } from "@/components/animations/FadeIn";

export default function RosterPage() {
  const { user: currentUser } = useAuth();
  const [skillName, setSkillName] = useState("");
  const [proficiency, setProficiency] = useState<SkillProficiency>("Intermediate");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [userToInvite, setUserToInvite] = useState<User | null>(null);

  const fetchInitialRoster = useCallback(async () => {
    setLoading(true);
    try {
        // --- NANO: CRITICAL CORRECTION ---
        const users = await getAllUsers();
        // --------------------------------
        setResults(users);
    } catch (error) {
        toast.error("Failed to load the Guild Roster.");
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialRoster();
  }, [fetchInitialRoster]);

  const handleSearch = async () => {
    if (!skillName.trim()) {
      fetchInitialRoster();
      return;
    }
    setLoading(true);
    try {
      const users = await searchUsersBySkill(skillName, proficiency);
      setResults(users);
      if (users.length === 0) {
        toast.success("Search complete. No members found with that skill.");
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
      <div className="p-4 md:p-8">
        <FadeIn>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Talent Roster</h1>
            <p className="text-muted-foreground mb-8">
                Browse, search, and deploy members of The Guild.
            </p>
        </FadeIn>

        <FadeIn delay={0.2}>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Search by skill (e.g., Python, React...)"
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
                        <Button onClick={handleSearch} disabled={loading}>
                            <Search className="h-4 w-4 mr-2" />
                            Search
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[60vh] border rounded-md">
                        <div className="p-4">
                        {loading && <p className="text-center text-sm text-muted-foreground pt-16">Scouting the Guild...</p>}
                        
                        {!loading && results.length === 0 && (
                            <div className="text-center text-sm text-muted-foreground pt-16">
                                <Users className="mx-auto h-8 w-8 mb-2" />
                                <p>No members found matching your criteria.</p>
                            </div>
                        )}
                        
                        {!loading && results.length > 0 && (
                            <div className="space-y-4">
                            {results.map(user => (
                                <div key={user.id} className="flex items-center gap-4 p-2 rounded-md hover:bg-accent">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={user.photo_url} alt={user.name} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-semibold">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">{user.title}</p>
                                </div>
                                {canInvite && user.id !== currentUser?.id && (
                                    <Button variant="outline" size="sm" onClick={() => handleOpenInviteModal(user)}>
                                    <PlusCircle className="h-4 w-4 mr-2"/>
                                    Invite to Mission
                                    </Button>
                                )}
                                </div>
                            ))}
                            </div>
                        )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </FadeIn>
      </div>

      <InviteModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        userToInvite={userToInvite}
      />
    </>
  );
}