const getApiUrl = () => {
  // Check if we're in the browser
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_PROD_API_URL
  }

  // Client-side logic
  const isProduction = window.location.hostname.includes('vercel.app')
  const apiUrl = isProduction 
    ? 'https://zerocodeceo.onrender.com'
    : 'http://localhost:8000'

  console.log('API URL Selection:', {
    hostname: window.location.hostname,
    isProduction,
    selectedUrl: apiUrl
  })

  return apiUrl
}

export const API_URL = getApiUrl()