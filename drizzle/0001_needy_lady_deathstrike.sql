CREATE TABLE "album_songs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "albums" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"artist" text NOT NULL,
	"album_art" text,
	"release_date" timestamp,
	"genre" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "made_for_you" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"song_id" text NOT NULL,
	"song_title" text NOT NULL,
	"artist_name" text NOT NULL,
	"album_art" text,
	"album_name" text NOT NULL,
	"duration_ms" integer,
	"recommendation_reason" text,
	"confidence_score" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "popular_albums" (
	"id" serial PRIMARY KEY NOT NULL,
	"album_id" text NOT NULL,
	"album_title" text NOT NULL,
	"artist_name" text NOT NULL,
	"album_art" text,
	"genre" text,
	"release_date" timestamp,
	"total_plays" integer DEFAULT 0,
	"weekly_plays" integer DEFAULT 0,
	"monthly_plays" integer DEFAULT 0,
	"popularity_score" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "popular_albums_album_id_unique" UNIQUE("album_id")
);
--> statement-breakpoint
CREATE TABLE "songs" (
	"id" serial PRIMARY KEY NOT NULL,
	"song_id" text NOT NULL,
	"title" text NOT NULL,
	"artist" text NOT NULL,
	"album" text NOT NULL,
	"album_art" text,
	"duration_ms" integer,
	"genre" text,
	"release_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "songs_song_id_unique" UNIQUE("song_id")
);
--> statement-breakpoint
CREATE TABLE "store_user_favorites" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_song_interactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"song_id" text NOT NULL,
	"interaction_type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "recently_played" ADD COLUMN "liked" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "recently_played" ADD COLUMN "play_count" integer DEFAULT 1;