"use client"

import { Play, User } from "lucide-react"
import { useState } from "react"
import RecentlyPlayedList, { RecentlyPlayedSong } from "./recently-played-list"
import PlaylistList from "./playlistlist"
import StoreLikedSongsList from "./storelikedsongslist"
import MadeForYouList, { MadeForYouRecommendation } from "./made-for-you-list"
import PopularAlbumsList, { PopularAlbum } from "./popular-albums-list"
import StoreUserFavoritesList from "./storeuserfavoriteslist"

interface Track {
  id: string
  title: string
  artist: string
  album: string
  albumArt: string
  duration: number
}

interface MusicCardProps {
  title: string
  artist: string
  image?: string
  size?: "small" | "medium" | "large"
  className?: string
  onPlay?: () => void
}

function MusicCard({ title, artist, image, size = "medium", className = "", onPlay }: MusicCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const sizeClasses = {
    small: "w-[180px] h-[180px]",
    medium: "w-full aspect-square",
    large: "w-full aspect-square"
  }

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onPlay?.()
  }

  return (
    <div 
      className={`group cursor-pointer p-4 rounded-lg transition-all duration-300 hover:bg-[var(--color-interactive-hover)] border border-transparent hover:border-gray-600/50 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative ${sizeClasses[size]} mb-4`}>
        <div className="w-full h-full bg-[var(--color-muted)] rounded-lg flex items-center justify-center overflow-hidden">
          {image ? (
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-chart-1)] opacity-20 rounded-lg"></div>
          )}
        </div>
        
        {/* Play button overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div 
            onClick={handlePlayClick}
            className="w-12 h-12 bg-[var(--color-primary)] rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110 cursor-pointer"
          >
            <Play className="w-5 h-5 text-black fill-black ml-1" />
          </div>
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="font-medium text-[var(--color-text-primary)] text-sm truncate">{title}</h3>
        <p className="text-[var(--color-text-secondary)] text-xs truncate">{artist}</p>
      </div>
    </div>
  )
}

interface SpotifyMainContentProps {
  onPlayTrack?: (track: Track) => void
  onToggleLike?: (song: RecentlyPlayedSong) => void
}

export default function SpotifyMainContent({ onPlayTrack, onToggleLike }: SpotifyMainContentProps) {
  const handlePlayRecentlyPlayedSong = (song: RecentlyPlayedSong) => {
    const track: Track = {
      id: song.song_id,
      title: song.song_title,
      artist: song.artist_name,
      album: song.song_title,
      albumArt: song.album_art || '/api/placeholder/56/56',
      duration: song.duration_ms ? Math.floor(song.duration_ms / 1000) : 0
    }
    onPlayTrack?.(track)
  }

  const handlePlayMadeForYouSong = (recommendation: MadeForYouRecommendation) => {
    const track: Track = {
      id: recommendation.song_id,
      title: recommendation.song_title,
      artist: recommendation.artist_name,
      album: recommendation.album_name,
      albumArt: recommendation.album_art || '/api/placeholder/56/56',
      duration: recommendation.duration_ms ? Math.floor(recommendation.duration_ms / 1000) : 0
    }
    onPlayTrack?.(track)
  }

  const handlePlayPopularAlbum = (album: PopularAlbum) => {
    // For albums, we'll create a track with the album title as the song
    const track: Track = {
      id: album.album_id,
      title: album.album_title,
      artist: album.artist_name,
      album: album.album_title,
      albumArt: album.album_art || '/api/placeholder/56/56',
      duration: 0 // Albums don't have a single duration
    }
    onPlayTrack?.(track)
  }

  return (
    <div className="bg-[var(--color-background-primary)] text-[var(--color-text-primary)] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-0">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Good afternoon</h1>
        </div>
        <div className="w-8 h-8 bg-[var(--color-muted)] rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-[var(--color-text-secondary)]" />
        </div>
      </div>

      {/* Recently Played Songs from API */}
      <section className="px-6 py-8">
        <RecentlyPlayedList 
          userId="user123"
          limit={20}
          onPlayTrack={handlePlayRecentlyPlayedSong}
          onToggleLike={onToggleLike}
          showHeader={true}
          className="mb-8"
        />
      </section>

      {/* Made for You Recommendations */}
      <section className="px-6 py-8">
        <MadeForYouList 
          userId="user123"
          limit={10}
          onPlayTrack={handlePlayMadeForYouSong}
          showHeader={true}
          className="mb-8"
        />
      </section>

      {/* Popular Albums */}
      <section className="px-6 py-8">
        <PopularAlbumsList 
          limit={10}
          onPlayAlbum={handlePlayPopularAlbum}
          showHeader={true}
          className="mb-8"
        />
      </section>

      <style jsx>{`
        .scrollbar-hide {
          /* Hide scrollbar for Chrome, Safari and Opera */
          -webkit-scrollbar: hidden;
        }
        
        .scrollbar-hide {
          /* Hide scrollbar for IE, Edge and Firefox */
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}