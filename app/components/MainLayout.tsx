"use client"
import * as React from 'react'
import { Footer } from './Footer'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { useAuth } from '../context/AuthContext'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { API_URL } from '../lib/api'

export const navItems = [
  { path: '/', label: 'Home' },
  { path: '/modules', label: 'Modules' },
  { path: '/faq', label: 'FAQ' }
]

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, refreshUser } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        credentials: 'include',
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      await refreshUser()
      router.replace('/')
    } catch (error) {
      console.error('Logout error:', error)
      window.location.href = '/'
    }
  }

  const handleNavigation = (path: string) => {
    router.replace(path)
  }

  const handleLogin = () => {
    window.location.href = `${API_URL}/auth/google`
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow" />
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {children}
      <Footer />
    </div>
  )
} 