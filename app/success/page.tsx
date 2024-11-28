"use client"
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { useAuth } from '../context/AuthContext'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, refreshUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyPayment = async () => {
      const session_id = searchParams.get('session_id')
      if (!session_id) {
        setError('Invalid session')
        setLoading(false)
        return
      }

      try {
        const response = await fetch('http://localhost:8000/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ session_id })
        })

        if (!response.ok) {
          throw new Error('Payment verification failed')
        }

        await refreshUser()
        
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } catch (_error) {
        setError('Failed to verify payment')
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [searchParams, router, refreshUser])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/')}>Return Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center animate-fade-in">
        <div className="mb-6">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Premium!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for upgrading, {user?.displayName}! Your payment was successful and your account has been upgraded to premium.
        </p>
        <div className="space-y-4">
          <Button 
            onClick={() => router.push('/')}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Return to Home
          </Button>
          <p className="text-sm text-gray-500">
            The page will automatically refresh in a moment...
          </p>
        </div>
      </div>
    </div>
  )
} 