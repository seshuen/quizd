'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loading } from '@/components/ui/Loading'
import { Database } from '@/lib/supabase/types'
import { FaQuestionCircle, FaPlay } from 'react-icons/fa'
import Link from 'next/link'

type Topic = Database['public']['Tables']['topics']['Row']

interface TopicDetailPageProps {
  params: Promise<{
    topicId: string
  }>
}

export default function TopicDetailPage({ params }: TopicDetailPageProps) {
  const resolvedParams = use(params)
  const [topic, setTopic] = useState<Topic | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchTopic() {
      const supabase = createClient()
      setLoading(true)

      try {
        const { data, error: fetchError } = await supabase
          .from('topics')
          .select('*')
          .eq('slug', resolvedParams.topicId)
          .single()

        if (fetchError) {
          console.error('Error fetching topic:', fetchError)
          setError('Topic not found')
        } else {
          setTopic(data)
        }
      } catch (err) {
        console.error('Error:', err)
        setError('Failed to load topic')
      } finally {
        setLoading(false)
      }
    }

    fetchTopic()
  }, [resolvedParams.topicId])

  function handleStartPractice() {
    if (topic) {
      router.push(`/topics/${topic.slug}/practice`)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error || !topic) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center px-4">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Topic Not Found</h2>
          <p className="text-gray-600">{error || 'The topic you are looking for does not exist.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Topic Header */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-indigo-100 text-3xl">
              {topic.icon_url ? (
                <span className="text-3xl" aria-hidden="true">{topic.icon_url}</span>
              ) : (
                <FaQuestionCircle className="text-3xl text-indigo-600" aria-hidden="true" />
              )}
            </div>
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">{topic.name}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="rounded-full bg-gray-100 px-3 py-1 font-medium">
                  {topic.category}
                </span>
                <span className="rounded-full bg-indigo-100 px-3 py-1 font-medium text-indigo-700">
                  {topic.difficulty}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="mb-6 text-lg text-gray-700">{topic.description}</p>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{topic.question_count}</div>
            <div className="text-sm text-gray-600">Questions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{topic.play_count}</div>
            <div className="text-sm text-gray-600">Times Played</div>
          </div>
        </div>

        {/* Start Practice Button */}
        <button
          onClick={handleStartPractice}
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-indigo-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
        >
          <FaPlay />
          Start Practice
        </button>
      </div>

      {/* Additional Info */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">What You'll Practice</h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="mt-1 text-indigo-600">•</span>
            <span>Answer {topic.question_count} questions about {topic.name}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-indigo-600">•</span>
            <span>Test your knowledge with {topic.difficulty} level questions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-indigo-600">•</span>
            <span>Track your progress and improve your skills</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-indigo-600">•</span>
            <span>Earn XP and level up your profile</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
