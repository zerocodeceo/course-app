const getApiUrl = () => {
  if (typeof window === 'undefined') {
    return 'https://zerocodeceo.onrender.com'
  }
  
  const isProduction = window.location.hostname !== 'localhost'
  return isProduction 
    ? 'https://zerocodeceo.onrender.com'
    : 'http://localhost:8000'
}

export const API_URL = getApiUrl()