"use client"
import * as React from 'react'
import { Footer } from './Footer'
import { useEffect, useState } from 'react'
import { Header } from './Header'

export const navItems = [
  { path: '/', label: 'Home' },
  { path: '/modules', label: 'Modules' },
  { path: '/faq', label: 'FAQ' }
]

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
      <Header />
      <div className="flex-grow py-8">
        {children}
      </div>
      <div className="mt-auto py-8">
        <Footer />
      </div>
    </div>
  )
} 