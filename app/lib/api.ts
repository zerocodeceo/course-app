const getApiUrl = () => {
  // Check if we're in the browser
  if (typeof window === 'undefined') {
    console.log('Server-side rendering, using production URL')
    return 'https://zerocodeceo.onrender.com'
  }

  // Client-side logic
  const isProduction = window.location.hostname !== 'localhost' && 
                      !window.location.hostname.includes('localhost')
  
  const apiUrl = isProduction 
    ? 'https://zerocodeceo.onrender.com'
    : 'http://localhost:8000'

  console.log('API URL Selection:', {
    hostname: window.location.hostname,
    isProduction,
    selectedUrl: apiUrl,
    currentUrl: window.location.href,
    cookies: document.cookie
  })

  return apiUrl
}

export const API_URL = getApiUrl()