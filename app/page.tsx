"use client"
import * as React from 'react'
import { useAuth } from './context/AuthContext'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { useEffect, useState } from 'react'
import { useUserStats } from './hooks/useUserStats'
import { AnimatedBackground } from './components/AnimatedBackground'
import { MainLayout } from './components/MainLayout'

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { stats, loading: statsLoading } = useUserStats()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = () => {
    window.location.href = `${API_URL}/auth/google`
  }

  const handleDashboard = () => {
    router.push('/dashboard')
  }

  const handleUpgrade = async () => {
    try {
      const response = await fetch(`${API_URL}/create-checkout-session`, {
        method: 'POST',
        credentials: 'include',
      })
      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <MainLayout>
      <div className="min-h-screen flex flex-col">
        <AnimatedBackground />
        <main className="flex-grow flex flex-col items-center text-center px-4 mt-20">
          {/* Rest of your main content */}
        </main>
      </div>
    </MainLayout>
  )
}
