"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { MainLayout } from './components/MainLayout'
import { AnimatedBackground } from './components/AnimatedBackground'
import { API_URL } from './lib/api'

export default function Home() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = () => {
    window.location.href = `${API_URL}/auth/google`
  }

  const handleLogout = () => {
    window.location.href = `${API_URL}/auth/logout`
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

  // Rest of your component code...
}
