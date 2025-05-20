
-- Create anime table
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create download links table
CREATE TABLE IF NOT EXISTS download_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anime_id UUID NOT NULL REFERENCES animes(id) ON DELETE CASCADE,
  quality TEXT NOT NULL,
  url TEXT NOT NULL,
  episode_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_download_links_anime_id ON download_links(anime_id);
CREATE INDEX idx_animes_title ON animes(title);

-- First, disable row level security (RLS) on these tables to allow public access
ALTER TABLE animes DISABLE ROW LEVEL SECURITY;
ALTER TABLE download_links DISABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations on animes table (since we're not doing authentication yet)
DO $$
BEGIN
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
END$$;

-- Create policies that allow all operations on download_links table
DO $$
BEGIN
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
END$$;

-- Add cascade delete constraint if not exists already
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'download_links_anime_id_fkey'
  ) THEN
    ALTER TABLE download_links
    ADD CONSTRAINT download_links_anime_id_fkey
    FOREIGN KEY (anime_id)
    REFERENCES animes(id)
    ON DELETE CASCADE;
  END IF;
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END$$;

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_animes_updated_at
BEFORE UPDATE ON animes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_download_links_updated_at
BEFORE UPDATE ON download_links
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
