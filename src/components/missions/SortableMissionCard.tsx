// src/components/missions/SortableMissionCard.tsx

"use client";

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Mission } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

interface SortableMissionCardProps {
    mission: Mission;
}

export const SortableMissionCard = ({ mission }: SortableMissionCardProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: mission.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 'auto',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
             <Link href={`/missions/${mission.id}`} className="block">
                <Card className="bg-card hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 cursor-grab active:cursor-grabbing">
                    <CardHeader>
                        <CardTitle className="text-lg tracking-tight">{mission.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        <p>Lead: {mission.lead.name}</p>
                    </CardContent>
                    <CardFooter className="text-xs text-muted-foreground">
                        <p>{mission.roles.length} role(s) defined</p>
                    </CardFooter>
                </Card>
            </Link>
        </div>
    );
};