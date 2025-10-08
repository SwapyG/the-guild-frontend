// src/app/LandingPageClient.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, Library, Users, Shuffle, Eye, Target, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FadeIn } from "@/components/animations/FadeIn";

export function LandingPageClient() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background">
      
      {/* --- Hero Section --- */}
      <section className="w-full flex flex-col items-center justify-center p-8 md:py-24 bg-background">
        <div className="max-w-5xl text-center">
          <FadeIn delay={0.2} direction="down">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent pb-2">
              Stop Managing an Org Chart. Start Leading a Guild.
            </h1>
          </FadeIn>
          <FadeIn delay={0.4} direction="down">
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              The Guild is the operating system for the future of work. A fluid,
              project-based platform that replaces rigid hierarchies with agile,
              elite teams. Ship faster, eliminate politics, and unlock the true
              potential of your talent.
            </p>
          </FadeIn>
          <FadeIn delay={0.6} direction="down">
            <div className="mt-10 flex justify-center">
              <Button size="lg" className="text-lg px-8 py-7 shadow-lg shadow-primary/20 transform transition-transform hover:scale-105">
                <PlayCircle className="mr-3 h-6 w-6" />
                Watch the 2-Minute Demo
              </Button>
            </div>
          </FadeIn>
          <FadeIn delay={0.8} direction="up">
            <div className="mt-6">
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Or, go to the dashboard &rarr;
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* --- Problem Section --- */}
      <section className="w-full py-16 px-4 md:px-8 bg-secondary">
        <div className="max-w-6xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-12">
              Your Best People are Trapped.
              <br />
              Your Best Projects are Slow.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <FadeIn delay={0.2}>
              <Card className="border-border/60 hover:border-primary transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <CardHeader>
                  <div className="mb-4">
                    <Library className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle>The Prison of the Org Chart</CardTitle>
                  <CardDescription>
                    Static roles and rigid departments lock your top talent away from
                    the mission-critical projects that need them most. Innovation
                    stalls at the departmental dotted line.
                  </CardDescription>
                </CardHeader>
              </Card>
            </FadeIn>
            <FadeIn delay={0.4}>
              <Card className="border-border/60 hover:border-primary transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <CardHeader>
                  <div className="mb-4">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle>The Agony of the Bench</CardTitle>
                  <CardDescription>
                    Highly skilled (and expensive) employees sit idle between
                    projects, their potential wasting away. You know they can do
                    more, but the system has no way to see them.
                  </CardDescription>
                </CardHeader>
              </Card>
            </FadeIn>
            <FadeIn delay={0.6}>
              <Card className="border-border/60 hover:border-primary transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <CardHeader>
                  <div className="mb-4">
                    <Shuffle className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle>The Politics of Guesswork</CardTitle>
                  <CardDescription>
                    Team formation is driven by manager intuition and personal
                    networks, not data. The "usual suspects" get picked, while
                    hidden talent and high-potential members remain unseen.
                  </CardDescription>
                </CardHeader>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* --- Solution Section --- */}
      <section className="w-full py-24 px-4 md:px-8 bg-background">
        <div className="max-w-6xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-16">
              Turn Your Company Into a Dynamic Guild.
            </h2>
          </FadeIn>
          <div className="space-y-20 text-left">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <FadeIn direction="left">
                <div>
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                    <Target className="h-4 w-4" /> Mission Control
                  </div>
                  <h3 className="text-3xl font-bold">Visualize Every Initiative.</h3>
                  <p className="mt-4 text-muted-foreground text-lg">
                    Get a real-time, company-wide view of all work-in-progress.
                    The Kanban dashboard shows what's proposed, what's active, and
                    what's done. No more status update meetings.
                  </p>
                </div>
              </FadeIn>
              <FadeIn direction="right">
                <div className="rounded-lg border bg-secondary p-2 shadow-lg transform transition-transform hover:scale-105">
                  <Image src="/screenshot-dashboard.png" alt="Screenshot of the Mission Dashboard" width={1200} height={750} className="rounded-md" />
                </div>
              </FadeIn>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <FadeIn direction="right">
                <div className="lg:order-last">
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                    <Zap className="h-4 w-4" /> Dynamic Teaming
                  </div>
                  <h3 className="text-3xl font-bold">Assemble Elite Teams in Minutes.</h3>
                  <p className="mt-4 text-muted-foreground text-lg">
                    Define the skills you need, not the people you know.
                    Mission leads can instantly scout and draft the best-fit
                    talent from across the entire organization, based on data, not
                    politics.
                  </p>
                </div>
              </FadeIn>
              <FadeIn direction="left">
                <div className="rounded-lg border bg-secondary p-2 shadow-lg transform transition-transform hover:scale-105">
                  <Image src="/screenshot-drafting.png" alt="Screenshot of drafting a member" width={1200} height={750} className="rounded-md" />
                </div>
              </FadeIn>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <FadeIn direction="left">
                <div>
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                    <Eye className="h-4 w-4" /> Aspiration Ledger
                  </div>
                  <h3 className="text-3xl font-bold">Uncover Your Hidden Talent.</h3>
                  <p className="mt-4 text-muted-foreground text-lg">
                    Your most ambitious people are your greatest asset. The Guild
                    allows any member to 'pitch' for missions they're passionate
                    about, creating a transparent ledger of aspiration for leaders
                    to see.
                  </p>
                </div>
              </FadeIn>
              <FadeIn direction="right">
                <div className="rounded-lg border bg-secondary p-2 shadow-lg transform transition-transform hover:scale-105">
                  <Image src="/screenshot-ledger.png" alt="Screenshot of the Aspiration Ledger" width={1200} height={750} className="rounded-md" />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* --- How-It-Works Section --- */}
      <section className="w-full py-24 px-4 md:px-8 bg-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-12">
              Get Started in Three Steps
            </h2>
          </FadeIn>
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-16 text-left">
            <FadeIn delay={0.2} className="flex-1">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-2xl shrink-0">1</div>
                <div>
                  <h3 className="text-2xl font-semibold">Propose a Mission</h3>
                  <p className="mt-2 text-muted-foreground">Any leader can propose a new mission, defining the objectives and the skills required to achieve victory.</p>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.4} className="flex-1">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-2xl shrink-0">2</div>
                <div>
                  <h3 className="text-2xl font-semibold">Assemble Your Guild</h3>
                  <p className="mt-2 text-muted-foreground">Instantly draft members from the internal talent pool, or let passionate members pitch to join your cause.</p>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.6} className="flex-1">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-2xl shrink-0">3</div>
                <div>
                  <h3 className="text-2xl font-semibold">Execute & Win</h3>
                  <p className="mt-2 text-muted-foreground">With the right team assembled, execute with speed and agility. Track progress and celebrate success.</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      
      {/* --- Final CTA Section --- */}
      <section className="w-full py-24 px-4 md:px-8 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Ready to Unleash Your Talent?
            </h2>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground">
              Stop managing boxes and start leading missions.
            </p>
            <div className="mt-8">
              <Link href="/dashboard" passHref>
                <Button size="lg" className="text-lg px-8 py-7 shadow-lg shadow-primary/20 transform transition-transform hover:scale-105">
                  Launch The Guild
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

    </main>
  );
}