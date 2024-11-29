export const API_URL = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_PROD_API_URL 
  : process.env.NEXT_PUBLIC_API_URL 

// Add this for debugging
console.log({
  NODE_ENV: process.env.NODE_ENV,
  API_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_PROD_API_URL: process.env.NEXT_PUBLIC_PROD_API_URL
}) 