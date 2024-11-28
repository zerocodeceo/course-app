export function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0 min'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes > 0 ? `${minutes}min` : ''}`
  }
  return `${minutes} min`
}

export function formatProgress(current: number, total: number): string {
  if (!total || total === 0) return '0%'
  const percentage = Math.min(Math.round((current / total) * 100), 100)
  return `${percentage}%`
} 