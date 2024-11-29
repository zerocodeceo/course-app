const getApiUrl = () => {
  const isProduction = typeof window !== 'undefined' && 
    window.location.hostname.includes('vercel.app')

  console.log('API URL Selection:', {
    hostname: window?.location?.hostname,
    isProduction,
    selectedUrl: isProduction ? process.env.NEXT_PUBLIC_PROD_API_URL : process.env.NEXT_PUBLIC_API_URL
  })

  return isProduction 
    ? process.env.NEXT_PUBLIC_PROD_API_URL 
    : process.env.NEXT_PUBLIC_API_URL
}

export const API_URL = getApiUrl() 