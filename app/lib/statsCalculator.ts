// Launch date of your platform
export const LAUNCH_DATE = new Date('2024-03-15')
export const BASE_PREMIUM_USERS = 71 // Starting number
export const MAX_PREMIUM_USERS = 75 // Half of previous max

export function calculateAdditionalUsers(): number {
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - LAUNCH_DATE.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  // Simple linear growth: 1-2 new users per day
  const additionalUsers = diffDays * 1.5
  
  // Cap the total at MAX_PREMIUM_USERS
  const total = BASE_PREMIUM_USERS + additionalUsers
  return Math.min(total, MAX_PREMIUM_USERS)
} 