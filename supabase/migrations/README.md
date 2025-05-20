
# Database Migrations

This directory contains SQL migration files for the Supabase database.

## How to Use

1. Each migration file is numbered sequentially (e.g., 01_initial_schema.sql, 02_add_new_field.sql)
2. To apply migrations manually, run them in order against your Supabase database using the SQL editor in the Supabase dashboard
3. For local development, you can use the Supabase CLI to apply migrations

## Migration Files

- `01_initial_schema.sql`: Creates the initial database schema including animes and download_links tables with proper RLS
- `02_add_popular_new_release_columns.sql`: Adds is_popular and is_new_release columns to the animes table

## Database Schema

The current schema consists of:

1. **animes** table:
   - id (UUID, PK)
   - title (TEXT)
   - description (TEXT)
   - image_url (TEXT)
   - release_year (INTEGER)
   - episodes (INTEGER)
   - genres (TEXT[])
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

2. **download_links** table:
   - id (UUID, PK)
   - anime_id (UUID, FK to animes)
   - quality (TEXT)
   - url (TEXT)
   - episode_number (INTEGER)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

## Security

Row Level Security (RLS) is disabled on both tables to allow public access:
- All operations are permitted on both tables without authentication
- Policies are created to ensure compatibility if RLS is enabled in the future

## Relationships
- `download_links.anime_id` references `animes.id` with CASCADE delete
