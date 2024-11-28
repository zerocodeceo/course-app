"use client"
import { useEffect, useState } from 'react'

export function showToast(message: string, type: 'success' | 'error' = 'success') {
  const event = new CustomEvent('show-toast', { detail: { message, type } })
  window.dispatchEvent(event)
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: string }>>([])

  useEffect(() => {
    const handleShowToast = (event: CustomEvent<{ message: string; type: string }>) => {
      const { message, type } = event.detail
      const id = Date.now()
      setToasts(prev => [...prev, { id, message, type }])
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
      }, 3000)
    }

    window.addEventListener('show-toast', handleShowToast as EventListener)
    return () => window.removeEventListener('show-toast', handleShowToast as EventListener)
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`px-4 py-2 rounded-lg shadow-lg text-white transform transition-all duration-300 ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
} 