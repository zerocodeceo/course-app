export const API_URL = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_PROD_API_URL 
  : process.env.NEXT_PUBLIC_API_URL 