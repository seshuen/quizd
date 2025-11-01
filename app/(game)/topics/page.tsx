'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TopicGrid } from '@/components/topics/TopicGrid'
import { CategoryFilter } from '@/components/topics/CategoryFilter'
import { Loading } from '@/components/ui/Loading'
import { Database } from '@/lib/supabase/types'

type Topic = Database['public']['Tables']['topics']['Row']

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTopics() {
      const supabase = createClient()
      setLoading(true)
      setError(null)

      try {
        const { data, error: fetchError } = await supabase
          .from('topics')
          .select('*')
          .order('name')

        console.log('Topics fetch result:', { data, error: fetchError })

        if (fetchError) {
          console.error('Error fetching topics:', fetchError)
          setError(`Failed to load topics: ${fetchError.message}`)
        } else {
          console.log('Topics loaded successfully:', data?.length, 'topics')
          setTopics(data || [])
        }
      } catch (err) {
        console.error('Unexpected error fetching topics:', err)
        setError('An unexpected error occurred. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchTopics()
  }, [])

  const filteredTopics = useMemo(() => {
    if (selectedCategory === 'all') {
      return topics
    }
    return topics.filter((t) => t.category === selectedCategory)
  }, [selectedCategory, topics])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Browse Topics</h1>
          <p className="text-gray-600">Choose a topic to start practicing</p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-800">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />

        <TopicGrid topics={filteredTopics} />
      </div>
    </div>
  )
}