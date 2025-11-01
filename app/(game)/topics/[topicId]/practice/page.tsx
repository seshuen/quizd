'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useGame } from '@/hooks/useGame'
import { QuestionCard } from '@/components/game/QuestionCard'
import { AnswerButton } from '@/components/game/AnswerButton'
import { Timer } from '@/components/game/Timer'
import { Loading } from '@/components/ui/Loading'

interface PracticePageProps {
  params: Promise<{
    topicId: string
  }>
}

/*
* This page is used to practice a topic
* @returns The practice page
* */
export default function PracticePage({ params }: PracticePageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const { gameState, startGame, submitAnswer, finishGame } = useGame()
  const [loading, setLoading] = useState(true)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())

  useEffect(() => {
    if (user) {
      initGame()
    }
  }, [user])

  /*
  * This function is used to initialize the game
  * @throws An error if the game initialization fails
  * */
  async function initGame() {
    try {
      await startGame(resolvedParams.topicId, user!.id)
      setQuestionStartTime(Date.now())
    } catch (error) {
      console.error('Failed to start game:', error)
    } finally {
      setLoading(false)
    }
  }

  /*
  * This function is used to handle the selection of an answer
  * @param answer - The answer to the question
  * @throws An error if the answer selection fails
  * */
  async function handleAnswerSelect(answer: string) {
    if (showResult) return

    setSelectedAnswer(answer)
    const timeTaken = Date.now() - questionStartTime

    const { isCorrect } = await submitAnswer(answer, timeTaken)
    setShowResult(true)

    // Move to next question after 2 seconds
    setTimeout(() => {
      if (gameState.currentQuestionIndex >= 6) {
        // Game finished
        completeGame()
      } else {
        setSelectedAnswer(null)
        setShowResult(false)
        setQuestionStartTime(Date.now())
      }
    }, 2000)
  }

  /*
  * This function is used to handle the timeout of a question
  * @throws An error if the timeout fails
  * */
  async function handleTimeout() {
    await handleAnswerSelect('') // Empty answer for timeout
  }

  /*
  * This function is used to complete the game
  * @throws An error if the game completion fails
  * */
  async function completeGame() {
    const results = await finishGame()
    router.push(`/results/${gameState.sessionId}`)
  }

  if (loading || !gameState.questions.length) {
    return <Loading />
  }

  // Check if game is complete (after last question is answered)
  if (gameState.currentQuestionIndex >= gameState.questions.length) {
    return <Loading />
  }

  const currentQuestion = gameState.questions[gameState.currentQuestionIndex]
  const allAnswers = [
    currentQuestion.correct_answer,
    ...currentQuestion.incorrect_answers,
  ].sort(() => Math.random() - 0.5)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Timer
        key={gameState.currentQuestionIndex}
        duration={10}
        onTimeout={handleTimeout}
        paused={showResult}
      />

      <QuestionCard
        questionText={currentQuestion.question_text}
        questionNumber={gameState.currentQuestionIndex + 1}
        totalQuestions={7}
      />

      <div className="space-y-3">
        {allAnswers.map((answer) => (
          <AnswerButton
            key={answer}
            answer={answer}
            onClick={() => handleAnswerSelect(answer)}
            disabled={showResult}
            selected={selectedAnswer === answer}
            isCorrect={answer === currentQuestion.correct_answer}
            showResult={showResult}
          />
        ))}
      </div>

      <div className="mt-6 text-center">
        <div className="text-3xl font-bold text-indigo-600">
          Score: {gameState.score}
        </div>
      </div>
    </div>
  )
}