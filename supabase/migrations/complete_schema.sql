-- Complete schema file that combines all migrations
-- This file can be run once to set up the entire database schema

-- Function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create anime table (from 01_initial_schema.sql)
CREATE TABLE IF NOT EXISTS animes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  release_year INTEGER NOT NULL,
  episodes INTEGER NOT NULL,
  genres TEXT[] NOT NULL DEFAULT '{}',
  is_popular BOOLEAN DEFAULT false NOT NULL,
  is_new_release BOOLEAN DEFAULT false NOT NULL,
  cover_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create download links table (from 01_initial_schema.sql)
CREATE TABLE IF NOT EXISTS download_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anime_id UUID NOT NULL REFERENCES animes(id) ON DELETE CASCADE,
  quality TEXT NOT NULL,
  url TEXT NOT NULL,
  episode_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create banners table (from 03_add_banners_table.sql)
CREATE TABLE IF NOT EXISTS banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  color TEXT DEFAULT 'from-red-600/70 to-orange-600/30',
  rating TEXT,
  episodes INTEGER,
  button_text TEXT DEFAULT 'Watch Now',
  button_action TEXT DEFAULT 'watch',
  watch_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 1,
  anime_id UUID REFERENCES animes(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_download_links_anime_id ON download_links(anime_id);
CREATE INDEX IF NOT EXISTS idx_animes_title ON animes(title);
CREATE INDEX IF NOT EXISTS idx_banners_active_order ON banners (is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_banners_anime_id ON banners (anime_id);

-- Disable RLS for public access
ALTER TABLE animes DISABLE ROW LEVEL SECURITY;
ALTER TABLE download_links DISABLE ROW LEVEL SECURITY;
ALTER TABLE banners DISABLE ROW LEVEL SECURITY;

-- Create policies for future RLS compatibility
DO $$
BEGIN
  -- Policies for animes table
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Allow all operations on animes' 
    AND tablename = 'animes'
  ) THEN
    CREATE POLICY "Allow all operations on animes"
    ON animes
    FOR ALL
    USING (true)
    WITH CHECK (true);
  END IF;

  -- Policies for download_links table
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Allow all operations on download_links' 
    AND tablename = 'download_links'
  ) THEN
    CREATE POLICY "Allow all operations on download_links"
    ON download_links
    FOR ALL
    USING (true)
    WITH CHECK (true);
  END IF;

  -- Policies for banners table
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Allow all operations on banners' 
    AND tablename = 'banners'
  ) THEN
    CREATE POLICY "Allow all operations on banners"
    ON banners
    FOR ALL
    USING (true)
    WITH CHECK (true);
  END IF;
END$$;

-- Create triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS update_animes_updated_at ON animes;
CREATE TRIGGER update_animes_updated_at
BEFORE UPDATE ON animes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_download_links_updated_at ON download_links;
CREATE TRIGGER update_download_links_updated_at
BEFORE UPDATE ON download_links
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_banners_updated_at ON banners;
CREATE TRIGGER update_banners_updated_at
BEFORE UPDATE ON banners
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Insert default banner data
INSERT INTO banners (title, subtitle, description, image, color, rating, episodes, button_text, button_action, watch_url, is_active, display_order)
VALUES 
  (
    'SOLO LEVELING',
    'Entertainment District Arc',
    'Tanjiro and his friends join the Sound Hashira Tengen Uzui on a mission in the Entertainment District.',
    'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/efaa210d-b55f-407c-bec4-101ae2d536cd/de3iif2-1ef9bdfd-043c-4586-ae57-829bd61cc4cc.png',
    'from-red-600/70 to-orange-600/30',
    '9.2',
    24,
    'Watch Now',
    'watch',
    '/video-player?anime=solo-leveling&episode=1',
    true,
    1
  ),
  (
    'Attack on Titan',
    'Final Season',
    'The final battle between humanity and the titans reaches its climactic conclusion.',
    'https://timelinecovers.pro/facebook-cover/download/anime-attack-on-titan-eren-and-levi-facebook-cover.jpg',
    'from-blue-600/70 to-purple-600/30',
    '9.5',
    12,
    'Continue Watching',
    'watch',
    '/video-player?anime=attack-on-titan&episode=1',
    true,
    2
  ),
  (
    'Demon Slayer',
    'Hashira Training Arc',
    'Tanjiro trains with the Hashira to prepare for the final battle against Muzan.',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
    'from-green-600/70 to-teal-600/30',
    '9.0',
    11,
    'Start Watching',
    'watch',
    '/video-player?anime=demon-slayer&episode=1',
    true,
    3
  )
ON CONFLICT DO NOTHING;
