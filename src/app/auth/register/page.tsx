// src/app/auth/register/page.tsx (Updated with redirect logic)

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { registerUser, loginUser, RegisterUserPayload } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // --- NANO: REDIRECT LOGIC ---
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);
  // ----------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload: RegisterUserPayload = { name, title, email, password };
    
    try {
      await registerUser(payload);
      toast.success("Account created successfully!");
      
      const token = await loginUser(email, password);
      // This now only sets the state. The useEffect will handle the redirect.
      await login(token);
      
    } catch (error) {
      console.error("Registration failed:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.detail || "Registration failed. Please try again.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Join The Guild</CardTitle>
          <CardDescription>
            Enter your information to create an account and join the future of work.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input 
                  id="full-name" placeholder="Max Robinson" required 
                  value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Your Title / Role</Label>
                <Input 
                  id="title" placeholder="Senior Software Engineer" required 
                  value={title} onChange={(e) => setTitle(e.target.value)} disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email" type="email" placeholder="m@example.com" required
                  value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" type="password" required
                  value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create an account"}
              </Button>
              <Button variant="outline" className="w-full" asChild disabled={isLoading}>
                <Link href="/">Back to Landing Page</Link>
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}