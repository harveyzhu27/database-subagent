"use client"

import { useState, useEffect } from 'react'
import { Play, Heart, TrendingUp, Sparkles } from 'lucide-react'

// Type for made for you recommendation
export interface MadeForYouRecommendation {
  id: number
  user_id: string
  song_id: string
  song_title: string
  artist_name: string
  album_art?: string
  album_name: string
  duration_ms?: number
  recommendation_reason?: string
  confidence_score?: number
  created_at: string
}

interface MadeForYouListProps {
  userId?: string
  limit?: number
  className?: string
  onPlayTrack?: (recommendation: MadeForYouRecommendation) => void
  showHeader?: boolean
}

export default function MadeForYouList({
  userId = 'user123',
  limit = 10,
  className = '',
  onPlayTrack,
  showHeader = true
}: MadeForYouListProps) {
  const [recommendations, setRecommendations] = useState<MadeForYouRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMadeForYou = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/made-for-you?userId=${userId}&limit=${limit}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch made for you recommendations')
        }
        
        const data = await response.json()
        setRecommendations(data.recommendations || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching made for you recommendations:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMadeForYou()
  }, [userId, limit])

  const formatDuration = (ms?: number) => {
    if (!ms) return ''
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getConfidenceColor = (score?: number) => {
    if (!score) return 'text-gray-400'
    if (score >= 90) return 'text-green-400'
    if (score >= 80) return 'text-blue-400'
    if (score >= 70) return 'text-yellow-400'
    return 'text-gray-400'
  }

  const getConfidenceIcon = (score?: number) => {
    if (!score) return null
    if (score >= 90) return <Sparkles className="w-4 h-4 text-green-400" />
    if (score >= 80) return <TrendingUp className="w-4 h-4 text-blue-400" />
    return null
  }

  if (loading) {
    return (
      <div className={`${className}`}>
        {showHeader && (
          <h2 className="text-xl font-bold mb-4 text-white">Made for you</h2>
        )}
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 bg-[#181818] rounded-lg animate-pulse">
              <div className="w-12 h-12 bg-[#282828] rounded-md"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[#282828] rounded w-3/4"></div>
                <div className="h-3 bg-[#282828] rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${className}`}>
        {showHeader && (
          <h2 className="text-xl font-bold mb-4 text-white">Made for you</h2>
        )}
        <div className="p-4 bg-[#181818] rounded-lg">
          <div className="flex items-center space-x-2 text-[#b3b3b3]">
            <Sparkles className="w-5 h-5" />
            <span>Error loading recommendations</span>
          </div>
          <p className="text-sm text-[#b3b3b3] mt-2">{error}</p>
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className={`${className}`}>
        {showHeader && (
          <h2 className="text-xl font-bold mb-4 text-white">Made for you</h2>
        )}
        <div className="p-4 bg-[#181818] rounded-lg">
          <div className="flex items-center space-x-2 text-[#b3b3b3]">
            <Sparkles className="w-5 h-5" />
            <span>No recommendations yet</span>
          </div>
          <p className="text-sm text-[#b3b3b3] mt-2">Start listening to get personalized recommendations</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      {showHeader && (
        <h2 className="text-xl font-bold mb-4 text-white">Made for you</h2>
      )}
      <div className="space-y-2">
        {recommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className="flex items-center space-x-3 p-3 bg-[#181818] hover:bg-[#282828] rounded-lg transition-colors cursor-pointer group"
            onClick={() => onPlayTrack?.(recommendation)}
          >
            {recommendation.album_art ? (
              <img 
                src={recommendation.album_art} 
                alt={recommendation.song_title}
                className="w-12 h-12 rounded-md object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-[#282828] rounded-md flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#b3b3b3]" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white truncate">{recommendation.song_title}</div>
              <div className="text-sm text-[#b3b3b3] truncate">{recommendation.artist_name}</div>
              {recommendation.recommendation_reason && (
                <div className="text-xs text-[#b3b3b3] mt-1">
                  {recommendation.recommendation_reason}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-xs">
              {recommendation.duration_ms && (
                <span className="text-[#b3b3b3]">{formatDuration(recommendation.duration_ms)}</span>
              )}
              {recommendation.confidence_score && (
                <div className={`flex items-center space-x-1 ${getConfidenceColor(recommendation.confidence_score)}`}>
                  {getConfidenceIcon(recommendation.confidence_score)}
                  <span>{recommendation.confidence_score}%</span>
                </div>
              )}
            </div>
            
            <button 
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[#404040] rounded-full"
              onClick={(e) => {
                e.stopPropagation()
                onPlayTrack?.(recommendation)
              }}
            >
              <Play className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
} 