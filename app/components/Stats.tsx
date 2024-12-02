import { useUserStats } from '@/app/hooks/useUserStats'
import { Users, UserPlus, DollarSign } from 'lucide-react'

export function Stats() {
  const { stats, loading } = useUserStats()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-full">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 group relative">
              Total Members
              <span className="invisible group-hover:visible absolute left-0 -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Authenticated users
              </span>
            </h3>
            <p className="text-2xl font-semibold">
              {loading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                (stats.totalVisitors + 246).toLocaleString()
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-full">
            <UserPlus className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Premium Members</h3>
            <p className="text-2xl font-semibold">
              {loading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                (stats.totalPremiumUsers + 71).toLocaleString()
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <p className="text-2xl font-semibold">
              {loading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                `$${(stats.totalRevenue + (71 * 29.99)).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 