"use client"
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, Eye, TrendingUp } from "lucide-react"
import { MainLayout } from '../components/MainLayout'
import { showToast } from '../components/Toast'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { CourseProgress } from '../components/CourseProgress'
import { VideoPlayer } from '../components/VideoPlayer'
import { formatTime } from '../lib/utils'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const [progress, setProgress] = useState({
    totalVideos: 10,
    completedVideos: 3,
    totalDuration: 3600,
    watchedDuration: 1200
  })

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }

    // Fetch user's progress
    const fetchProgress = async () => {
      try {
        const response = await fetch('http://localhost:8000/progress', {
          credentials: 'include'
        })
        const data = await response.json()
        setProgress(data)
      } catch (error) {
        console.error('Error fetching progress:', error)
        showToast('Failed to load progress', 'error')
      }
    }

    fetchProgress()
  }, [user, router])

  const handleVideoProgress = async (videoProgress: { duration: number, watched: number, completed: boolean }) => {
    try {
      // Update progress in backend
      await fetch('http://localhost:8000/progress/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          videoId: activeVideo,
          progress: videoProgress
        })
      })

      // Update local state
      setProgress(prev => ({
        ...prev,
        watchedDuration: prev.watchedDuration + videoProgress.watched,
        completedVideos: videoProgress.completed ? prev.completedVideos + 1 : prev.completedVideos
      }))
    } catch (error) {
      console.error('Error updating progress:', error)
      showToast('Failed to update progress', 'error')
    }
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <CourseProgress {...progress} />
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <PlayCircle className="h-4 w-4 text-gray-500" />
                <AnimatedNumber value={progress.totalVideos} />
              </div>
            </CardContent>
          </Card>
          {/* Add more stat cards as needed */}
        </div>

        <Tabs defaultValue="content">
          <TabsList>
            <TabsTrigger value="content">Course Content</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          <TabsContent value="content" className="space-y-4">
            {activeVideo && (
              <VideoPlayer
                videoUrl={activeVideo}
                onProgress={handleVideoProgress}
              />
            )}
            {/* Add your course content here */}
          </TabsContent>
          <TabsContent value="resources">
            {/* Add your resources content here */}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
} 