'use client'

import { useAuth } from '@/lib/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa'

export function Navbar() {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleSignIn = () => {
    router.push('/login')
  }

  const handleBack = () => {
    router.back()
  }

  // Don't show navbar on login/register pages
  if (pathname === '/login' || pathname === '/register') {
    return null
  }

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Back button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
              aria-label="Go back"
            >
              <FaArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
          </div>

          {/* Center - Logo/Brand */}
          <div className="absolute left-1/2 -translate-x-1/2 transform">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              QuizD
            </Link>
          </div>

          {/* Right side - User info and auth button */}
          <div className="flex items-center gap-4">
            {user && profile && (
              <Link
                href="/profile"
                className="hidden text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600 sm:inline"
              >
                {profile.username}
              </Link>
            )}
            {user ? (
              <button
                onClick={handleSignOut}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
