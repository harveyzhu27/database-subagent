"use client"

import { useState, useEffect } from 'react'
import { Play, TrendingUp, Flame, Music } from 'lucide-react'

// Type for popular album
export interface PopularAlbum {
  id: number
  album_id: string
  album_title: string
  artist_name: string
  album_art?: string
  genre?: string
  release_date?: string
  total_plays?: number
  weekly_plays?: number
  monthly_plays?: number
  popularity_score?: number
  created_at: string
  updated_at: string
}

interface PopularAlbumsListProps {
  limit?: number
  className?: string
  onPlayAlbum?: (album: PopularAlbum) => void
  showHeader?: boolean
}

export default function PopularAlbumsList({
  limit = 10,
  className = '',
  onPlayAlbum,
  showHeader = true
}: PopularAlbumsListProps) {
  const [albums, setAlbums] = useState<PopularAlbum[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPopularAlbums = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/popular-albums?limit=${limit}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch popular albums')
        }
        
        const data = await response.json()
        setAlbums(data.albums || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching popular albums:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPopularAlbums()
  }, [limit])

  const formatPlayCount = (count?: number) => {
    if (!count) return '0'
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const getPopularityColor = (score?: number) => {
    if (!score) return 'text-gray-400'
    if (score >= 90) return 'text-red-400'
    if (score >= 80) return 'text-orange-400'
    if (score >= 70) return 'text-yellow-400'
    return 'text-gray-400'
  }

  const getPopularityIcon = (score?: number) => {
    if (!score) return null
    if (score >= 90) return <Flame className="w-4 h-4 text-red-400" />
    if (score >= 80) return <TrendingUp className="w-4 h-4 text-orange-400" />
    return null
  }

  if (loading) {
    return (
      <div className={`${className}`}>
        {showHeader && (
          <h2 className="text-xl font-bold mb-4 text-white">Popular Albums</h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-[#181818] rounded-lg p-4 animate-pulse">
              <div className="w-full aspect-square bg-[#282828] rounded-md mb-3"></div>
              <div className="space-y-2">
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
          <h2 className="text-xl font-bold mb-4 text-white">Popular Albums</h2>
        )}
        <div className="p-4 bg-[#181818] rounded-lg">
          <div className="flex items-center space-x-2 text-[#b3b3b3]">
            <Flame className="w-5 h-5" />
            <span>Error loading popular albums</span>
          </div>
          <p className="text-sm text-[#b3b3b3] mt-2">{error}</p>
        </div>
      </div>
    )
  }

  if (albums.length === 0) {
    return (
      <div className={`${className}`}>
        {showHeader && (
          <h2 className="text-xl font-bold mb-4 text-white">Popular Albums</h2>
        )}
        <div className="p-4 bg-[#181818] rounded-lg">
          <div className="flex items-center space-x-2 text-[#b3b3b3]">
            <Flame className="w-5 h-5" />
            <span>No popular albums found</span>
          </div>
          <p className="text-sm text-[#b3b3b3] mt-2">Check back later for trending albums</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      {showHeader && (
        <h2 className="text-xl font-bold mb-4 text-white">Popular Albums</h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {albums.map((album) => (
          <div
            key={album.id}
            className="group cursor-pointer p-4 bg-[#181818] hover:bg-[#282828] rounded-lg transition-colors"
            onClick={() => onPlayAlbum?.(album)}
          >
            <div className="relative mb-3">
              {album.album_art ? (
                <img 
                  src={album.album_art} 
                  alt={album.album_title}
                  className="w-full aspect-square rounded-md object-cover"
                />
              ) : (
                <div className="w-full aspect-square bg-[#282828] rounded-md flex items-center justify-center">
                  <Music className="w-8 h-8 text-[#b3b3b3]" />
                </div>
              )}
              
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 bg-[#1db954] rounded-full flex items-center justify-center shadow-lg">
                  <Play className="w-5 h-5 text-black fill-black ml-1" />
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-medium text-white text-sm truncate">{album.album_title}</h3>
              <p className="text-xs text-[#b3b3b3] truncate">{album.artist_name}</p>
              
              {/* Play statistics */}
              <div className="flex items-center justify-between text-xs text-[#b3b3b3] mt-2">
                <span>{formatPlayCount(album.total_plays)} plays</span>
                {album.popularity_score && (
                  <div className={`flex items-center space-x-1 ${getPopularityColor(album.popularity_score)}`}>
                    {getPopularityIcon(album.popularity_score)}
                    <span>{album.popularity_score}</span>
                  </div>
                )}
              </div>
              
              {/* Weekly plays */}
              {album.weekly_plays && album.weekly_plays > 0 && (
                <div className="text-xs text-[#b3b3b3] mt-1">
                  {formatPlayCount(album.weekly_plays)} this week
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 