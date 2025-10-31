'use client'

import { useEffect, useState } from 'react'

interface TimerProps {
  duration: number // seconds
  onTimeout: () => void
  paused?: boolean
}

export function Timer({ duration, onTimeout, paused = false }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)

  /*
  * This effect is used to update the time left
  * @throws An error if the time left update fails
  * */
  useEffect(() => {
    if (paused) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(interval)
          onTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [paused, onTimeout])

  /*
  * This function is used to calculate the percentage of the time left
  * @returns The percentage of the time left
  * */
  const percentage = (timeLeft / duration) * 100

  /*
  * This function is used to check if the time left is low
  * @returns The boolean value of the time left
  * */
  const isLow = timeLeft <= 3

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">Time Left</span>
        <span
          className={`text-2xl font-bold ${isLow ? 'text-red-600' : 'text-indigo-600'}`}
        >
          {timeLeft}s
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full transition-all duration-1000 ${
            isLow ? 'bg-red-600' : 'bg-indigo-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}