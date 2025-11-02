'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FaClock, FaTrophy, FaStar, FaBullseye, FaChevronDown, FaChevronUp, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

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

interface ExpandableQuizCardProps {
  quiz: QuizHistoryItem
}

export function ExpandableQuizCard({ quiz }: ExpandableQuizCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const timeAgo = (date: string | null) => {
    if (!date) return 'Unknown'
    const now = new Date()
    const completed = new Date(date)
    const diff = Math.floor((now.getTime() - completed.getTime()) / 1000)

    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  const formatDate = (date: string | null) => {
    if (!date) return 'Unknown'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const accuracy = quiz.questions_answered && quiz.questions_answered > 0
    ? Math.round((quiz.correct_count || 0) / quiz.questions_answered * 100)
    : 0

  const formatTime = (seconds: number | null) => {
    if (!seconds) return '0s'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      <div
        className="flex cursor-pointer items-center justify-between px-4 py-3 sm:px-6"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-1 items-center gap-4 sm:gap-6">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {quiz.topics.name}
            </h3>
            <p className="text-sm text-gray-500">{timeAgo(quiz.completed_at)}</p>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-sm text-gray-600">
            <FaClock className="text-gray-500" />
            <span className="font-medium">{formatTime(quiz.total_time_seconds)}</span>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-600">
            <FaTrophy className="text-indigo-600" />
            <span className="font-medium">{quiz.score || 0} pts</span>
          </div>
        </div>

        <button
          className="ml-4 rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100"
          onClick={(e) => {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
          }}
        >
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Completed on {formatDate(quiz.completed_at)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 sm:grid-cols-4">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center justify-center mb-2">
                <FaStar className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-center text-2xl font-bold text-gray-900">{accuracy}%</p>
              <p className="text-center text-xs text-gray-600">Accuracy</p>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center justify-center mb-2">
                <FaCheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-center text-2xl font-bold text-gray-900">
                {quiz.correct_count || 0}
              </p>
              <p className="text-center text-xs text-gray-600">Correct</p>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center justify-center mb-2">
                <FaTimesCircle className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-center text-2xl font-bold text-gray-900">
                {(quiz.questions_answered || 0) - (quiz.correct_count || 0)}
              </p>
              <p className="text-center text-xs text-gray-600">Incorrect</p>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center justify-center mb-2">
                <FaTrophy className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-center text-2xl font-bold text-gray-900">
                {quiz.xp_earned || 0}
              </p>
              <p className="text-center text-xs text-gray-600">XP Earned</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <FaBullseye className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Questions Answered</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {quiz.questions_answered || 0}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <FaClock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Total Time</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {formatTime(quiz.total_time_seconds)}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <FaTrophy className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Final Score</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {quiz.score || 0} points
              </span>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Link
              href={`/results/${quiz.id}`}
              className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              View Detailed Results
            </Link>
            <Link
              href={`/topics/${quiz.topics.slug}/practice`}
              className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              Play Again
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
