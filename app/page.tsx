'use client'

import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold">Hello World</h1>
        {user && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-lg">
              Welcome, {profile?.username || user.email}!
            </p>
            <button
              onClick={handleSignOut}
              className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
