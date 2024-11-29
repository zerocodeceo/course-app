/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // This ensures proper build output
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_PROD_API_URL: process.env.NEXT_PUBLIC_PROD_API_URL,
  },
}

module.exports = nextConfig 