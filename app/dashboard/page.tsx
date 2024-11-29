"use client"
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, DollarSign, Eye, TrendingUp, PlayCircle, Globe2, Layers, Lock } from "lucide-react"
import { ResponsiveContainer } from 'recharts'
import { MainLayout } from '../components/MainLayout'
import dynamic from 'next/dynamic'
import { showToast } from '../components/Toast'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { CourseProgress } from '../components/CourseProgress'
import { VideoPlayer } from '../components/VideoPlayer'
import { formatTime } from '../lib/utils'
import { AnimatedBackground } from '../components/AnimatedBackground'
import { API_URL } from '../lib/api'

// Dynamically import components that use browser APIs
const DynamicLineChart = dynamic(
  () => import('../components/DynamicLineChart'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-lg" />
    )
  }
)

const DynamicWorldMap = dynamic(
  () => import('../components/SimpleWorldMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-lg" />
    )
  }
)

// Types for our statistics
type Statistics = {
  totalMembers: number
  totalRevenue: number
  totalVisitors: number
  memberGrowth: {
    labels: string[]
    data: number[]
  }
  visitorLocations: Array<{
    lat: number
    lng: number
  }>
}

// Course content type
type CourseContent = {
  id: string
  title: string
  description: string
  videoUrl: string
}

export default function Dashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [timeframe, setTimeframe] = useState('year')
  const [stats, setStats] = useState<Statistics>({
    totalMembers: 0,
    totalRevenue: 0,
    totalVisitors: 0,
    memberGrowth: { labels: [], data: [] },
    visitorLocations: []
  })
  const [courseContent, setCourseContent] = useState<CourseContent[]>([])
  const isAdmin = user?.email === "bbertapeli@gmail.com"
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState({
    completedVideos: 0,
    totalDuration: 0,
    watchedDuration: 0,
    durations: {} as Record<string, number>,
    watchedDurations: {} as Record<string, number>,
    completed: {} as Record<string, boolean>
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }

    // Fetch dashboard data for all users
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${API_URL}/dashboard-stats`, {
          credentials: 'include'
        })
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }
    fetchDashboardData()

    // Fetch course content
    const fetchCourseContent = async () => {
      try {
        const response = await fetch(`${API_URL}/course-content`, {
          credentials: 'include'
        })
        const data = await response.json()
        setCourseContent(data)
      } catch (error) {
        console.error('Error fetching course content:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCourseContent()
  }, [user, router])

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch(`${API_URL}/user-progress`, {
          credentials: 'include'
        })
        const data = await response.json()
        setProgress({
          completedVideos: Object.values(data.completed || {}).filter(Boolean).length,
          totalDuration: data.totalDuration || 0,
          watchedDuration: data.watchedDuration || 0,
          durations: data.durations || {},
          watchedDurations: data.watchedDurations || {},
          completed: data.completed || {}
        })
      } catch (error) {
        console.error('Error fetching progress:', error)
      }
    }

    if (user) {
      fetchProgress()
    }
  }, [user])

  if (!mounted || loading) {
    return (
      <MainLayout>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  // Update getChartData to use real data only
  const getChartData = () => {
    if (!mounted || !stats.memberGrowth) return []

    switch (timeframe) {
      case 'today':
        return stats.memberGrowth.data.slice(-1).map((count) => ({
          time: 'Today',
          members: count
        }))
      case 'week':
        return stats.memberGrowth.data.slice(-7).map((count, index) => ({
          time: stats.memberGrowth.labels.slice(-7)[index] || `Day ${index + 1}`,
          members: count
        }))
      default: // year
        return stats.memberGrowth.labels.map((label, index) => ({
          time: label,
          members: stats.memberGrowth.data[index]
        }))
    }
  }

  const handleUpdateContent = (id: string, field: string, value: string) => {
    // Update local state
    setCourseContent(prev => prev.map(content => 
      content.id === id ? { ...content, [field]: value } : content
    ))
  }

  const handleSaveContent = async (id: string) => {
    try {
      const content = courseContent.find(c => c.id === id)
      const response = await fetch(`${API_URL}/update-content/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(content)
      })
      
      if (!response.ok) throw new Error('Failed to update content')
      
      const data = await response.json()
      if (data.success) {
        showToast('Content updated successfully', 'success')
      }
    } catch (error) {
      console.error('Error updating content:', error)
      showToast('Failed to update content', 'error')
    }
  }

  const handleUpgrade = async () => {
    try {
      const response = await fetch(`${API_URL}/create-checkout-session`, {
        method: 'POST',
        credentials: 'include',
      })
      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    }
  }

  const handleVideoProgress = async (videoId: string, progress: { duration: number, watched: number, completed: boolean }) => {
    try {
      const response = await fetch(`${API_URL}/update-progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          videoId,
          duration: progress.duration,
          watchedDuration: progress.watched,
          completed: progress.completed
        })
      })

      if (!response.ok) throw new Error('Failed to update progress')

      setProgress(prev => {
        const newCompleted = {
          ...prev.completed,
          [videoId]: progress.completed
        }

        const newDurations = {
          ...prev.durations,
          [videoId]: progress.duration
        }

        const totalDuration = Object.values(newDurations).reduce((acc, curr) => acc + curr, 0)

        return {
          ...prev,
          watchedDuration: progress.watched,
          durations: newDurations,
          completed: newCompleted,
          completedVideos: Object.values(newCompleted).filter(Boolean).length,
          totalDuration
        }
      })
    } catch (error) {
      console.error('Error updating video progress:', error)
    }
  }

  return (
    <MainLayout>
      <AnimatedBackground />
      
      <div className="container mx-auto">
        <Tabs defaultValue="course" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-[600px] bg-white/80 backdrop-blur-sm shadow rounded-lg">
            <TabsTrigger value="course" className="flex items-center gap-2">
              <PlayCircle className="w-4 h-4" />
              Course Content
            </TabsTrigger>
            <TabsTrigger value="extra" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Extra Modules
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="course">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <CourseProgress
                  totalVideos={courseContent.length}
                  completedVideos={progress.completedVideos}
                  totalDuration={progress.totalDuration}
                  watchedDuration={progress.watchedDuration}
                />
              </CardContent>
            </Card>

            <Card className="mt-6 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Course Materials</CardTitle>
                <CardDescription>
                  Access your premium course content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {Array.isArray(courseContent) && courseContent.length > 0 ? (
                    courseContent.map((content) => (
                      <AccordionItem key={content.id} value={content.id}>
                        <AccordionTrigger className="hover:text-purple-600 text-left">
                          {content.title}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            {isAdmin ? (
                              <div className="mb-4 space-y-4 bg-purple-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-purple-600">Admin Controls</h4>
                                <div className="grid gap-4">
                                  <div>
                                    <label className="text-sm text-gray-600 mb-1 block">Video URL</label>
                                    <input
                                      type="text"
                                      value={content.videoUrl}
                                      onChange={(e) => handleUpdateContent(content.id, 'videoUrl', e.target.value)}
                                      className="w-full p-2 border rounded"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm text-gray-600 mb-1 block">Description</label>
                                    <textarea
                                      value={content.description}
                                      onChange={(e) => handleUpdateContent(content.id, 'description', e.target.value)}
                                      className="w-full p-2 border rounded"
                                      rows={3}
                                    />
                                  </div>
                                  <Button 
                                    onClick={() => handleSaveContent(content.id)}
                                    size="sm"
                                    className="w-fit"
                                  >
                                    Save Changes
                                  </Button>
                                </div>
                              </div>
                            ) : null}
                            
                            {user?.plan === 'basic' && content.id !== '1' ? (
                              <div className="aspect-video max-w-2xl mx-auto relative">
                                <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center text-white">
                                  <Lock className="w-8 h-8 mb-2" />
                                  <h3 className="font-semibold mb-2">Premium Content</h3>
                                  <p className="text-sm text-gray-300 mb-4">Upgrade to access all course content</p>
                                  <Button
                                    onClick={handleUpgrade}
                                    className="bg-purple-600 hover:bg-purple-700"
                                  >
                                    Upgrade to Premium
                                  </Button>
                                </div>
                                <div className="aspect-video max-w-2xl mx-auto">
                                  <VideoPlayer
                                    videoUrl={content.videoUrl}
                                    initialProgress={progress.watchedDurations?.[content.id] || 0}
                                    onProgress={(progress) => handleVideoProgress(content.id, progress)}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="aspect-video max-w-2xl mx-auto">
                                <VideoPlayer
                                  videoUrl={content.videoUrl}
                                  initialProgress={progress.watchedDurations?.[content.id] || 0}
                                  onProgress={(progress) => handleVideoProgress(content.id, progress)}
                                />
                              </div>
                            )}
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-2">Module Description:</h4>
                              <p className="text-gray-600">{content.description}</p>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-500">
                              <span>Duration: {formatTime(progress.durations?.[content.id] || 0)}</span>
                              <span className={progress.completed?.[content.id] ? 'text-green-600' : 'text-gray-400'}>
                                {progress.completed?.[content.id] ? '✓ Completed' : 'Not started'}
                              </span>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No course content available
                    </div>
                  )}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="extra">
            <div className="relative">
              {user?.plan === 'basic' && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 rounded-lg flex flex-col items-center justify-center">
                  <Lock className="w-12 h-12 text-purple-600 mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Premium Feature</h2>
                  <p className="text-gray-600 mb-6 max-w-md text-center">
                    Upgrade to Premium to access additional learning modules and advanced topics
                  </p>
                  <Button
                    onClick={handleUpgrade}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Upgrade Now
                  </Button>
                </div>
              )}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Extra Learning Modules</CardTitle>
                  <CardDescription>
                    Additional resources and advanced topics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        title: "Advanced AI Integration",
                        description: "Learn to integrate ChatGPT and other AI models into your applications",
                        status: "Coming Soon",
                        icon: "🤖"
                      },
                      {
                        title: "Performance Optimization",
                        description: "Advanced techniques for optimizing Next.js applications",
                        status: "Coming Soon",
                        icon: "⚡"
                      },
                      {
                        title: "Advanced Authentication",
                        description: "Implement multi-factor authentication and advanced security features",
                        status: "Coming Soon",
                        icon: "🔐"
                      },
                      {
                        title: "Real-time Features",
                        description: "Add real-time functionality using WebSockets and Server-Sent Events",
                        status: "Coming Soon",
                        icon: "🔄"
                      }
                    ].map((module, index) => (
                      <Card key={index} className="bg-gradient-to-br from-gray-50 to-white">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{module.icon}</span>
                              <div>
                                <CardTitle className="text-base">{module.title}</CardTitle>
                                <CardDescription className="text-sm mt-1">
                                  {module.description}
                                </CardDescription>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-purple-600 font-medium">
                              {module.status}
                            </span>
                            <Button variant="outline" size="sm" disabled>
                              Notify Me
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            {mounted && (
              <>
                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-purple-50/90 to-white/90 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Members
                      </CardTitle>
                      <Users className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">
                        <AnimatedNumber value={stats.totalMembers} />
                      </div>
                      <p className="text-xs text-gray-500">
                        Premium members
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Revenue
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        <AnimatedNumber value={stats.totalRevenue} prefix="$" />
                      </div>
                      <p className="text-xs text-gray-500">
                        Lifetime earnings
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 to-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Visitors
                      </CardTitle>
                      <Eye className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        <AnimatedNumber value={stats.totalVisitors} />
                      </div>
                      <p className="text-xs text-gray-500">
                        Website traffic
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Map and Growth Chart Section */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Globe2 className="h-4 w-4 text-gray-500" />
                            Global Reach
                          </CardTitle>
                          <CardDescription>
                            Student distribution worldwide
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <DynamicWorldMap markers={stats.visitorLocations} />
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-gray-500" />
                            Growth
                          </CardTitle>
                          <CardDescription>
                            Member growth over time
                          </CardDescription>
                        </div>
                        <Select 
                          value={timeframe} 
                          onValueChange={setTimeframe}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Select timeframe" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="year">This Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <DynamicLineChart data={getChartData()} />
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
} 