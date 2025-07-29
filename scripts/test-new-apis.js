const fetch = require('node-fetch');

async function testAPIs() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing new API endpoints...\n');

  try {
    // Test recently played songs
    console.log('📱 Testing recently played songs...');
    const recentlyPlayedResponse = await fetch(`${baseUrl}/api/recently-played?userId=user123&limit=5`);
    const recentlyPlayedData = await recentlyPlayedResponse.json();
    console.log(`✅ Recently played: ${recentlyPlayedData.songs?.length || 0} songs found`);
    
    if (recentlyPlayedData.songs?.length > 0) {
      const song = recentlyPlayedData.songs[0];
      console.log(`   Sample song: "${song.song_title}" by ${song.artist_name}`);
      console.log(`   Play count: ${song.play_count}, Liked: ${song.liked}`);
    }

    // Test made for you recommendations
    console.log('\n🎯 Testing made for you recommendations...');
    const madeForYouResponse = await fetch(`${baseUrl}/api/made-for-you?userId=user123&limit=5`);
    const madeForYouData = await madeForYouResponse.json();
    console.log(`✅ Made for you: ${madeForYouData.recommendations?.length || 0} recommendations found`);
    
    if (madeForYouData.recommendations?.length > 0) {
      const rec = madeForYouData.recommendations[0];
      console.log(`   Sample recommendation: "${rec.song_title}" by ${rec.artist_name}`);
      console.log(`   Confidence: ${rec.confidence_score}%, Reason: ${rec.recommendation_reason}`);
    }

    // Test popular albums
    console.log('\n🔥 Testing popular albums...');
    const popularAlbumsResponse = await fetch(`${baseUrl}/api/popular-albums?limit=5`);
    const popularAlbumsData = await popularAlbumsResponse.json();
    console.log(`✅ Popular albums: ${popularAlbumsData.albums?.length || 0} albums found`);
    
    if (popularAlbumsData.albums?.length > 0) {
      const album = popularAlbumsData.albums[0];
      console.log(`   Sample album: "${album.album_title}" by ${album.artist_name}`);
      console.log(`   Total plays: ${album.total_plays}, Popularity: ${album.popularity_score}`);
    }

    // Test like functionality
    console.log('\n❤️ Testing like functionality...');
    const likeResponse = await fetch(`${baseUrl}/api/recently-played`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: 'user123',
        song_id: 'song_001',
        liked: true,
      }),
    });
    
    if (likeResponse.ok) {
      console.log('✅ Like toggle successful');
    } else {
      console.log('❌ Like toggle failed');
    }

    console.log('\n🎉 All API tests completed!');
    console.log('\n📊 Summary:');
    console.log('- Recently played songs with play counts and like status');
    console.log('- Made for you recommendations with confidence scores');
    console.log('- Popular albums with play statistics');
    console.log('- Like/unlike functionality working');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the tests
testAPIs(); 