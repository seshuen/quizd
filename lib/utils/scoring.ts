export const SCORE_CONFIG = {
    CORRECT_BASE: 100,
    TIME_BONUS_MAX: 50,
    TIME_LIMIT: 10000, // 10 seconds in ms
  }
  
  export function calculateScore(isCorrect: boolean, timeTaken: number): number {
    if (!isCorrect) return 0
  
    const baseScore = SCORE_CONFIG.CORRECT_BASE
  
    // Calculate time bonus (max 50 points for instant answer, 0 for 10s)
    const timeBonus = Math.max(
      0,
      Math.floor(
        SCORE_CONFIG.TIME_BONUS_MAX *
        (1 - timeTaken / SCORE_CONFIG.TIME_LIMIT)
      )
    )
  
    return baseScore + timeBonus
  }