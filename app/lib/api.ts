const getApiUrl = () => {
  const isProduction = typeof window !== 'undefined' && (
    window.location.hostname.includes('vercel.app') ||
    window.location.hostname === 'zerocodeceo.com'
  )

  const apiUrl = isProduction 
    ? process.env.NEXT_PUBLIC_PROD_API_URL 
    : process.env.NEXT_PUBLIC_API_URL

  return apiUrl
}

export const API_URL = getApiUrl() 