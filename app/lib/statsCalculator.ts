// Launch date of your platform
export const LAUNCH_DATE = new Date('2024-03-15')
export const BASE_PREMIUM_USERS = 71 // Starting number

export function calculateAdditionalUsers(): number {
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - LAUNCH_DATE.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  // Simple linear growth: 3 new users per day
  const additionalUsers = diffDays * 3
  
  // Cap the total at a reasonable number (e.g., 150)
  const total = BASE_PREMIUM_USERS + additionalUsers
  return Math.min(total, 150)
} 