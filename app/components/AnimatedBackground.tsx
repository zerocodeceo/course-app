"use client"
import { useEffect, useRef } from 'react'

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Dot properties
    const dots: Array<{
      x: number
      y: number
      opacity: number
      fadeIn: boolean
    }> = []

    // Create grid of dots
    const spacing = 30
    for (let x = 0; x < canvas.width; x += spacing) {
      for (let y = 0; y < canvas.height; y += spacing) {
        dots.push({
          x,
          y,
          opacity: Math.random(),
          fadeIn: Math.random() > 0.5
        })
      }
    }

    // Animation
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      dots.forEach(dot => {
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(124, 58, 237, ${dot.opacity * 0.2})` // Purple color with opacity
        ctx.fill()

        // Update opacity
        if (dot.fadeIn) {
          dot.opacity += 0.01
          if (dot.opacity >= 1) dot.fadeIn = false
        } else {
          dot.opacity -= 0.01
          if (dot.opacity <= 0) dot.fadeIn = true
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 bg-gray-50"
    />
  )
} 