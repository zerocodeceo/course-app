"use client"
import { useState, useEffect } from 'react'
import { API_URL } from '../lib/api'
import { calculateAdditionalUsers } from '../lib/statsCalculator'

type UserStats = {
  totalPremiumUsers: number
  recentPremiumUsers: Array<{
    profilePicture: string
    displayName: string
  }>
}

export function useUserStats() {
  const [stats, setStats] = useState<UserStats>({
    totalPremiumUsers: 0,
    recentPremiumUsers: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/user-stats`, {
          credentials: 'include'
        })
        const data = await response.json()
        
        // Add the calculated additional users to the total
        const additionalUsers = calculateAdditionalUsers()
        data.totalPremiumUsers += additionalUsers

        setStats(data)
      } catch (error) {
        console.error('Error fetching user stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading }
} 