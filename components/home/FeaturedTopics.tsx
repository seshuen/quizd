import { TopicCard } from '@/components/topics/TopicCard'
import { Database } from '@/lib/supabase/types'

type Topic = Database['public']['Tables']['topics']['Row']

interface FeaturedTopicsProps {
  topics: Topic[]
}

export function FeaturedTopics({ topics }: FeaturedTopicsProps) {
  if (topics.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <p className="text-gray-500">No featured topics available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {topics.map((topic) => (
        <TopicCard key={topic.id} topic={topic} />
      ))}
    </div>
  )
}
