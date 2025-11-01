import Link from 'next/link'
import { FaTrophy, FaClock, FaStar, FaArrowRight } from 'react-icons/fa'

interface RecentQuiz {
  id: string
  topic_name: string
  topic_slug: string
  score: number
  correct_count: number
  questions_answered: number
  xp_earned: number
  completed_at: string
  total_time_seconds: number
}

interface RecentQuizCardProps {
  quiz: RecentQuiz
}

export function RecentQuizCard({ quiz }: RecentQuizCardProps) {
  const accuracy = quiz.questions_answered > 0
    ? Math.round((quiz.correct_count / quiz.questions_answered) * 100)
    : 0

  const timeAgo = (date: string) => {
    const now = new Date()
    const completed = new Date(date)
    const diff = Math.floor((now.getTime() - completed.getTime()) / 1000)

    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  return (
    <div className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-500 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
            {quiz.topic_name}
          </h3>
          <p className="text-sm text-gray-500">{timeAgo(quiz.completed_at)}</p>
        </div>
        <div className="flex items-center text-indigo-600">
          <FaTrophy className="mr-1" />
          <span className="font-bold">{quiz.score}</span>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-4 text-center">
        <div className="rounded-lg bg-gray-50 p-3">
          <div className="flex items-center justify-center mb-1">
            <FaStar className="text-yellow-500" />
          </div>
          <p className="text-lg font-bold text-gray-900">{accuracy}%</p>
          <p className="text-xs text-gray-600">Accuracy</p>
        </div>

        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-lg font-bold text-gray-900">
            {quiz.correct_count}/{quiz.questions_answered}
          </p>
          <p className="text-xs text-gray-600">Correct</p>
        </div>

        <div className="rounded-lg bg-gray-50 p-3">
          <div className="flex items-center justify-center mb-1">
            <FaClock className="text-indigo-600" />
          </div>
          <p className="text-lg font-bold text-gray-900">{quiz.total_time_seconds}s</p>
          <p className="text-xs text-gray-600">Time</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Link
          href={`/results/${quiz.id}`}
          className="flex-1 bg-white text-gray-700 py-2 px-4 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors text-center"
        >
          View Results
        </Link>
        <Link
          href={`/topics/${quiz.topic_slug}/practice`}
          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
        >
          Play Again
          <FaArrowRight className="ml-2" />
        </Link>
      </div>
    </div>
  )
}
