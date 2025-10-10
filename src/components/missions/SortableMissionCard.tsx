// src/components/missions/SortableMissionCard.tsx (Corrected with Drag Handle)

"use client";

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Mission } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { GripVertical } from 'lucide-react'; // <-- Import the icon

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
    };

    return (
        // The main div is now just for positioning
        <div ref={setNodeRef} style={style}>
            <Card className="bg-card hover:border-primary/50 transition-colors duration-300 relative group">
                {/* The Link now wraps the main content, making it clickable */}
                <Link href={`/missions/${mission.id}`} className="block p-6 pt-12">
                    <CardHeader className="p-0">
                        <CardTitle className="text-lg tracking-tight">{mission.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 pt-2 text-sm text-muted-foreground">
                        <p>Lead: {mission.lead.name}</p>
                    </CardContent>
                    <CardFooter className="p-0 pt-4 text-xs text-muted-foreground">
                        <p>{mission.roles.length} role(s) defined</p>
                    </CardFooter>
                </Link>
                
                {/* THIS IS THE DRAG HANDLE */}
                {/* It sits on top and is the only part that listens for drag events */}
                <div 
                    {...attributes} 
                    {...listeners}
                    className="absolute top-3 right-3 p-1 cursor-grab active:cursor-grabbing text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <GripVertical className="h-5 w-5" />
                </div>
            </Card>
        </div>
    );
};