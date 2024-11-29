"use client"
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { MainLayout } from '../components/MainLayout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { showToast } from '../components/Toast'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get('session_id')
        if (!sessionId) {
          showToast('Invalid session', 'error')
          router.push('/')
          return
        }

        const response = await fetch('http://localhost:8000/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ sessionId })
        })

        const data = await response.json()
        if (data.success) {
          setSuccess(true)
          showToast('Payment successful!', 'success')
        } else {
          showToast('Payment verification failed', 'error')
          router.push('/')
        }
      } catch (_err) {
        showToast('Something went wrong', 'error')
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [router, searchParams])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <Card className="max-w-lg mx-auto mt-12">
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          {success ? 'Payment Successful!' : 'Verifying Payment...'}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        {success ? (
          <>
            <p className="mb-6 text-gray-600">
              Thank you for upgrading to Premium! You now have access to all course content.
            </p>
            <Button 
              onClick={() => router.push('/dashboard')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Go to Dashboard
            </Button>
          </>
        ) : (
          <p className="text-gray-600">
            Please wait while we verify your payment...
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default function SuccessPage() {
  return (
    <MainLayout>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </MainLayout>
  )
} 