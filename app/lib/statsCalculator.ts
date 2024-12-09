// Launch date of your platform
export const LAUNCH_DATE = new Date('2024-02-01') // Adjust this to your actual launch date
export const BASE_PREMIUM_USERS = 71 // Base number of premium users

export function calculateAdditionalUsers(): number {
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - LAUNCH_DATE.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  // Generate a consistent random number for each day
  let totalAdditional = 0
  for (let i = 0; i < diffDays; i++) {
    // Use the date as seed for consistency
    const seed = LAUNCH_DATE.getTime() + (i * 24 * 60 * 60 * 1000)
    const randomValue = Math.sin(seed) * 10000
    // Generate number between 2 and 6
    const dailyIncrease = Math.floor(Math.abs(randomValue) % 5) + 2
    totalAdditional += dailyIncrease
  }
  
  return BASE_PREMIUM_USERS + totalAdditional
} 