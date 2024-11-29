const getApiUrl = () => {
  // Check if we're running on the actual production domain
  const isProduction = typeof window !== 'undefined' && 
    window.location.hostname === 'zerocodeceo.vercel.app'

  const apiUrl = isProduction 
    ? process.env.NEXT_PUBLIC_PROD_API_URL 
    : process.env.NEXT_PUBLIC_API_URL

  // Add visible debugging
  if (typeof window !== 'undefined') {
    console.log('=== API URL Debug Info ===')
    console.log('Window Location:', window.location.hostname)
    console.log('Is Production:', isProduction)
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('API URL:', apiUrl)
    console.log('PROD URL:', process.env.NEXT_PUBLIC_PROD_API_URL)
    console.log('DEV URL:', process.env.NEXT_PUBLIC_API_URL)
  }

  return apiUrl
}

export const API_URL = getApiUrl() 