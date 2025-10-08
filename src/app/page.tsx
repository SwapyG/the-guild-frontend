// src/app/page.tsx

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="max-w-4xl text-center">
        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
          The Operating System for the Post-Job Economy
        </h1>

        {/* Sub-headline / Value Proposition */}
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Unlock corporate agility, boost engagement, and replace office politics
          with a transparent meritocracy. Welcome to The Guild.
        </p>

        {/* Call-to-Action Button */}
        <div className="mt-10">
          <Link href="/dashboard" passHref>
            <Button size="lg" className="text-lg px-8 py-6">
              Launch Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}