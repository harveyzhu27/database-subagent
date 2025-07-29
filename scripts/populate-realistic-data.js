const { Pool } = require('pg');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:piwa0921@localhost:5432/orchids_dev?sslmode=disable',
});

async function populateRealisticData() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Populating database with realistic data...');

    // Sample user IDs
    const userIds = ['user123', 'user456', 'user789'];
    
    // Sample songs for recently played
    const sampleSongs = [
      {
        song_id: 'song_001',
        song_title: 'Blinding Lights',
        artist_name: 'The Weeknd',
        album_art: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
        duration_ms: 200000,
        album_name: 'After Hours'
      },
      {
        song_id: 'song_002',
        song_title: 'Dance Monkey',
        artist_name: 'Tones and I',
        album_art: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
        duration_ms: 209000,
        album_name: 'The Kids Are Coming'
      },
      {
        song_id: 'song_003',
        song_title: 'Shape of You',
        artist_name: 'Ed Sheeran',
        album_art: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
        duration_ms: 233000,
        album_name: '÷ (Divide)'
      },
      {
        song_id: 'song_004',
        song_title: 'Uptown Funk',
        artist_name: 'Mark Ronson ft. Bruno Mars',
        album_art: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
        duration_ms: 270000,
        album_name: 'Uptown Special'
      },
      {
        song_id: 'song_005',
        song_title: 'Despacito',
        artist_name: 'Luis Fonsi ft. Daddy Yankee',
        album_art: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
        duration_ms: 229000,
        album_name: 'Despacito & Mis Grandes Éxitos'
      },
      {
        song_id: 'song_006',
        song_title: 'Someone Like You',
        artist_name: 'Adele',
        album_art: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
        duration_ms: 285000,
        album_name: '21'
      },
      {
        song_id: 'song_007',
        song_title: 'Rolling in the Deep',
        artist_name: 'Adele',
        album_art: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
        duration_ms: 228000,
        album_name: '21'
      },
      {
        song_id: 'song_008',
        song_title: 'Hello',
        artist_name: 'Adele',
        album_art: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
        duration_ms: 295000,
        album_name: '25'
      }
    ];

    // Populate recently played with realistic timestamps and play counts
    console.log('📱 Adding recently played songs...');
    for (const userId of userIds) {
      for (let i = 0; i < sampleSongs.length; i++) {
        const song = sampleSongs[i];
        const playCount = Math.floor(Math.random() * 10) + 1; // 1-10 plays
        const hoursAgo = Math.floor(Math.random() * 168) + 1; // 1-168 hours ago (1 week)
        const playedAt = new Date(Date.now() - (hoursAgo * 60 * 60 * 1000));
        const liked = Math.random() > 0.7; // 30% chance of being liked

        // Check if song already exists for this user
        const existingSong = await client.query(`
          SELECT * FROM recently_played 
          WHERE user_id = $1 AND song_id = $2
        `, [userId, song.song_id]);

        if (existingSong.rows.length > 0) {
          // Update existing record
          await client.query(`
            UPDATE recently_played 
            SET played_at = $1, play_count = play_count + 1, liked = $2
            WHERE user_id = $3 AND song_id = $4
          `, [playedAt, liked, userId, song.song_id]);
        } else {
          // Insert new record
          await client.query(`
            INSERT INTO recently_played (user_id, song_id, song_title, artist_name, album_art, duration_ms, played_at, play_count, liked)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          `, [
          userId,
          song.song_id,
          song.song_title,
          song.artist_name,
          song.album_art,
          song.duration_ms,
          playedAt,
          playCount,
          liked
        ]);
        }
      }
    }

    // Populate "Made for you" recommendations
    console.log('🎯 Adding "Made for you" recommendations...');
    const madeForYouSongs = [
      {
        song_id: 'song_009',
        song_title: 'Levitating',
        artist_name: 'Dua Lipa',
        album_art: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
        album_name: 'Future Nostalgia',
        duration_ms: 203000,
        recommendation_reason: 'Based on your love for pop music',
        confidence_score: 85
      },
      {
        song_id: 'song_010',
        song_title: 'Good 4 U',
        artist_name: 'Olivia Rodrigo',
        album_art: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
        album_name: 'SOUR',
        duration_ms: 178000,
        recommendation_reason: 'Similar to artists you listen to',
        confidence_score: 78
      },
      {
        song_id: 'song_011',
        song_title: 'Stay',
        artist_name: 'The Kid LAROI & Justin Bieber',
        album_art: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
        album_name: 'F*CK LOVE 3: OVER YOU',
        duration_ms: 138000,
        recommendation_reason: 'Trending in your area',
        confidence_score: 92
      },
      {
        song_id: 'song_012',
        song_title: 'As It Was',
        artist_name: 'Harry Styles',
        album_art: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
        album_name: 'Harry\'s House',
        duration_ms: 167000,
        recommendation_reason: 'Based on your recent plays',
        confidence_score: 88
      }
    ];

    for (const userId of userIds) {
      for (const song of madeForYouSongs) {
        await client.query(`
          INSERT INTO made_for_you (user_id, song_id, song_title, artist_name, album_art, album_name, duration_ms, recommendation_reason, confidence_score)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          userId,
          song.song_id,
          song.song_title,
          song.artist_name,
          song.album_art,
          song.album_name,
          song.duration_ms,
          song.recommendation_reason,
          song.confidence_score
        ]);
      }
    }

    // Populate popular albums
    console.log('🔥 Adding popular albums...');
    const popularAlbumsData = [
      {
        album_id: 'album_001',
        album_title: 'Midnights',
        artist_name: 'Taylor Swift',
        album_art: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
        genre: 'Pop',
        total_plays: 15000000,
        weekly_plays: 2500000,
        monthly_plays: 8500000,
        popularity_score: 95
      },
      {
        album_id: 'album_002',
        album_title: 'Un Verano Sin Ti',
        artist_name: 'Bad Bunny',
        album_art: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
        genre: 'Reggaeton',
        total_plays: 12000000,
        weekly_plays: 1800000,
        monthly_plays: 6500000,
        popularity_score: 92
      },
      {
        album_id: 'album_003',
        album_title: 'SOS',
        artist_name: 'SZA',
        album_art: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
        genre: 'R&B',
        total_plays: 8500000,
        weekly_plays: 1200000,
        monthly_plays: 4200000,
        popularity_score: 88
      },
      {
        album_id: 'album_004',
        album_title: '=',
        artist_name: 'Ed Sheeran',
        album_art: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
        genre: 'Pop',
        total_plays: 9500000,
        weekly_plays: 800000,
        monthly_plays: 3800000,
        popularity_score: 85
      },
      {
        album_id: 'album_005',
        album_title: 'Planet Her',
        artist_name: 'Doja Cat',
        album_art: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
        genre: 'Pop',
        total_plays: 7800000,
        weekly_plays: 650000,
        monthly_plays: 3200000,
        popularity_score: 82
      }
    ];

    for (const album of popularAlbumsData) {
      await client.query(`
        INSERT INTO popular_albums (album_id, album_title, artist_name, album_art, genre, total_plays, weekly_plays, monthly_plays, popularity_score)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (album_id) DO UPDATE SET
          total_plays = $6,
          weekly_plays = $7,
          monthly_plays = $8,
          popularity_score = $9,
          updated_at = NOW()
      `, [
        album.album_id,
        album.album_title,
        album.artist_name,
        album.album_art,
        album.genre,
        album.total_plays,
        album.weekly_plays,
        album.monthly_plays,
        album.popularity_score
      ]);
    }

    // Add some user interactions
    console.log('👤 Adding user interactions...');
    const interactionTypes = ['like', 'play', 'skip', 'share'];
    
    for (const userId of userIds) {
      for (const song of sampleSongs.slice(0, 4)) { // Add interactions for first 4 songs
        const interactionType = interactionTypes[Math.floor(Math.random() * interactionTypes.length)];
        const hoursAgo = Math.floor(Math.random() * 72) + 1; // 1-72 hours ago
        const createdAt = new Date(Date.now() - (hoursAgo * 60 * 60 * 1000));

        await client.query(`
          INSERT INTO user_song_interactions (user_id, song_id, interaction_type, created_at)
          VALUES ($1, $2, $3, $4)
        `, [userId, song.song_id, interactionType, createdAt]);
      }
    }

    console.log('✅ Database populated successfully!');
    console.log('\n📊 Summary:');
    console.log('- Recently played songs with realistic timestamps and play counts');
    console.log('- "Made for you" recommendations with confidence scores');
    console.log('- Popular albums with play statistics');
    console.log('- User interactions (likes, plays, skips, shares)');

  } catch (error) {
    console.error('❌ Error populating database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the script
if (require.main === module) {
  populateRealisticData()
    .then(() => {
      console.log('🎉 Population complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Population failed:', error);
      process.exit(1);
    });
}

module.exports = { populateRealisticData }; 