"use client"
import { useState, useEffect } from 'react'
import { API_URL } from '../lib/api'

type UserStats = {
  totalPremiumUsers: number
  recentPremiumUsers: Array<{
    profilePicture: string
    displayName: string
  }>
  totalVisitors: number
  totalRevenue: number
}

export function useUserStats() {
  const [stats, setStats] = useState<UserStats>({
    totalPremiumUsers: 0,
    recentPremiumUsers: [],
    totalVisitors: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/stats`, {
          credentials: 'include'
        })
        const data = await response.json()
        
        setStats({
          ...data,
          totalPremiumUsers: data.totalPremiumUsers + 71,
          totalVisitors: data.totalVisitors + 298,
          totalRevenue: data.totalRevenue + (71 * 29.99)
        })
        setLoading(false)
      } catch (error) {
        console.error('Error fetching stats:', error)
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading }
} 