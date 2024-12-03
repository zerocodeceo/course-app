declare global {
  interface Window {
    gtag: (command: string, action: string, params: object) => void;
  }
}

"use client"
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { API_URL } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { MainLayout } from '../components/MainLayout'
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"

// Import confetti dynamically to avoid SSR issues
const ReactConfetti = dynamic(() => import('react-confetti'), {
  ssr: false
})

function SuccessContent() {
  const [verifying, setVerifying] = useState(true)
  const [error, setError] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  })
  const searchParams = useSearchParams()
  const router = useRouter()
  const { refreshUser } = useAuth()

  // Update window size on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const verifyPayment = async () => {
      const session_id = searchParams.get('session_id')
      // If test=true, skip verification
      if (searchParams.get('test') === 'true') {
        setVerifying(false)
        setShowConfetti(true)
        return
      }

      if (!session_id) {
        setError('No session ID found')
        setVerifying(false)
        return
      }

      try {
        const response = await fetch(`${API_URL}/verify-payment`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_id }),
        })

        if (!response.ok) {
          throw new Error('Payment verification failed')
        }

        await refreshUser()
        setShowConfetti(true)
        
        // Add Google Ads conversion event exactly as provided
        if (typeof window !== 'undefined' && window.gtag) {
          console.log('Sending conversion event with session_id:', session_id);
          window.gtag('event', 'conversion', {
            'send_to': 'AW-16805898539/fDenCIOzkvIZEKvS1s0-',
            'transaction_id': session_id || ''
          });
        } else {
          console.log('Google Ads gtag not found');
        }

        setTimeout(() => {
          router.push('/dashboard')
        }, 5000) // Give time to enjoy the confetti
      } catch (error) {
        console.error('Payment verification error:', error)
        setError('Payment verification failed')
      } finally {
        setVerifying(false)
      }
    }

    verifyPayment()
  }, [searchParams, router, refreshUser])

  return (
    <>
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center mb-4">
            {verifying ? 'Verifying Payment...' : error ? 'Payment Error' : 'Payment Successful! 🎉'}
          </h1>
          {error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <>
              <p className="text-gray-600 text-center mb-6">
                {verifying 
                  ? 'Please wait while we verify your payment...'
                  : 'Thank you for your purchase! You now have full access to all premium content. Redirecting to dashboard...'}
              </p>
              {!verifying && (
                <Button 
                  onClick={() => router.push('/dashboard')}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Go to Dashboard Now
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

// Main component with Suspense
export default function SuccessPage() {
  return (
    <MainLayout>
      <Suspense fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-center mb-4">Loading...</h1>
          </div>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </MainLayout>
  )
} 