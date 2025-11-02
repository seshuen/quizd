'use client'

import { useAuth } from '@/lib/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FaHistory } from 'react-icons/fa'
import { ExpandableQuizCard } from '@/components/history/ExpandableQuizCard'
import { Loading } from '@/components/ui/Loading'

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

const ITEMS_PER_PAGE = 10

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  const fetchQuizHistory = useCallback(async (pageNum: number) => {
    if (!user) return

    const isFirstPage = pageNum === 0
    if (isFirstPage) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }

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
        .range(pageNum * ITEMS_PER_PAGE, (pageNum + 1) * ITEMS_PER_PAGE - 1)

      if (error) {
        console.error('Error fetching quiz history:', error)
        return
      }

      const newQuizzes = data || []

      if (isFirstPage) {
        setQuizHistory(newQuizzes)
      } else {
        setQuizHistory(prev => [...prev, ...newQuizzes])
      }

      setHasMore(newQuizzes.length === ITEMS_PER_PAGE)
    } catch (error) {
      console.error('Error fetching quiz history:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [user, supabase])

  useEffect(() => {
    if (user) {
      fetchQuizHistory(0)
    }
  }, [user, fetchQuizHistory])

  useEffect(() => {
    if (!hasMore || loadingMore || loading) return

    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          const nextPage = page + 1
          setPage(nextPage)
          fetchQuizHistory(nextPage)
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, loadingMore, loading, page, fetchQuizHistory])

  if (authLoading || loading) {
    return <Loading />
  }

  if (!user) {
    return null
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FaHistory className="h-8 w-8 text-gray-700" />
          <h1 className="text-3xl font-bold text-gray-900">Quiz History</h1>
        </div>
        <p className="text-gray-600">View all your past quiz attempts</p>
      </div>

      {quizHistory.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow-md">
          <p className="text-gray-600">No quiz history yet. Start playing to see your results here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quizHistory.map((quiz) => (
            <ExpandableQuizCard key={quiz.id} quiz={quiz} />
          ))}

          {hasMore && (
            <div ref={loadMoreRef} className="py-8 text-center">
              {loadingMore ? (
                <div className="text-gray-600">Loading more...</div>
              ) : (
                <div className="text-gray-400 text-sm">Scroll for more</div>
              )}
            </div>
          )}

          {!hasMore && quizHistory.length > 0 && (
            <div className="py-8 text-center text-gray-500 text-sm">
              No more quizzes to load
            </div>
          )}
        </div>
      )}
    </div>
  )
}
