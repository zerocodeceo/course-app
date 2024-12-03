"use client"
import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { navItems } from './MainLayout'

export function Footer() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isActive = (path: string) => pathname === path

  if (!mounted) {
    return null
  }

  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-8 md:px-16 py-8">
        <div className="flex flex-col items-center">
          <Link href="/" className="mb-8">
            <Image
              src="/logo.png"
              alt="ZeroCodeCEO"
              width={200}
              height={48}
              priority
            />
          </Link>
  
          <div className="flex justify-center items-center gap-4 mb-8">
            {navItems.map((item, index) => (
              <React.Fragment key={item.path}>
                <Link 
                  href={item.path}
                  className={`transition-colors ${
                    isActive(item.path) 
                      ? 'text-purple-600' 
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  {item.label}
                </Link>
                {index < navItems.length - 1 && (
                  <span className="text-purple-300 font-bold">•</span>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center gap-2 text-gray-600 mb-6">
            <Mail className="w-4 h-4" />
            <a href="mailto:zerocodeceo@gmail.com" className="hover:text-purple-600 transition-colors">
              zerocodeceo@gmail.com
            </a>
          </div>

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} zerocodeceo.com. All rights reserved.
          </p>

          <Link href="/privacy-policy" className="hover:text-purple-600">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
} 