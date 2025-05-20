
-- Add missing columns for popular and new release features
DO $$
BEGIN
  -- Check if is_popular column exists in animes table
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'animes' AND column_name = 'is_popular'
  ) THEN
    ALTER TABLE animes ADD COLUMN is_popular BOOLEAN DEFAULT false NOT NULL;
  END IF;

  -- Check if is_new_release column exists in animes table
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'animes' AND column_name = 'is_new_release'
  ) THEN
    ALTER TABLE animes ADD COLUMN is_new_release BOOLEAN DEFAULT false NOT NULL;
  END IF;
END$$;
