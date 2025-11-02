'use client'

import { useState, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { calculateScore } from '@/lib/utils/scoring'
import { Database } from '@/lib/supabase/types'

type Question = Database['public']['Tables']['questions']['Row']

interface GameState {
  sessionId: string | null
  questions: Question[]
  currentQuestionIndex: number
  answers: Array<{
    questionId: string
    userAnswer: string
    isCorrect: boolean
    timeTaken: number
    pointsEarned: number
  }>
  score: number
  startTime: number
}

/*
* This hook is used to manage the game state
* @returns The game state
* */
export function useGame() {
  const [gameState, setGameState] = useState<GameState>({
    sessionId: null,
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    score: 0,
    startTime: 0,
  })

  const supabase = useMemo(() => createClient(), [])

  /*
  * This function is used to start a new game
  * @param topicSlug - The slug of the topic
  * @param userId - The ID of the user
  * @returns The ID of the game session
  * */
  const startGame = useCallback(async (topicSlug: string, userId: string) => {
    // First, fetch the topic by slug to get its ID
    const { data: topic, error: topicError } = await supabase
      .from('topics')
      .select('id')
      .eq('slug', topicSlug)
      .single()

    if (topicError || !topic) {
      throw new Error('Topic not found')
    }

    // Fetch 7 random questions for this topic using the topic ID
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('topic_id', topic.id)
      .limit(100)

    if (questionsError || !questions) {
      throw new Error('Failed to load questions')
    }

    // Shuffle and take 7
    const shuffled = questions.sort(() => Math.random() - 0.5).slice(0, 7)

    // Create game session
    const { data: session, error: sessionError } = await supabase
      .from('game_sessions')
      .insert({
        user_id: userId,
        topic_id: topic.id,
        mode: 'practice',
      })
      .select()
      .single()

    if (sessionError || !session) {
      throw new Error('Failed to create game session')
    }

    setGameState({
      sessionId: session.id,
      questions: shuffled,
      currentQuestionIndex: 0,
      answers: [],
      score: 0,
      startTime: Date.now(),
    })

    return session.id
  }, [supabase])

  /*
  * This function is used to submit an answer to a question
  * @param answer - The answer to the question
  * @param timeTaken - The time taken to answer the question
  * @returns The points earned for the answer
  * */
  const submitAnswer = useCallback(
    async (answer: string, timeTaken: number) => {
      // Capture the answer data BEFORE calling setState
      const answerData = await new Promise<{
        isCorrect: boolean
        pointsEarned: number
        sessionId: string | null
        questionId: string
      }>((resolve) => {
        setGameState((prev) => {
          const currentQuestion = prev.questions[prev.currentQuestionIndex]
          const isCorrect = answer === currentQuestion.correct_answer
          const pointsEarned = calculateScore(isCorrect, timeTaken)

          // Resolve with the data we need for DB insert
          resolve({
            isCorrect,
            pointsEarned,
            sessionId: prev.sessionId,
            questionId: currentQuestion.id,
          })

          const newAnswers = [
            ...prev.answers,
            {
              questionId: currentQuestion.id,
              userAnswer: answer,
              isCorrect,
              timeTaken,
              pointsEarned,
            },
          ]

          return {
            ...prev,
            answers: newAnswers,
            score: prev.score + pointsEarned,
            currentQuestionIndex: prev.currentQuestionIndex + 1,
          }
        })
      })

      // Save answer to database AFTER setState completes
      // This ensures insert only happens once, not on every setState re-run
      await supabase.from('game_answers').insert({
        session_id: answerData.sessionId,
        question_id: answerData.questionId,
        user_answer: answer,
        is_correct: answerData.isCorrect,
        time_taken_ms: timeTaken,
        points_earned: answerData.pointsEarned,
      })

      return {
        isCorrect: answerData.isCorrect,
        pointsEarned: answerData.pointsEarned,
      }
    },
    [supabase]
  )

  /*
  * This function is used to finish a game
  * @returns The correct count, total time, and XP earned
  * */
  const finishGame = useCallback(async () => {
    if (!gameState.sessionId) {
      throw new Error('Game session ID is required')
    }
    const correctCount = gameState.answers.filter((a) => a.isCorrect).length
    const totalTime = Math.floor((Date.now() - gameState.startTime) / 1000)
    const xpEarned = Math.floor(gameState.score * 1.5)

    // Update game session
    await supabase
      .from('game_sessions')
      .update({
        score: gameState.score,
        xp_earned: xpEarned,
        questions_answered: gameState.answers.length,
        correct_count: correctCount,
        total_time_seconds: totalTime,
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq('id', gameState.sessionId)

    // Update user profile stats
    const { data: user } = await supabase.auth.getUser()
    if (user.user) {
      await supabase.rpc('update_user_stats', {
        p_user_id: user.user.id,
        p_xp: xpEarned,
        p_questions: gameState.answers.length,
        p_correct: correctCount,
      })
    }

    return { correctCount, totalTime, xpEarned }
  }, [gameState, supabase])

  return {
    gameState,
    startGame,
    submitAnswer,
    finishGame,
  }
}