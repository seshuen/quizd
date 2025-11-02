'use client'

import { useAuth } from '@/lib/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FaUser, FaTrophy, FaGamepad, FaCheckCircle, FaBullseye, FaLock, FaStar, FaHistory } from 'react-icons/fa'
import { QuizHistoryList } from '@/components/profile/QuizHistoryList'

interface QuizHistoryItem {
  id: string
  score: number | null
  correct_count: number | null
  questions_answered: number | null
  xp_earned: number | null
  total_time_seconds: number | null
  completed_at: string | null
  topics: {
    name: string
    slug: string
  }
}

export default function ProfilePage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [updatingPassword, setUpdatingPassword] = useState(false)
  const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchQuizHistory = async () => {
      if (!user) return

      setLoadingHistory(true)
      try {
        const { data, error } = await supabase
          .from('game_sessions')
          .select(`
            id,
            score,
            correct_count,
            questions_answered,
            xp_earned,
            total_time_seconds,
            completed_at,
            topics!inner(name, slug)
          `)
          .eq('user_id', user.id)
          .eq('completed', true)
          .order('completed_at', { ascending: false })
          .limit(5)

        if (error) {
          console.error('Error fetching quiz history:', error)
          return
        }

        setQuizHistory(data || [])
      } catch (error) {
        console.error('Error fetching quiz history:', error)
      } finally {
        setLoadingHistory(false)
      }
    }

    fetchQuizHistory()
  }, [user, supabase])

  const calculateAccuracy = () => {
    if (!profile || !profile.questions_answered || profile.questions_answered === 0) {
      return 0
    }
    return ((profile.correct_answers || 0) / profile.questions_answered * 100).toFixed(1)
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    setUpdatingPassword(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setPasswordSuccess('Password updated successfully!')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => {
        setShowPasswordModal(false)
        setPasswordSuccess('')
      }, 2000)
    } catch (error) {
      console.error('Error updating password:', error)
      setPasswordError('Failed to update password. Please try again.')
    } finally {
      setUpdatingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <div className="flex items-center gap-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100">
            <FaUser className="h-12 w-12 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{profile.username}</h1>
            {profile.display_name && (
              <p className="text-lg text-gray-600">{profile.display_name}</p>
            )}
            {profile.bio && (
              <p className="mt-2 text-gray-700">{profile.bio}</p>
            )}
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            <FaLock />
            Update Password
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* XP Card */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-full bg-yellow-100 p-3">
              <FaStar className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total XP</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{profile.total_xp || 0}</p>
        </div>

        {/* Level Card */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-3">
              <FaTrophy className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Level</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{profile.level || 1}</p>
        </div>

        {/* Games Played Card */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3">
              <FaGamepad className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Games Played</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{profile.games_played || 0}</p>
        </div>

        {/* Accuracy Card */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-3">
              <FaBullseye className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Accuracy</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{calculateAccuracy()}%</p>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Detailed Statistics</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div className="flex items-center gap-3">
              <FaCheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-gray-700">Correct Answers</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {profile.correct_answers || 0}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div className="flex items-center gap-3">
              <FaGamepad className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">Questions Answered</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {profile.questions_answered || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Quiz History */}
      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaHistory className="h-6 w-6 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Recent Quiz History</h2>
          </div>
          <a
            href="/history"
            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
          >
            View All
          </a>
        </div>
        {loadingHistory ? (
          <div className="rounded-lg bg-white p-8 text-center shadow-md">
            <div className="text-gray-600">Loading quiz history...</div>
          </div>
        ) : (
          <QuizHistoryList quizzes={quizHistory} />
        )}
      </div>

      {/* Password Update Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Update Password</h2>
            <form onSubmit={handleUpdatePassword}>
              <div className="mb-4">
                <label htmlFor="newPassword" className="mb-2 block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                  minLength={6}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                  minLength={6}
                />
              </div>
              {passwordError && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">
                  {passwordSuccess}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                >
                  {updatingPassword ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false)
                    setPasswordError('')
                    setPasswordSuccess('')
                    setNewPassword('')
                    setConfirmPassword('')
                  }}
                  className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
