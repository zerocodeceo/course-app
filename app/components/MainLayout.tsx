"use client"
import * as React from 'react'
import { Footer } from './Footer'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { useAuth } from '../context/AuthContext'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { API_URL } from '../lib/api'

// Define navigation items in a shared location (could be moved to a constants file)
export const navItems = [
  { path: '/', label: 'Home' },
  { path: '/modules', label: 'Modules' },
  { path: '/faq', label: 'FAQ' }
]

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    window.location.href = `${API_URL}/auth/logout`
  }

  const isActive = (path: string) => pathname === path

  const handleNavigation = (path: string) => {
    window.location.href = path
  }

  const handleGoogleLogin = () => {
    console.log('API_URL:', API_URL)
    window.location.href = `${API_URL}/auth/google`
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex justify-between items-center py-4 px-8 md:px-16 bg-white shadow-sm">
        <div 
          onClick={() => handleNavigation('/')} 
          className="flex items-center cursor-pointer"
        >
          <Image
            src="/logo.png"
            alt="ZeroCodeCEO"
            width={200}
            height={48}
            priority
          />
        </div>
        
        <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item, index) => (
            <React.Fragment key={item.path}>
              <button
                onClick={() => handleNavigation(item.path)}
                className={`font-semibold transition-colors ${
                  isActive(item.path) 
                    ? 'text-purple-600' 
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                {item.label}
              </button>
              {index < navItems.length - 1 && (
                <span className="text-purple-300 font-bold">•</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button
                onClick={() => handleNavigation('/dashboard')}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white text-xs"
              >
                Access Dashboard
              </Button>
              <div className="flex items-center gap-2">
                {user.profilePicture && (
                  <Image
                    src={user.profilePicture}
                    alt={user.displayName}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <div className="flex flex-col">
                  <span>{user.displayName}</span>
                  <span className="text-xs text-gray-500">
                    {user.plan === 'basic' ? 'Basic Plan' : 'Premium Plan'}
                  </span>
                </div>
              </div>
              <Button 
                onClick={handleLogout}
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button 
              onClick={handleGoogleLogin}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Login with Google
            </Button>
          )}
        </div>
      </nav>

      <main className="flex-grow container mx-auto py-8">
        {children}
      </main>

      <Footer />
    </div>
  )
} 