-- Migration: Add watch_url column to existing banners table
-- Version: 04
-- Description: Adds watch_url field to banners table for custom "Watch Now" button links

-- Add watch_url column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'banners' AND column_name = 'watch_url'
    ) THEN
        ALTER TABLE banners ADD COLUMN watch_url TEXT;
    END IF;
END $$;

-- Update existing banners with sample watch URLs if they don't have them
UPDATE banners 
SET watch_url = CASE 
    WHEN title = 'SOLO LEVELING' THEN '/video-player?anime=solo-leveling&episode=1'
    WHEN title = 'Attack on Titan' THEN '/video-player?anime=attack-on-titan&episode=1'
    WHEN title = 'Demon Slayer' THEN '/video-player?anime=demon-slayer&episode=1'
    ELSE '/video-player?anime=' || LOWER(REPLACE(title, ' ', '-')) || '&episode=1'
END
WHERE watch_url IS NULL;