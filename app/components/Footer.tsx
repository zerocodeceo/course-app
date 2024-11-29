"use client"
import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { navItems } from './MainLayout'

export function Footer() {
  return (
    <footer className="bg-white">
      <div className="container mx-auto text-center text-gray-600 text-sm">
        <p>© 2024 ZeroCodeCEO. All rights reserved.</p>
      </div>
    </footer>
  )
} 