"use client"
import { useEffect, useState } from 'react'

type AnimatedNumberProps = {
  value: number
  duration?: number
  prefix?: string
}

export function AnimatedNumber({ value, duration = 2000, prefix = '' }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const endTime = startTime + duration

    const updateNumber = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const current = Math.floor(easeOutQuart * value)
      
      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(updateNumber)
      } else {
        setDisplayValue(value)
      }
    }

    requestAnimationFrame(updateNumber)
  }, [value, duration])

  return (
    <span>
      {prefix}{displayValue.toLocaleString()}
    </span>
  )
} 