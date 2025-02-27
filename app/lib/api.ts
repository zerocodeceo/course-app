const getApiUrl = () => {
  if (typeof window === 'undefined') {
    return 'https://zerocodeceo.onrender.com'
  }
  
  // Force HTTPS in production
  const isProduction = window.location.hostname !== 'localhost'
  const apiUrl = isProduction 
    ? 'https://zerocodeceo.onrender.com'
    : 'http://localhost:8000'

  return apiUrl
}

export const getCallbackUrl = () => {
  if (typeof window === 'undefined') return ''
  
  const isProduction = window.location.hostname !== 'localhost'
  const frontendUrl = isProduction 
    ? 'https://zerocodeceo.com'
    : 'http://localhost:3000'
    
  return frontendUrl
}

export const API_URL = getApiUrl()