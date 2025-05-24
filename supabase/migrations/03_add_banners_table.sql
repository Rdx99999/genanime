-- Migration: Add banners table for homepage banner management
-- Version: 03
-- Description: Creates banners table to store customizable homepage banners with watch URLs

-- Create banners table
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

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_banners_active_order ON banners (is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_banners_anime_id ON banners (anime_id);

-- Disable RLS for public access (following existing pattern)
ALTER TABLE banners DISABLE ROW LEVEL SECURITY;

-- Create policies for future RLS compatibility
DO $$
BEGIN
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

-- Create trigger for automatic updated_at timestamp
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
    'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/efaa210d-b55f-407c-bec4-101ae2d536cd/de3iif2-1ef9bdfd-043c-4586-ae57-829bd61cc4cc.png/v1/fill/w_1280,h_427,q_80,strp/solo_leveling_banner_by_godakutsu_de3iif2-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NDI3IiwicGF0aCI6IlwvZlwvZWZhYTIxMGQtYjU1Zi00MDdjLWJlYzQtMTAxYWUyZDUzNmNkXC9kZTNpaWYyLTFlZjliZGZkLTA0M2MtNDU4Ni1hZTU3LTgyOWJkNjFjYzRjYy5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.pvdQB7bL4EhmLd4oKo3eS1u4fjyubbPS_YYKokRRDQM',
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
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070',
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