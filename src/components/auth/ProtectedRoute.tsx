// src/components/auth/ProtectedRoute.tsx

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until the initial authentication check is complete.
    if (!loading) {
      // If the check is done and the user is NOT authenticated, redirect them to the login page.
      if (!isAuthenticated) {
        router.push('/auth/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  // While the authentication check is running, or if the user is not authenticated,
  // show a simple loading state. This prevents the protected content from flashing
  // on the screen before the redirect happens.
  if (loading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        {/* You could replace this with a fancy spinner component later */}
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // If the loading check is complete AND the user is authenticated, render the page.
  return <>{children}</>;
};