"use client"
import { useEffect, useRef, useState } from 'react'

type VideoPlayerProps = {
  videoUrl: string
  initialProgress?: number
  onProgress: (progress: { duration: number, watched: number, completed: boolean }) => void
}

// Define YouTube API types
interface YouTubePlayer {
  destroy: () => void
  getDuration: () => number
  getCurrentTime: () => number
  getPlayerState: () => number
}

interface YouTubeEvent {
  target: YouTubePlayer
  data: number
}

declare global {
  interface Window {
    YT: {
      Player: new (element: HTMLElement, config: {
        videoId: string,
        width: string | number,
        height: string | number,
        playerVars?: {
          modestbranding?: number,
          rel?: number,
          start?: number
        },
        events?: {
          onReady?: (event: YouTubeEvent) => void,
          onStateChange?: (event: YouTubeEvent) => void
        }
      }) => YouTubePlayer
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
  const progressCallback = useRef(onProgress)

  // Update the ref when onProgress changes
  useEffect(() => {
    progressCallback.current = onProgress
  }, [onProgress])

  // Extract video ID from different URL formats
  const getVideoId = (url: string) => {
    try {
      const urlObj = new URL(url)
      if (urlObj.hostname.includes('youtube.com')) {
        if (urlObj.pathname === '/watch') {
          return urlObj.searchParams.get('v')
        } else if (urlObj.pathname.startsWith('/embed/')) {
          return urlObj.pathname.split('/')[2]
        }
      } else if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.slice(1)
      }
    } catch (error) {
      console.error('Error parsing YouTube URL:', error)
    }
    return null
  }

  const videoId = getVideoId(videoUrl)

  const startTracking = useRef(() => {
    const interval = setInterval(() => {
      if (playerRef.current && playerRef.current.getPlayerState() === window.YT.PlayerState.PLAYING) {
        const currentTime = playerRef.current.getCurrentTime()
        const duration = playerRef.current.getDuration()
        const watchedTime = currentTime - lastUpdateTime

        if (watchedTime > 0) {
          progressCallback.current({
            duration,
            watched: currentTime,
            completed: currentTime >= duration * 0.9
          })
          setLastUpdateTime(currentTime)
        }
      }
    }, 5000)

    return () => clearInterval(interval)
  })

  useEffect(() => {
    if (!videoId) return

    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

    const initPlayer = () => {
      if (!containerRef.current) return

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
            progressCallback.current({
              duration,
              watched: initialProgress,
              completed: initialProgress >= duration * 0.9
            })
          },
          onStateChange: (event: YouTubeEvent) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              startTracking.current()
            }
            if (event.data === window.YT.PlayerState.ENDED) {
              const duration = playerRef.current?.getDuration() || 0
              progressCallback.current({
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