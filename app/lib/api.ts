const getApiUrl = () => {
  // Check if we're in the browser
  if (typeof window === 'undefined') {
    // Return the production URL during server-side rendering
    return process.env.NEXT_PUBLIC_PROD_API_URL
  }

  // Client-side logic
  const isProduction = window.location.hostname.includes('vercel.app')
  const apiUrl = isProduction 
    ? process.env.NEXT_PUBLIC_PROD_API_URL 
    : process.env.NEXT_PUBLIC_API_URL

  console.log('API URL Selection:', {
    hostname: window.location.hostname,
    isProduction,
    selectedUrl: apiUrl
  })

  return apiUrl
}

export const API_URL = getApiUrl() 