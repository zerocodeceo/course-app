"use client"
import { useEffect, useRef, useState } from 'react'

type VideoPlayerProps = {
  videoUrl: string
  initialProgress?: number
  onProgress: (progress: { duration: number, watched: number, completed: boolean }) => void
}

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export function VideoPlayer({ videoUrl, initialProgress = 0, onProgress }: VideoPlayerProps) {
  const playerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [lastUpdateTime, setLastUpdateTime] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)

  // Extract video ID from different URL formats
  const getVideoId = (url: string) => {
    try {
      const urlObj = new URL(url)
      if (urlObj.hostname.includes('youtube.com')) {
        // Handle youtube.com URLs
        if (urlObj.pathname === '/watch') {
          return urlObj.searchParams.get('v')
        } else if (urlObj.pathname.startsWith('/embed/')) {
          return urlObj.pathname.split('/')[2]
        }
      } else if (urlObj.hostname === 'youtu.be') {
        // Handle youtu.be URLs
        return urlObj.pathname.slice(1)
      }
    } catch (error) {
      console.error('Error parsing YouTube URL:', error)
    }
    return null
  }

  const videoId = getVideoId(videoUrl)

  useEffect(() => {
    if (!videoId) return

    // Load YouTube API Script if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

    // Initialize player when API is ready
    const initPlayer = () => {
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          modestbranding: 1,
          rel: 0,
          start: Math.floor(initialProgress)
        },
        events: {
          onReady: (event: any) => {
            const duration = event.target.getDuration()
            onProgress({
              duration,
              watched: initialProgress,
              completed: initialProgress >= duration * 0.9
            })
            setIsInitialized(true)
          },
          onStateChange: (event: any) => {
            // Check if video is playing
            if (event.data === window.YT.PlayerState.PLAYING) {
              startTracking()
            }
            // Check if video ended
            if (event.data === window.YT.PlayerState.ENDED) {
              const duration = playerRef.current.getDuration()
              onProgress({
                duration,
                watched: duration,
                completed: true
              })
            }
          }
        }
      })
    }

    if (window.YT && window.YT.Player) {
      initPlayer()
    } else {
      window.onYouTubeIframeAPIReady = initPlayer
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
      }
    }
  }, [videoId, initialProgress])

  const startTracking = () => {
    const interval = setInterval(() => {
      if (playerRef.current && playerRef.current.getPlayerState() === window.YT.PlayerState.PLAYING) {
        const currentTime = playerRef.current.getCurrentTime()
        const duration = playerRef.current.getDuration()
        const watchedTime = currentTime - lastUpdateTime

        if (watchedTime > 0) {
          onProgress({
            duration,
            watched: currentTime,
            completed: currentTime >= duration * 0.9
          })
          setLastUpdateTime(currentTime)
        }
      }
    }, 5000)

    return () => clearInterval(interval)
  }

  if (!videoId) {
    return <div className="aspect-video w-full bg-gray-100 flex items-center justify-center text-gray-500">
      Invalid YouTube URL
    </div>
  }

  return (
    <div className="aspect-video w-full">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
} 