"use client"

import { useState, useEffect } from 'react'
import { Play, Clock, Music, Heart, HeartOff } from 'lucide-react'

// Type for recently played song
export interface RecentlyPlayedSong {
  id: number
  user_id: string
  song_id: string
  song_title: string
  artist_name: string
  album_art?: string
  played_at: string
  duration_ms?: number
  liked?: boolean
  play_count?: number
}

interface RecentlyPlayedListProps {
  userId?: string
  limit?: number
  className?: string
  onPlayTrack?: (song: RecentlyPlayedSong) => void
  onToggleLike?: (song: RecentlyPlayedSong) => void
  showHeader?: boolean
}

export default function RecentlyPlayedList({
  userId = 'user123',
  limit = 10,
  className = '',
  onPlayTrack,
  onToggleLike,
  showHeader = true
}: RecentlyPlayedListProps) {
  const [songs, setSongs] = useState<RecentlyPlayedSong[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecentlyPlayed = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/recently-played?userId=${userId}&limit=${limit}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch recently played songs')
        }
        
        const data = await response.json()
        setSongs(data.songs || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching recently played songs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentlyPlayed()
  }, [userId, limit])

  const formatDuration = (ms?: number) => {
    if (!ms) return ''
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const formatPlayedAt = (playedAt: string) => {
    const date = new Date(playedAt)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  if (loading) {
    return (
      <div className={`${className}`}>
        {showHeader && (
          <h2 className="text-xl font-bold mb-4 text-white">Recently Played</h2>
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
          <h2 className="text-xl font-bold mb-4 text-white">Recently Played</h2>
        )}
        <div className="p-4 bg-[#181818] rounded-lg">
          <div className="flex items-center space-x-2 text-[#b3b3b3]">
            <Music className="w-5 h-5" />
            <span>Error loading recently played songs</span>
          </div>
          <p className="text-sm text-[#b3b3b3] mt-2">{error}</p>
        </div>
      </div>
    )
  }

  if (songs.length === 0) {
    return (
      <div className={`${className}`}>
        {showHeader && (
          <h2 className="text-xl font-bold mb-4 text-white">Recently Played</h2>
        )}
        <div className="p-4 bg-[#181818] rounded-lg">
          <div className="flex items-center space-x-2 text-[#b3b3b3]">
            <Clock className="w-5 h-5" />
            <span>No recently played songs</span>
          </div>
          <p className="text-sm text-[#b3b3b3] mt-2">Start listening to see your history here</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      {showHeader && (
        <h2 className="text-xl font-bold mb-4 text-white">Recently Played</h2>
      )}
      <div className="space-y-2">
        {songs.map((song) => (
          <div
            key={song.id}
            className="flex items-center space-x-3 p-3 bg-[#181818] hover:bg-[#282828] rounded-lg transition-colors cursor-pointer group"
            onClick={() => onPlayTrack?.(song)}
          >
            {song.album_art ? (
              <img 
                src={song.album_art} 
                alt={song.song_title}
                className="w-12 h-12 rounded-md object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-[#282828] rounded-md flex items-center justify-center">
                <Music className="w-6 h-6 text-[#b3b3b3]" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white truncate">{song.song_title}</div>
              <div className="text-sm text-[#b3b3b3] truncate">{song.artist_name}</div>
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-[#b3b3b3]">
              {song.duration_ms && (
                <span>{formatDuration(song.duration_ms)}</span>
              )}
              <span>{formatPlayedAt(song.played_at)}</span>
              {song.play_count && song.play_count > 1 && (
                <span className="text-[#1db954]">{song.play_count} plays</span>
              )}
            </div>
            
            <div className="flex items-center space-x-1">
              <button 
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[#404040] rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleLike?.(song)
                }}
              >
                {song.liked ? (
                  <Heart className="w-4 h-4 text-[#1db954] fill-[#1db954]" />
                ) : (
                  <HeartOff className="w-4 h-4 text-[#b3b3b3]" />
                )}
              </button>
              
              <button 
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[#404040] rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  onPlayTrack?.(song)
                }}
              >
                <Play className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 