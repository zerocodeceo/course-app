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
import { API_URL } from './lib/api'
import { calculateStats } from './lib/statsCalculator'

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { stats, loading: statsLoading } = useUserStats()
  const calculatedStats = calculateStats({
    totalVisitors: (stats.totalPremiumUsers - 2) || 0,
    totalMembers: (stats.totalPremiumUsers - 2) || 0,
    totalRevenue: 0,
    memberGrowth: {
      labels: [],
      data: []
    }
  });

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = () => {
    window.location.href = `${API_URL}/auth/google`
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

  const handleDashboard = () => {
    router.push('/dashboard')
  }

  if (!mounted) {
    return null
  }

  return (
    <MainLayout>
      <div className="flex flex-col">
        <AnimatedBackground />
        <main className="flex-grow flex flex-col items-center text-center px-4 mt-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-1 rounded-full mb-4 animate-fade-in">
            <span className="text-purple-600 text-sm">New</span>
            <span className="text-sm">We&apos;ve made our dashboard with financials and statistics public. Log in and check it out!</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold max-w-3xl mb-4 animate-fade-in-up">
            Build a Web App with AI in 2 days—without typing a single line of code.
          </h1>
          
          <p className="text-gray-600 max-w-xl mb-8 animate-fade-in-up animation-delay-200">
            If you have $30 and 8 hours, check out our video below to learn more.
          </p>

          <div className="w-full max-w-3xl mb-8 animate-fade-in animation-delay-300">
            <div className="relative pt-[56.25%]">
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-xl shadow-lg"
                src="https://www.youtube.com/embed/0BdmVe6GXXI"
                title="Intro to ZeroCodeCEO"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <div className="animate-fade-in-up animation-delay-400">
            <Button 
              onClick={!user ? handleLogin : user.plan === 'premium' ? handleDashboard : handleUpgrade}
              className={`px-8 py-6 text-lg mb-8 transition-transform hover:scale-105 active:scale-95 ${
                user?.plan === 'premium' ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {!user ? 'Start Building Your App Today' : 
               user.plan === 'premium' ? 'Access Dashboard' : 'Start Now'}
            </Button>
          </div>

          <div className="animate-fade-in animation-delay-500 flex items-center gap-4 mb-8">
            <div className="flex -space-x-4">
              {stats.recentPremiumUsers.map((user, i) => (
                <div 
                  key={i}
                  className="relative group"
                >
                  <Image
                    src={user.profilePicture}
                    alt={user.displayName}
                    width={32}
                    height={32}
                    className="rounded-full border-2 border-white transition-transform hover:-translate-y-1"
                  />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {user.displayName}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {'★'.repeat(5)}
              </div>
              <span className="text-sm text-gray-600">
                {statsLoading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  `${calculatedStats.totalMembers}+ students enrolled`
                )}
              </span>
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  )
}
