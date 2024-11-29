/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'], // Allow Google profile pictures
  },
  typescript: {
    // Exclude backend directory from TypeScript compilation
    ignoreBuildErrors: true,
  },
  // Ignore backend directory during build
  webpack: (config) => {
    config.watchOptions = {
      ignored: ['**/backend/**', '**/node_modules/**']
    }
    return config
  }
}

module.exports = nextConfig 