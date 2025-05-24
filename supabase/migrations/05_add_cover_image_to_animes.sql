
-- Migration: Add cover_image column to animes table
-- Version: 05
-- Description: Adds cover_image field to animes table for banner images on detail pages

-- Add cover_image column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'animes' AND column_name = 'cover_image'
    ) THEN
        ALTER TABLE animes ADD COLUMN cover_image TEXT;
    END IF;
END $$;
