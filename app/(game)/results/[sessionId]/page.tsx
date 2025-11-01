'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { getXPProgress } from '@/lib/utils/xp'
import { Loading } from '@/components/ui/Loading'
import { FaTrophy, FaClock, FaCheckCircle, FaStar, FaArrowRight } from 'react-icons/fa'

interface GameAnswer {
  id: string
  question_id: string
  user_answer: string
  is_correct: boolean
  time_taken_ms: number
  points_earned: number
  answered_at: string
  questions: {
    question_text: string
    correct_answer: string
    incorrect_answers: string[]
    explanation: string | null
  }
}

interface GameSession {
  id: string
  user_id: string
  topic_id: string
  score: number
  xp_earned: number
  questions_answered: number
  correct_count: number
  total_time_seconds: number
  completed_at: string
  topics: {
    name: string
    slug: string
  }
}

export default function ResultsPage() {
  const params = useParams()
  const router = useRouter()
  const { user, profile } = useAuth()
  const [session, setSession] = useState<GameSession | null>(null)
  const [answers, setAnswers] = useState<GameAnswer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) {
        router.push('/login')
        return
      }

      try {
        const supabase = createClient()
        const sessionId = params.sessionId as string

        // Fetch game session
        const { data: sessionData, error: sessionError } = await supabase
          .from('game_sessions')
          .select('*')
          .eq('id', sessionId)
          .eq('user_id', user.id)
          .single()

        if (sessionError) throw sessionError
        if (!sessionData) throw new Error('Session not found')

        // Fetch topic details
        const { data: topicData, error: topicError } = await supabase
          .from('topics')
          .select('name, slug')
          .eq('id', sessionData.topic_id)
          .single()

        if (topicError) throw topicError

        // Fetch game answers
        const { data: answersData, error: answersError } = await supabase
          .from('game_answers')
          .select('*')
          .eq('session_id', sessionId)
          .order('answered_at', { ascending: true })

        if (answersError) throw answersError

        // Fetch question details for each answer
        const questionIds = answersData.map(a => a.question_id).filter(Boolean) as string[]
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('id, question_text, correct_answer, incorrect_answers, explanation')
          .in('id', questionIds)

        if (questionsError) throw questionsError

        // Combine session with topic data
        const combinedSession = {
          ...sessionData,
          topics: topicData
        }

        // Combine answers with question data
        const combinedAnswers = answersData.map(answer => {
          const question = questionsData.find(q => q.id === answer.question_id)
          return {
            ...answer,
            questions: question || {
              question_text: '',
              correct_answer: '',
              incorrect_answers: [],
              explanation: null
            }
          }
        })

        setSession(combinedSession as any)
        setAnswers(combinedAnswers as any)
      } catch (err) {
        console.error('Error fetching results:', err)
        setError('Failed to load results')
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [user, params.sessionId, router])

  if (loading) {
    return <Loading />
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 shadow-sm text-center">
          <p className="text-red-600 mb-4">{error || 'Session not found'}</p>
          <button
            onClick={() => router.push('/topics')}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Back to Topics
          </button>
        </div>
      </div>
    )
  }

  const accuracy = session.questions_answered > 0
    ? Math.round((session.correct_count / session.questions_answered) * 100)
    : 0

  const averageTime = session.questions_answered > 0
    ? Math.round(session.total_time_seconds / session.questions_answered)
    : 0

  const maxPossibleScore = session.questions_answered * 150

  const xpProgress = profile?.total_xp ? getXPProgress(profile.total_xp) : null

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
          <p className="text-gray-600">{session.topics.name}</p>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-4">
              <FaTrophy className="text-4xl text-indigo-600" />
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-2">{session.score}</h2>
            <p className="text-gray-600">out of {maxPossibleScore} points</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <FaCheckCircle className="text-2xl text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{session.correct_count}</p>
              <p className="text-sm text-gray-600">Correct</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <FaCheckCircle className="text-2xl text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {session.questions_answered - session.correct_count}
              </p>
              <p className="text-sm text-gray-600">Incorrect</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <FaClock className="text-2xl text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{averageTime}s</p>
              <p className="text-sm text-gray-600">Avg Time</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <FaStar className="text-2xl text-yellow-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{accuracy}%</p>
              <p className="text-sm text-gray-600">Accuracy</p>
            </div>
          </div>

          {/* XP Earned */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-medium">XP Earned</span>
              <span className="text-2xl font-bold text-indigo-600">+{session.xp_earned}</span>
            </div>
            {xpProgress && (
              <div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Level {xpProgress.level}</span>
                  <span>
                    {xpProgress.currentLevelXP} / {xpProgress.xpForNextLevel} XP
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${xpProgress.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Answer Review */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Answer Review</h3>
          <div className="space-y-4">
            {answers.map((answer, index) => (
              <div
                key={answer.id}
                className={`p-4 rounded-lg border-2 ${
                  answer.is_correct
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 flex-1">
                    Question {index + 1}: {answer.questions.question_text}
                  </h4>
                  <span className={`ml-4 font-bold ${
                    answer.is_correct ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {answer.points_earned} pts
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-2">Your answer:</span>
                    <span className={`font-medium ${
                      answer.is_correct ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {answer.user_answer}
                    </span>
                  </div>

                  {!answer.is_correct && (
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-2">Correct answer:</span>
                      <span className="font-medium text-green-700">
                        {answer.questions.correct_answer}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center text-gray-600">
                    <FaClock className="mr-2" />
                    <span>Answered in {(answer.time_taken_ms / 1000).toFixed(1)}s</span>
                  </div>

                  {answer.questions.explanation && (
                    <div className="mt-2 p-3 bg-white rounded border border-gray-200">
                      <p className="text-gray-700">
                        <span className="font-medium">Explanation: </span>
                        {answer.questions.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push(`/topics/${session.topics.slug}/practice`)}
            className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
          >
            Play Again
            <FaArrowRight className="ml-2" />
          </button>
          <button
            onClick={() => router.push('/topics')}
            className="flex-1 bg-white text-gray-700 py-3 px-6 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Back to Topics
          </button>
        </div>
      </div>
    </div>
  )
}
