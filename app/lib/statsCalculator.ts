// Launch date of your platform
export const LAUNCH_DATE = new Date('2024-11-25')
export const BASE_PREMIUM_USERS = 71 // Starting number
export const MAX_PREMIUM_USERS = 75 // Max number
export const PRICE_PER_USER = 29.90 // Price per premium user

export function calculateAdditionalUsers(forDate: Date = new Date()): number {
  const diffTime = Math.abs(forDate.getTime() - LAUNCH_DATE.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  // Faster growth rate since we have less days
  const additionalUsers = diffDays * 0.3 // Adjusted for shorter timeframe
  
  const total = BASE_PREMIUM_USERS + additionalUsers
  return Math.min(total, MAX_PREMIUM_USERS)
}

export function calculateRevenue(): number {
  const currentUsers = calculateAdditionalUsers()
  return currentUsers * PRICE_PER_USER
} 