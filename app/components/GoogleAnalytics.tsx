'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Handle page views when route changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: pathname,
        page_search: searchParams.toString(),
      })
    }
  }, [pathname, searchParams])

  return (
    <>
      <Script
        strategy="worker"
        src="https://www.googletagmanager.com/gtag/js?id=G-RGTFQHS7Z2"
      />
      <Script
        id="google-analytics"
        strategy="worker"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-RGTFQHS7Z2', {
            page_path: window.location.pathname,
            send_page_view: false
          });
        `}
      </Script>

      <Script
        strategy="worker"
        src="https://www.googletagmanager.com/gtag/js?id=AW-16805898539"
      />
      <Script
        id="google-ads"
        strategy="worker"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-16805898539');
        `}
      </Script>
    </>
  )
} 