// src/app/LandingPageClient.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, Eye, Target, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FadeIn } from "@/components/animations/FadeIn";
import { useAuth } from "@/context/AuthContext";

export function LandingPageClient() {
  const { isAuthenticated } = useAuth();

  return (
    // Set background to transparent to allow the AnimatedBackground to show through
    <main className="flex min-h-screen flex-col items-center bg-transparent">
      
      {/* --- Hero Section --- */}
      <section className="relative w-full flex flex-col items-center justify-center p-8 md:py-32">
        <div className="max-w-5xl text-center">
          <FadeIn delay={0.2} direction="down">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
              Stop Managing an Org Chart.
              <br />
              <span className="bg-gradient-to-br from-primary via-primary/80 to-foreground/80 bg-clip-text text-transparent">
                Start Leading a Guild.
              </span>
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
            <div className="mt-10 flex justify-center gap-4">
              <Button size="lg" className="text-lg px-8 py-7 shadow-[0_0_20px_hsl(var(--primary)/0.2)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] transition-shadow duration-300">
                <PlayCircle className="mr-3 h-6 w-6" />
                Watch the 2-Minute Demo
              </Button>
            </div>
          </FadeIn>
          {isAuthenticated && (
            <FadeIn delay={0.8} direction="up">
              <div className="mt-6">
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Or, go to the dashboard &rarr;
                </Link>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* --- Problem Section --- */}
      <section className="relative w-full py-20 px-4 md:px-8 bg-secondary/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-12">
              Your Best People are Trapped.
              <br />
              Your Best Projects are Slow.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              { num: "01", title: "The Prison of the Org Chart", desc: "Static roles and departments lock your top talent away from the mission-critical projects that need them most." },
              { num: "02", title: "The Agony of the Bench", desc: "Highly skilled employees sit idle between projects, their potential wasting away because the system has no way to see them." },
              { num: "03", title: "The Politics of Guesswork", desc: "Team formation is driven by intuition, not data. The 'usual suspects' get picked, while hidden talent remains unseen." },
            ].map((item, index) => (
              <FadeIn key={item.num} delay={0.2 + index * 0.2}>
                <Card className="bg-transparent border-0 shadow-none h-full">
                  <CardHeader>
                    <span className="text-5xl font-bold text-primary/40 mb-2">{item.num}</span>
                    <CardTitle className="text-2xl">{item.title}</CardTitle>
                    <CardDescription className="text-base text-muted-foreground pt-2">{item.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* --- Solution Section --- */}
      <section className="w-full py-24 px-4 md:px-8 bg-transparent">
        <div className="max-w-6xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-20">
              Turn Your Company Into a Dynamic Guild
            </h2>
          </FadeIn>
          <div className="space-y-24 text-left">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <FadeIn direction="left">
                <div>
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4"><Target className="h-4 w-4" /> Mission Control</div>
                  <h3 className="text-3xl font-bold tracking-tight">Visualize Every Initiative</h3>
                  <p className="mt-4 text-muted-foreground text-lg">Get a real-time, company-wide view of all work-in-progress. The Kanban dashboard shows what's proposed, what's active, and what's done. No more status update meetings.</p>
                </div>
              </FadeIn>
              <FadeIn direction="right">
                <div className="group rounded-xl border bg-secondary/50 p-2 shadow-2xl shadow-primary/10 transition-all duration-300 hover:shadow-primary/20 hover:border-primary/30">
                  <Image src="/screenshot-dashboard.png" alt="Screenshot of the Mission Dashboard" width={1200} height={750} className="rounded-lg transition-transform duration-300 group-hover:scale-[1.02]" />
                </div>
              </FadeIn>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <FadeIn direction="right" className="lg:order-last">
                <div>
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4"><Zap className="h-4 w-4" /> Dynamic Teaming</div>
                  <h3 className="text-3xl font-bold tracking-tight">Assemble Elite Teams in Minutes</h3>
                  <p className="mt-4 text-muted-foreground text-lg">Define the skills you need, not the people you know. Mission leads can instantly scout and draft the best-fit talent from across the entire organization, based on data.</p>
                </div>
              </FadeIn>
              <FadeIn direction="left">
                <div className="group rounded-xl border bg-secondary/50 p-2 shadow-2xl shadow-primary/10 transition-all duration-300 hover:shadow-primary/20 hover:border-primary/30">
                  <Image src="/screenshot-drafting.png" alt="Screenshot of drafting a member" width={1200} height={750} className="rounded-lg transition-transform duration-300 group-hover:scale-[1.02]" />
                </div>
              </FadeIn>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <FadeIn direction="left">
                <div>
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4"><Eye className="h-4 w-4" /> Aspiration Ledger</div>
                  <h3 className="text-3xl font-bold tracking-tight">Uncover Your Hidden Talent</h3>
                  <p className="mt-4 text-muted-foreground text-lg">Your most ambitious people are your greatest asset. The Guild allows any member to 'pitch' for missions they're passionate about, creating a transparent ledger of aspiration for leaders.</p>
                </div>
              </FadeIn>
              <FadeIn direction="right">
                 <div className="group rounded-xl border bg-secondary/50 p-2 shadow-2xl shadow-primary/10 transition-all duration-300 hover:shadow-primary/20 hover:border-primary/30">
                  <Image src="/screenshot-ledger.png" alt="Screenshot of the Aspiration Ledger" width={1200} height={750} className="rounded-lg transition-transform duration-300 group-hover:scale-[1.02]" />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-24 px-4 md:px-8 bg-secondary/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-12">
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
      
      <section className="w-full py-32 px-4 md:px-8 bg-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
              Ready to Unleash Your Talent?
            </h2>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground">
              Stop managing boxes and start leading missions.
            </p>
            <div className="mt-8">
              <Link href={isAuthenticated ? "/dashboard" : "/auth/register"} passHref>
                <Button size="lg" className="text-lg px-8 py-7 shadow-lg shadow-primary/20 transform transition-transform hover:scale-105">
                  {isAuthenticated ? "Go to Your Dashboard" : "Get Started for Free"}
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}