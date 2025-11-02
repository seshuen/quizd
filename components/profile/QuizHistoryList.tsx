import Link from 'next/link'
import { FaClock, FaTrophy } from 'react-icons/fa'

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

interface QuizHistoryListProps {
  quizzes: QuizHistoryItem[]
}

export function QuizHistoryList({ quizzes }: QuizHistoryListProps) {
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

  if (quizzes.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow-md">
        <p className="text-gray-600">No quiz history yet. Start playing to see your results here!</p>
        <Link
          href="/topics"
          className="mt-4 inline-block rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Browse Topics
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {quizzes.map((quiz) => (
        <div
          key={quiz.id}
          className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all hover:border-indigo-500 hover:shadow-md"
        >
          <div className="flex flex-1 items-center gap-6">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600">
                {quiz.topics.name}
              </h3>
            </div>

            <div className="flex items-center gap-1 text-sm text-gray-600">
              <FaClock className="text-gray-500" />
              <span className="font-medium">{timeAgo(quiz.completed_at)}</span>
            </div>

            <div className="flex items-center gap-1 text-sm text-gray-600">
              <FaTrophy className="text-indigo-600" />
              <span className="font-medium">{quiz.score || 0} pts</span>
            </div>
          </div>

          <Link
            href={`/results/${quiz.id}`}
            className="ml-4 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            View Results
          </Link>
        </div>
      ))}
    </div>
  )
}
