// src/app/LandingPageClient.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, Library, Users, Shuffle, Eye, Target, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FadeIn } from "@/components/animations/FadeIn";
import { LandingPageClient } from "./LandingPageClient";


export default function LandingPage() {
  return <LandingPageClient />;
}