"use client"
import { Progress } from "../components/ui/progress"
import { formatTime, formatProgress } from "../lib/utils"

type CourseProgressProps = {
  totalVideos: number
  completedVideos: number
  totalDuration: number
  watchedDuration: number
}

export function CourseProgress({ 
  totalVideos, 
  completedVideos, 
  totalDuration, 
  watchedDuration 
}: CourseProgressProps) {
  const progressPercentage = totalDuration > 0 
    ? (watchedDuration / totalDuration) * 100 
    : (completedVideos / totalVideos) * 100

  return (
    <div className="w-full mb-8 bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Your Progress</h3>
          <p className="text-sm text-gray-500">
            Keep going! You&apos;re doing great.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">
            {completedVideos} of {totalVideos} videos completed
          </p>
          {totalDuration > 0 ? (
            <p className="text-sm text-gray-500">
              {formatTime(watchedDuration)} of {formatTime(totalDuration)} watched
            </p>
          ) : (
            <p className="text-sm text-gray-500">Calculating total duration...</p>
          )}
        </div>
      </div>
      <Progress value={progressPercentage} className="h-2" />
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>{Math.round(progressPercentage)}% Complete</span>
        <span>{totalVideos - completedVideos} videos remaining</span>
      </div>
    </div>
  )
} 