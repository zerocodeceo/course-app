"use client"
import * as React from 'react'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import { navItems } from './MainLayout'
import { API_URL } from '../lib/api'

export function Header() {
  const { user, refreshUser } = useAuth()
  const router = useRouter()

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
    console.log('Starting login process...')
    console.log('Current URL:', window.location.href)
    console.log('API URL:', API_URL)
    console.log('User Agent:', window.navigator.userAgent)
    
    window.location.replace(`${API_URL}/auth/google`)
  }

  return (
    <nav className="flex flex-wrap justify-between items-center py-4 px-4 md:px-16 bg-white shadow-sm">
      <div 
        onClick={() => handleNavigation('/')} 
        className="flex items-center cursor-pointer order-1"
      >
        <Image
          src="/logo.png"
          alt="ZeroCodeCEO"
          width={200}
          height={48}
          className="w-[150px] md:w-[200px] h-auto"
          priority
        />
      </div>
      
      <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
        {navItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <button
              onClick={() => handleNavigation(item.path)}
              className="font-semibold text-gray-700 hover:text-purple-600 transition-colors"
            >
              {item.label}
            </button>
            {index < navItems.length - 1 && (
              <span className="text-purple-300 font-bold">•</span>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 md:gap-4 order-2">
        {user ? (
          <>
            <Button
              onClick={() => handleNavigation('/dashboard')}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white text-xs whitespace-nowrap"
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
                  className="rounded-full hidden md:block"
                />
              )}
              <div className="hidden md:flex flex-col">
                <span className="whitespace-nowrap">{user.displayName}</span>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {user.plan === 'basic' ? 'Basic Plan' : 'Premium Plan'}
                </span>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 text-xs md:text-sm"
            >
              Logout
            </Button>
          </>
        ) : (
          <Button 
            onClick={handleLogin}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Login with Google
          </Button>
        )}
      </div>
    </nav>
  )
} 