'use client'

import Script from 'next/script'

export default function JsonLdSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Zero Code CEO: From a screenshot to a WebApp in 2 days",
    "description": "With just $29.99 I will show you how to build a web app from scratch, without writing a single line of code.",
    "provider": {
      "@type": "Organization",
      "name": "Zero Code CEO",
      "url": "https://zerocodeceo.com",
      "logo": "https://zerocodeceo.com/logo.png",
      "sameAs": [
        "https://twitter.com/ZeroCodeCEO",
        "https://www.youtube.com/@ZeroCodeCEO",
        // Add other social media URLs
      ]
    },
    "educationalCredentialAwarded": "Certificate of Completion",
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "name": "Zero Code CEO: From a screenshot to a WebApp in 2 days",
      "courseMode": "online",
      "instructor": {
        "@type": "Person",
        "name": "Bruno Bertapeli",
        "url": "https://bertapeli.com",
        "jobTitle": "Founder & Instructor",
        "sameAs": [
          "https://twitter.com/BrunoBertapeli",
          // Add other social profiles
        ]
      },
      "startDate": "2024-01-01",
      "endDate": "2024-12-31",
      "duration": "P12M",
      "location": {
        "@type": "VirtualLocation",
        "url": "https://zerocodeceo.com/"
      },
      "offers": {
        "@type": "Offer",
        "price": "29.99",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "url": "https://zerocodeceo.com",
        "validFrom": "2024-01-01",
        "priceValidUntil": "2024-12-31"
      }
    },
    "learningOutcome": [
      "Build web applications without coding",
      "Create SaaS products using no-code tools",
      "Launch startups faster with AI assistance",
      "Understand modern web development concepts",
      "Generate passive income through web projects"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "50" // Update with real numbers
    }
  }

  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  )
} 