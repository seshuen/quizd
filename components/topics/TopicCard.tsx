import Link from 'next/link'
import { Database } from '@/lib/supabase/types'
import { FaQuestionCircle } from 'react-icons/fa'
type Topic = Database['public']['Tables']['topics']['Row']

interface TopicCardProps {
  topic: Topic
}

/*
* This component is used to display a topic card
* @param topic - The topic to display
* @returns The topic card
* */
export function TopicCard({ topic }: TopicCardProps) {
  return (
    <Link href={`/topics/${topic.slug}`}>
      <div className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-500 hover:shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-2xl">
            {topic.icon_url ? (
              <span className="text-2xl" aria-hidden="true">{topic.icon_url}</span>
            ) : (
              <FaQuestionCircle className="text-2xl text-indigo-600" aria-hidden="true" />
            )}
          </div>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {topic.difficulty}
          </span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
          {topic.name}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-gray-600">{topic.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{topic.question_count} questions</span>
          <span>{topic.play_count} plays</span>
        </div>
      </div>
    </Link>
  )
}