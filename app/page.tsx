'use client'

import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold">Hello World</h1>
        {user && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-lg">
              Welcome, {profile?.username || user.email}!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
