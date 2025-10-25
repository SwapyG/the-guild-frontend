"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Target, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FadeIn } from "@/components/animations/FadeIn";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function LandingPageClient() {
  const { isAuthenticated } = useAuth();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <main className="flex min-h-screen flex-col items-center bg-transparent text-foreground transition-colors duration-700">
      {/* HERO SECTION */}
      <section className="relative w-full flex flex-col items-center justify-center p-8 md:py-32 text-center">
        <div className="max-w-5xl">
          <FadeIn delay={0.2} direction="down">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              Stop Managing an Org Chart.
              <br />
              <span
                className={`bg-gradient-to-br ${
                  isDark
                    ? "from-sky-300 via-blue-400 to-white"
                    : "from-blue-700 via-sky-600 to-indigo-700"
                } bg-clip-text text-transparent`}
              >
                Start Leading a Guild.
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.4} direction="down">
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              The Guild is the operating system for the future of work — a fluid,
              project-based platform that replaces rigid hierarchies with agile,
              elite teams. Ship faster, eliminate politics, and unlock the true
              potential of your talent.
            </p>
          </FadeIn>

          {/* Frosted Glass Button */}
          <FadeIn delay={0.6} direction="up">
            <motion.div
              className="mt-12 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Link href={isAuthenticated ? "/dashboard" : "/auth/register"}>
                <Button
                  size="lg"
                  className={`
                    relative text-lg px-10 py-6 font-semibold rounded-2xl backdrop-blur-md
                    border transition-all duration-300
                    ${
                      isDark
                        ? "bg-white/10 border-white/20 text-white hover:bg-white/15 hover:border-white/30"
                        : "bg-white/50 border-white/60 text-gray-900 hover:bg-white/70 hover:border-gray-300 shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
                    }
                  `}
                >
                  Watch the 2-Minute Demo
                </Button>
              </Link>
            </motion.div>
          </FadeIn>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section
        className={`relative w-full py-20 px-4 md:px-8 backdrop-blur-md ${
          isDark
            ? "bg-[rgba(15,23,42,0.35)] border-y border-white/10"
            : "bg-[rgba(240,249,255,0.5)] border-y border-blue-100"
        }`}
      >
        <div className="max-w-6xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-12">
              Your Best People are Trapped.
              <br />
              Your Best Projects are Slow.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
            {[
              {
                num: "01",
                title: "The Prison of the Org Chart",
                desc: "Static roles and departments lock your top talent away from the mission-critical projects that need them most.",
              },
              {
                num: "02",
                title: "The Agony of the Bench",
                desc: "Highly skilled employees sit idle between projects, their potential wasting away because the system has no way to see them.",
              },
              {
                num: "03",
                title: "The Politics of Guesswork",
                desc: "Team formation is driven by intuition, not data. The 'usual suspects' get picked, while hidden talent remains unseen.",
              },
            ].map((item, i) => (
              <FadeIn key={item.num} delay={0.2 + i * 0.2}>
                <Card
                  className={`h-full rounded-2xl transition-all duration-500 hover:scale-[1.02] ${
                    isDark
                      ? "bg-[rgba(30,41,59,0.4)] border border-white/10 hover:border-primary/30 shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
                      : "bg-[rgba(255,255,255,0.7)] border border-blue-100 hover:border-primary/40 shadow-[0_8px_25px_rgba(0,0,0,0.1)]"
                  }`}
                >
                  <CardHeader>
                    <span className="text-5xl font-extrabold text-primary/50 mb-2 block">
                      {item.num}
                    </span>
                    <CardTitle className="text-2xl">{item.title}</CardTitle>
                    <CardDescription className="text-base text-muted-foreground pt-2">
                      {item.desc}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section className="w-full py-24 px-4 md:px-8 bg-transparent">
        <div className="max-w-6xl mx-auto text-center space-y-28">
          {[
            {
              icon: Target,
              label: "Mission Control",
              title: "Visualize Every Initiative",
              desc: "Get a real-time, company-wide view of all work-in-progress. The Kanban dashboard shows what's proposed, active, and done.",
              img: "/screenshot-dashboard.png",
              direction: "left",
            },
            {
              icon: Zap,
              label: "Dynamic Teaming",
              title: "Assemble Elite Teams in Minutes",
              desc: "Define the skills you need, not the people you know. Mission leads can instantly draft the best-fit talent, based on data.",
              img: "/screenshot-drafting.png",
              direction: "right",
            },
            {
              icon: Eye,
              label: "Aspiration Ledger",
              title: "Uncover Your Hidden Talent",
              desc: "Your most ambitious people are your greatest asset. Let anyone pitch for missions they’re passionate about — visibility for all.",
              img: "/screenshot-ledger.png",
              direction: "left",
            },
          ].map((s, i) => (
            <div
              key={s.label}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                i % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <FadeIn direction={s.direction === "left" ? "left" : "right"}>
                <div>
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                    {s.label}
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight">{s.title}</h3>
                  <p className="mt-4 text-muted-foreground text-lg">{s.desc}</p>
                </div>
              </FadeIn>
              <FadeIn direction={s.direction === "left" ? "right" : "left"}>
                <div
                  className={`group rounded-2xl border p-2 backdrop-blur-md shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
                    isDark
                      ? "bg-[rgba(30,41,59,0.35)] border-white/10 hover:border-primary/30"
                      : "bg-[rgba(255,255,255,0.8)] border-blue-100 hover:border-primary/30"
                  }`}
                >
                  <Image
                    src={s.img}
                    alt={s.label}
                    width={1200}
                    height={750}
                    className="rounded-xl"
                  />
                </div>
              </FadeIn>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
