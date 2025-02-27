import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from './context/AuthContext'
import 'leaflet/dist/leaflet.css'
import { ToastContainer } from './components/Toast'
import GoogleAnalytics from './components/GoogleAnalytics'
import JsonLdSchema from './components/JsonLdSchema'
import CookieConsent from './components/CookieConsent'
import { LocationPermission } from './components/LocationPermission'
import ErrorBoundary from './components/ErrorBoundary'
import { Suspense } from 'react'
import { DebugConsole } from './components/DebugConsole'
import { cn } from './lib/utils'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ZeroCodeCEO | Learn to Build Web Apps & Startups with AI, Typing zero lines of code",
  description: "For just $29.99 I will show you how to build a web app from scratch, without writing a single line of code.",
  keywords: "no code, web development, claudeai, cursor ai, startup builder, SaaS development, AI tools, zero code, web app creation, no-code tutorials, startup development",
  metadataBase: new URL('https://zerocodeceo.com'),
  openGraph: {
    title: 'ZeroCodeCEO | From Screenshots to a WebApp in 2 days',
    description: 'Learn how to ACTUALLY use AI to build web apps without writing a single line of code.',
    type: 'website',
    url: 'https://zerocodeceo.com',
    siteName: 'ZeroCodeCEO',
    images: [{
      url: '/og-image.png', // Make sure to create this image
      width: 1200,
      height: 630,
      alt: 'ZeroCodeCEO Platform Preview'
    }],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ZeroCodeCEO',
    creator: '@BrunoBertapeli',
    title: 'ZeroCodeCEO | From a screenshot to a WebApp in 2 days',
    description: 'Learn how to ACTUALLY use AI to build web apps without writing a single line of code.',
    images: ['/og-image.png'], // Same image as OG
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification', // Add your Google verification code
  },
  alternates: {
    canonical: 'https://zerocodeceo.com',
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: '32x32',
        type: 'image/x-icon',
      },
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn(geistSans.variable, geistMono.variable)} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon-96x96.png" />
      </head>
      <body suppressHydrationWarning>
        <ErrorBoundary>
          <Suspense fallback={null}>
            <GoogleAnalytics />
          </Suspense>
          <AuthProvider>
            <LocationPermission />
            <JsonLdSchema />
            {children}
            <ToastContainer />
            <CookieConsent />
            <DebugConsole />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
