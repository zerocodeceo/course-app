"use client"
import { useEffect, useRef, useState, useCallback } from 'react'

type VideoPlayerProps = {
  videoUrl: string
  initialProgress?: number
  onProgress: (progress: { duration: number, watched: number, completed: boolean }) => void
}

// Define YouTube Player type
interface YouTubePlayer {
  destroy: () => void
  getCurrentTime: () => number
  getDuration: () => number
  getPlayerState: () => number
  loadVideoById: (videoId: string) => void
}

// Define YouTube event type
interface YouTubeEvent {
  target: YouTubePlayer
  data: number
}

declare global {
  interface Window {
    YT: {
      Player: new (
        element: Element,
        config: {
          videoId: string
          width: string
          height: string
          playerVars: Record<string, unknown>
          events: {
            onReady: (event: YouTubeEvent) => void
            onStateChange: (event: YouTubeEvent) => void
          }
        }
      ) => YouTubePlayer
      PlayerState: {
        PLAYING: number
        ENDED: number
      }
    }
    onYouTubeIframeAPIReady: () => void
  }
}

export function VideoPlayer({ videoUrl, initialProgress = 0, onProgress }: VideoPlayerProps) {
  const playerRef = useRef<YouTubePlayer | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [lastUpdateTime, setLastUpdateTime] = useState(0)

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

  // Move startTracking to useCallback
  const startTracking = useCallback(() => {
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
  }, [lastUpdateTime, onProgress])

  // Rest of your existing code, but update the useEffect dependency array
  useEffect(() => {
    if (!videoId) return

    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

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
          onReady: (event: YouTubeEvent) => {
            const duration = event.target.getDuration()
            onProgress({
              duration,
              watched: initialProgress,
              completed: initialProgress >= duration * 0.9
            })
          },
          onStateChange: (event: YouTubeEvent) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              startTracking()
            }
            if (event.data === window.YT.PlayerState.ENDED) {
              const duration = playerRef.current?.getDuration() || 0
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
  }, [videoId, initialProgress, onProgress, startTracking])

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