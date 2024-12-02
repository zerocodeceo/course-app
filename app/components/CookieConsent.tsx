'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookieConsent')
    if (!hasConsented) {
      setShowConsent(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true')
    setShowConsent(false)
  }

  const handleDecline = () => {
    // You might want to disable analytics if user declines
    localStorage.setItem('cookieConsent', 'false')
    setShowConsent(false)
  }

  if (!showConsent) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:p-6 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600 text-center md:text-left">
          <p>
            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.{' '}
            <a 
              href="/privacy-policy" 
              className="text-purple-600 hover:text-purple-700 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more
            </a>
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={handleDecline}
            className="text-gray-600 hover:text-gray-700"
          >
            Decline
          </Button>
          <Button
            onClick={handleAccept}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  )
} 