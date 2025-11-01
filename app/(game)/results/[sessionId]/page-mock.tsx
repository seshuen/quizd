'use client'

/**
 * Mock version of the Results page for testing without database
 * To use this page:
 * 1. Rename this file to page.tsx (backup the original)
 * 2. Navigate to /results/mock-session-id
 * 3. Restore the original page.tsx when done
 */

import { useRouter } from 'next/navigation'
import { getXPProgress } from '@/lib/utils/xp'
import { FaTrophy, FaClock, FaCheckCircle, FaStar, FaArrowRight } from 'react-icons/fa'

// Mock data for testing
const MOCK_SESSION = {
  id: 'mock-session-123',
  user_id: 'mock-user-456',
  topic_id: 'mock-topic-789',
  score: 825,
  xp_earned: 165,
  questions_answered: 7,
  correct_count: 5,
  total_time_seconds: 52,
  completed_at: new Date().toISOString(),
  topics: {
    title: 'JavaScript Fundamentals',
    slug: 'javascript-fundamentals'
  }
}

const MOCK_ANSWERS = [
  {
    id: 'answer-1',
    question_id: 'q-1',
    user_answer: 'let and const',
    is_correct: true,
    time_taken_ms: 5500,
    points_earned: 145,
    answered_at: new Date().toISOString(),
    questions: {
      question_text: 'What are the two keywords used to declare block-scoped variables in ES6?',
      correct_answer: 'let and const',
      incorrect_answers: ['var and let', 'const and var', 'function and var'],
      explanation: 'ES6 introduced let and const for block-scoped variable declarations, replacing the function-scoped var keyword.'
    }
  },
  {
    id: 'answer-2',
    question_id: 'q-2',
    user_answer: 'Array',
    is_correct: false,
    time_taken_ms: 7200,
    points_earned: 0,
    answered_at: new Date().toISOString(),
    questions: {
      question_text: 'Which JavaScript data structure allows you to store key-value pairs?',
      correct_answer: 'Object',
      incorrect_answers: ['Array', 'Set', 'String'],
      explanation: 'Objects in JavaScript are collections of key-value pairs. While Maps also store key-value pairs, the traditional Object is the most common answer.'
    }
  },
  {
    id: 'answer-3',
    question_id: 'q-3',
    user_answer: 'To handle asynchronous operations',
    is_correct: true,
    time_taken_ms: 4800,
    points_earned: 150,
    answered_at: new Date().toISOString(),
    questions: {
      question_text: 'What is the purpose of Promises in JavaScript?',
      correct_answer: 'To handle asynchronous operations',
      incorrect_answers: ['To create loops', 'To declare variables', 'To define functions'],
      explanation: 'Promises provide a way to handle asynchronous operations in JavaScript, allowing you to write cleaner asynchronous code.'
    }
  },
  {
    id: 'answer-4',
    question_id: 'q-4',
    user_answer: 'function',
    is_correct: true,
    time_taken_ms: 3200,
    points_earned: 150,
    answered_at: new Date().toISOString(),
    questions: {
      question_text: 'What keyword is used to define a function in JavaScript?',
      correct_answer: 'function',
      incorrect_answers: ['func', 'def', 'method'],
      explanation: null
    }
  },
  {
    id: 'answer-5',
    question_id: 'q-5',
    user_answer: 'string',
    is_correct: false,
    time_taken_ms: 9800,
    points_earned: 0,
    answered_at: new Date().toISOString(),
    questions: {
      question_text: 'What does the typeof operator return for an array?',
      correct_answer: 'object',
      incorrect_answers: ['array', 'string', 'list'],
      explanation: 'In JavaScript, arrays are technically objects, so typeof returns "object" for arrays. Use Array.isArray() to check if something is an array.'
    }
  },
  {
    id: 'answer-6',
    question_id: 'q-6',
    user_answer: 'push()',
    is_correct: true,
    time_taken_ms: 6100,
    points_earned: 140,
    answered_at: new Date().toISOString(),
    questions: {
      question_text: 'Which method adds an element to the end of an array?',
      correct_answer: 'push()',
      incorrect_answers: ['pop()', 'shift()', 'unshift()'],
      explanation: 'The push() method adds one or more elements to the end of an array and returns the new length of the array.'
    }
  },
  {
    id: 'answer-7',
    question_id: 'q-7',
    user_answer: 'false',
    is_correct: true,
    time_taken_ms: 4500,
    points_earned: 140,
    answered_at: new Date().toISOString(),
    questions: {
      question_text: 'What is the result of: 0 == false?',
      correct_answer: 'true',
      incorrect_answers: ['false', 'undefined', 'null'],
      explanation: 'In JavaScript, 0 is considered falsy, so 0 == false evaluates to true due to type coercion. Use === for strict equality without type coercion.'
    }
  }
]

// Mock user profile with XP
const MOCK_PROFILE = {
  id: 'mock-user-456',
  username: 'testuser',
  total_xp: 1250,
  level: 5,
  games_played: 23,
  questions_answered: 161,
  correct_answers: 128
}

export default function ResultsPageMock() {
  const router = useRouter()
  const session = MOCK_SESSION
  const answers = MOCK_ANSWERS
  const profile = MOCK_PROFILE

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
        {/* Mock Data Banner */}
        <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 text-center">
          <p className="font-bold text-yellow-800">MOCK DATA MODE</p>
          <p className="text-sm text-yellow-700">This is a test version with sample data</p>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
          <p className="text-gray-600">{session.topics.title}</p>
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

        {/* Mock Data Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-bold text-blue-900 mb-2">Mock Data Details:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>Score: {session.score} / {maxPossibleScore} ({accuracy}% accuracy)</li>
            <li>Questions: {session.correct_count} correct, {session.questions_answered - session.correct_count} incorrect</li>
            <li>Total time: {session.total_time_seconds}s (avg {averageTime}s per question)</li>
            <li>XP earned: +{session.xp_earned} (total: {profile.total_xp})</li>
            <li>User Level: {xpProgress?.level} ({xpProgress?.progress.toFixed(1)}% to next level)</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => alert('Would navigate to: /topics/' + session.topics.slug + '/practice')}
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
