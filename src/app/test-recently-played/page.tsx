"use client"

import RecentlyPlayedList, { RecentlyPlayedSong } from '@/components/recently-played-list'

export default function TestRecentlyPlayedPage() {
  const handlePlayTrack = (song: RecentlyPlayedSong) => {
    console.log('Playing track:', song)
    alert(`Playing: ${song.song_title} by ${song.artist_name}`)
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Recently Played List Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Default RecentlyPlayedList */}
          <div className="bg-[#181818] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Default Component</h2>
            <RecentlyPlayedList 
              userId="user123"
              limit={5}
              onPlayTrack={handlePlayTrack}
            />
          </div>

          {/* RecentlyPlayedList without header */}
          <div className="bg-[#181818] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Without Header</h2>
            <RecentlyPlayedList 
              userId="user123"
              limit={3}
              showHeader={false}
              onPlayTrack={handlePlayTrack}
            />
          </div>

          {/* RecentlyPlayedList with custom styling */}
          <div className="bg-[#181818] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Custom Styling</h2>
            <RecentlyPlayedList 
              userId="user123"
              limit={4}
              className="bg-[#282828] p-4 rounded-lg"
              onPlayTrack={handlePlayTrack}
            />
          </div>

          {/* RecentlyPlayedList with different user */}
          <div className="bg-[#181818] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Different User (Empty)</h2>
            <RecentlyPlayedList 
              userId="user456"
              limit={3}
              onPlayTrack={handlePlayTrack}
            />
          </div>
        </div>

        <div className="mt-8 p-6 bg-[#181818] rounded-lg">
          <h2 className="text-xl font-semibold mb-4">API Information</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Endpoint:</strong> GET /api/recently-played?userId=user123&limit=10</p>
            <p><strong>Test Data:</strong> Songs added via POST /api/recently-played</p>
            <p><strong>Features:</strong> Loading states, error handling, empty states</p>
            <p><strong>Styling:</strong> Spotify-inspired dark theme with hover effects</p>
          </div>
        </div>
      </div>
    </div>
  )
} 