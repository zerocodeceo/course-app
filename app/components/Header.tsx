"use client"
import * as React from 'react'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { navItems } from './MainLayout'

export function Header() {
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <nav className="flex flex-wrap justify-between items-center py-4 px-4 md:px-16 bg-white shadow-sm">
      <div 
        onClick={() => handleNavigation('/')} 
        className="flex items-center cursor-pointer"
      >
        <Image
          src="/logo.png"
          alt="ZeroCodeCEO"
          width={200}
          height={48}
          className="w-[120px] md:w-[200px] h-auto"
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

      <div className="flex items-center gap-2">
        <Button
          onClick={() => router.push('/dashboard')}
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white text-xs whitespace-nowrap px-2 md:px-4"
        >
          Dashboard
        </Button>
      </div>
    </nav>
  )
} 