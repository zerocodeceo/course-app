const getApiUrl = () => {
  if (typeof window === 'undefined') {
    return 'https://zerocodeceo.onrender.com'
  }

  const isProduction = window.location.hostname !== 'localhost' && 
                      !window.location.hostname.includes('localhost')
  
  const apiUrl = isProduction 
    ? 'https://zerocodeceo.onrender.com'
    : 'http://localhost:8000'

  return apiUrl
}

export const API_URL = getApiUrl()