// src/app/(dashboard)/invites/page.tsx (Complete & Final Placeholder)

"use client";

import { useEffect, useState, useCallback } from 'react';
import { MissionInvite } from '@/types';
import { getMyInvites, respondToInvite } from '@/services/api'; 
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import { FadeIn } from '@/components/animations/FadeIn';
import { Mail } from 'lucide-react';

export default function InvitationsPage() {
    const [invites, setInvites] = useState<MissionInvite[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchInvites = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getMyInvites();
            setInvites(data);
        } catch (error) {
            toast.error("Failed to load invitations.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInvites();
    }, [fetchInvites]);

    return (
        <div className="p-4 md:p-8">
            <FadeIn>
                <h1 className="text-3xl font-bold tracking-tight mb-2">My Invitations</h1>
                <p className="text-muted-foreground mb-8">
                    Review and respond to invitations from Mission Leads.
                </p>
            </FadeIn>
            <FadeIn delay={0.2}>
                {loading ? (
                    <p className="text-center text-muted-foreground py-16">Loading Invitations...</p>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
                        <Mail className="h-10 w-10 mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">No Pending Invitations</h3>
                        <p className="text-sm text-muted-foreground">When a Mission Lead invites you, it will appear here.</p>
                    </div>
                )}
            </FadeIn>
        </div>
    );
}