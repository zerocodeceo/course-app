import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from './context/AuthContext'
import 'leaflet/dist/leaflet.css'
import { ToastContainer } from './components/Toast'
import GoogleAnalytics from './components/GoogleAnalytics'
import JsonLdSchema from './components/JsonLdSchema'
import CookieConsent from './components/CookieConsent'

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
  title: "ZeroCodeCEO | Learn to Build Web Apps & Startups with AI, No Coding Required",
  description: "Build Apps Without Writing a Single Line of Code. Learn how to create websites, web apps, startups, and SaaS products using AI and no-code tools. Start for just $29.99.",
  keywords: "no code, web development, startup builder, SaaS development, AI tools, zero code, web app creation, no-code tutorials, startup development",
  metadataBase: new URL('https://zerocodeceo.com'),
  openGraph: {
    title: 'ZeroCodeCEO | Build Web Apps & Startups with AI',
    description: 'Create professional web applications and startups without coding. Learn step-by-step with real projects.',
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
    title: 'ZeroCodeCEO | No-Code Web App Builder',
    description: 'Build your next startup without coding. Learn from real projects.',
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon-96x96.png" />
      </head>
      <body suppressHydrationWarning>
        <GoogleAnalytics />
        <AuthProvider>
          <JsonLdSchema />
          {children}
          <ToastContainer />
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  )
}
