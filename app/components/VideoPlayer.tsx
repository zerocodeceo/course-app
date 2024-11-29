"use client"
import { useEffect, useRef, useState } from 'react'

type VideoPlayerProps = {
  videoUrl: string
  initialProgress?: number
  onProgress: (progress: { duration: number, watched: number, completed: boolean }) => void
}

declare global {
  interface Window {
    YT: {
      Player: new (element: HTMLElement | string, config: PlayerConfig) => YTPlayer;
      PlayerState: {
        PLAYING: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YTPlayer {
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
  getPlayerState: () => number;
}

interface PlayerConfig {
  videoId: string;
  width: string;
  height: string;
  playerVars: {
    modestbranding: number;
    rel: number;
    start: number;
  };
  events: {
    onReady: (event: PlayerEvent) => void;
    onStateChange: (event: PlayerStateEvent) => void;
  };
}

interface PlayerStateEvent {
  data: number;
}

interface PlayerEvent {
  target: {
    getCurrentTime: () => number;
    getDuration: () => number;
  };
}

export function VideoPlayer({ videoUrl, initialProgress = 0, onProgress }: VideoPlayerProps) {
  const playerRef = useRef<YTPlayer | null>(null)
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
      if (!containerRef.current) return;

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
          onReady: (event: PlayerEvent) => {
            const duration = event.target.getDuration()
            onProgress({
              duration,
              watched: initialProgress,
              completed: initialProgress >= duration * 0.9
            })
          },
          onStateChange: (event: PlayerStateEvent) => {
            // Check if video is playing
            if (event.data === window.YT.PlayerState.PLAYING) {
              startTracking()
            }
            // Check if video ended
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
  }, [videoId, initialProgress])

  // Move startTracking inside useEffect to avoid dependency issues
  useEffect(() => {
    if (playerRef.current) {
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

      startTracking()
    }
  }, [playerRef.current, lastUpdateTime, onProgress])

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