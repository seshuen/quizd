export const XP_CONFIG = {
    LEVEL_BASE: 100,
    LEVEL_MULTIPLIER: 1.5,
  }
  
  export function calculateLevel(totalXP: number): number {
    let level = 1
    let xpNeeded = XP_CONFIG.LEVEL_BASE
  
    while (totalXP >= xpNeeded) {
      totalXP -= xpNeeded
      level++
      xpNeeded = Math.floor(xpNeeded * XP_CONFIG.LEVEL_MULTIPLIER)
    }
  
    return level
  }
  
  export function getXPForLevel(level: number): number {
    let totalXP = 0
    let xpNeeded = XP_CONFIG.LEVEL_BASE
  
    for (let i = 1; i < level; i++) {
      totalXP += xpNeeded
      xpNeeded = Math.floor(xpNeeded * XP_CONFIG.LEVEL_MULTIPLIER)
    }
  
    return totalXP
  }
  
  export function getXPProgress(totalXP: number): {
    level: number
    currentLevelXP: number
    xpForNextLevel: number
    progress: number
  } {
    const level = calculateLevel(totalXP)
    const xpForCurrentLevel = getXPForLevel(level)
    const xpForNextLevel = Math.floor(
      XP_CONFIG.LEVEL_BASE * Math.pow(XP_CONFIG.LEVEL_MULTIPLIER, level - 1)
    )
    const currentLevelXP = totalXP - xpForCurrentLevel
    const progress = (currentLevelXP / xpForNextLevel) * 100
  
    return { level, currentLevelXP, xpForNextLevel, progress }
  }