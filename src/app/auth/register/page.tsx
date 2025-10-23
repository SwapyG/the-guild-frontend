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
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    if (isAuthenticated) router.push("/dashboard");
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !title || !email || !password)
      return toast.error("Please fill out all fields.");

    setIsLoading(true);
    const payload: RegisterUserPayload = { name, title, email, password };

    try {
      await registerUser(payload);
      toast.success("Account created successfully!");
      const token = await loginUser(email, password);
      await login(token);
    } catch (error) {
      console.error("Registration failed:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response.data.detail || "Registration failed. Please try again."
        );
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-500 ${
        isDark
          ? "bg-[radial-gradient(circle_at_top_left,_#0f172a_0%,_#020617_100%)]"
          : "bg-[radial-gradient(circle_at_top_left,_#e0f2fe_0%,_#ffffff_100%)]"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative backdrop-blur-xl rounded-2xl border shadow-xl w-full max-w-sm transition-all duration-500 ${
          isDark
            ? "bg-[rgba(30,41,59,0.5)] border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.4)]"
            : "bg-[rgba(255,255,255,0.7)] border-blue-100 shadow-[0_0_25px_rgba(0,0,0,0.08)]"
        }`}
      >
        <Card className="bg-transparent border-none shadow-none">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Join The Guild
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Create an account and join the future of work.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="full-name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="full-name"
                  placeholder="Max Robinson"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="focus-visible:ring-2 focus-visible:ring-primary/70 transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title / Role
                </Label>
                <Input
                  id="title"
                  placeholder="Senior Software Engineer"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isLoading}
                  className="focus-visible:ring-2 focus-visible:ring-primary/70 transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="focus-visible:ring-2 focus-visible:ring-primary/70 transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="focus-visible:ring-2 focus-visible:ring-primary/70 transition-all duration-300"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full text-lg py-6 font-semibold rounded-xl shadow-lg ripple-btn animate-[pulse-glow_10s_ease-in-out_infinite] transition-all duration-500 ${
                  isDark
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary/70"
                    : "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500"
                }`}
              >
                {isLoading ? "Creating Account..." : "Create an Account"}
              </Button>

              <Button
                variant="outline"
                className={`w-full font-semibold transition-all duration-300 ${
                  isDark
                    ? "border-white/20 text-slate-200 hover:bg-white/10"
                    : "border-blue-200 text-slate-700 hover:bg-blue-50"
                }`}
                asChild
                disabled={isLoading}
              >
                <Link href="/">Back to Landing Page</Link>
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <Link
                href="/auth/login"
                className={`underline font-medium ${
                  isDark
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-700 hover:text-blue-800"
                }`}
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
