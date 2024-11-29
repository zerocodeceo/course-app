const getApiUrl = () => {
  // This will still work with your custom domain
  const isProduction = window.location.hostname.includes('vercel.app') || 
                      window.location.hostname.includes('zerocodeceo.com')
  const apiUrl = isProduction 
    ? 'https://zerocodeceo.onrender.com'
    : 'http://localhost:8000'

  return apiUrl
}

export const API_URL = getApiUrl()