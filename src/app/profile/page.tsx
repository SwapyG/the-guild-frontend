// src/app/profile/page.tsx

"use client";

import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// We will create this component in the next step
import { SkillManager } from "@/components/profile/SkillManager";

export default function ProfilePage() {
  const { user } = useAuth();

  // The ProtectedRoute handles the loading/unauthenticated state,
  // so we can safely assume 'user' exists here.
  if (!user) {
    return (
        <ProtectedRoute>
            <div>Loading Profile...</div>
        </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="container mx-auto max-w-4xl py-12 px-4">
        {/* User Header Section */}
        <div className="flex items-center space-x-6">
          <Avatar className="h-24 w-24 border">
            <AvatarImage src={user.photo_url || ""} alt={user.name} />
            <AvatarFallback className="text-3xl">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{user.name}</h1>
            <p className="text-xl text-muted-foreground">{user.title}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Skill Ledger Section */}
        <Card>
          <CardHeader>
            <CardTitle>My Skill Ledger</CardTitle>
            <CardDescription>
              This is your professional inventory. Add skills you possess and set your
              proficiency to make yourself discoverable for new missions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* The SkillManager will handle all the interactive logic */}
            <SkillManager initialSkills={user.skills} />
          </CardContent>
        </Card>
      </main>
    </ProtectedRoute>
  );
}