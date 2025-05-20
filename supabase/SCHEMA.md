
# Database Schema

This document describes the database schema for the GenAnime application.

## Tables

### animes

| Column       | Type                     | Description                          |
|--------------|--------------------------|--------------------------------------|
| id           | UUID                     | Primary key                          |
| title        | TEXT                     | Anime title                          |
| description  | TEXT                     | Anime description                    |
| image_url    | TEXT                     | URL to the anime cover image         |
| release_year | INTEGER                  | Year when the anime was released     |
| episodes     | INTEGER                  | Number of episodes                   |
| genres       | TEXT[]                   | Array of genre names                 |
| created_at   | TIMESTAMP WITH TIME ZONE | Creation timestamp                   |
| updated_at   | TIMESTAMP WITH TIME ZONE | Last update timestamp                |

### download_links

| Column         | Type                     | Description                         |
|----------------|--------------------------|-------------------------------------|
| id             | UUID                     | Primary key                         |
| anime_id       | UUID                     | Foreign key to animes table         |
| quality        | TEXT                     | Video quality (e.g., "720p", "1080p") |
| url            | TEXT                     | Download URL                        |
| episode_number | INTEGER                  | Episode number                      |
| created_at     | TIMESTAMP WITH TIME ZONE | Creation timestamp                  |
| updated_at     | TIMESTAMP WITH TIME ZONE | Last update timestamp               |

## Relationships

- `download_links.anime_id` references `animes.id` with CASCADE delete

## Indexes

- `idx_download_links_anime_id` on `download_links(anime_id)`
- `idx_animes_title` on `animes(title)`

## Row Level Security (RLS)

RLS is disabled on both tables to allow public access without authentication:

```sql
ALTER TABLE animes DISABLE ROW LEVEL SECURITY;
ALTER TABLE download_links DISABLE ROW LEVEL SECURITY;
```

## Policies

The following policies have been created:

```sql
-- Allow all operations on both tables
CREATE POLICY "Allow all operations on animes"
ON animes
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations on download_links"
ON download_links
FOR ALL
USING (true)
WITH CHECK (true);
```

These policies ensure that all users can perform any operation on the database tables without authentication, which simplifies development. For production environments with user authentication, you might want to enable RLS and implement more restrictive policies.

## Triggers

Automatic timestamp updates:

```sql
-- Update updated_at whenever a record is modified
CREATE TRIGGER update_animes_updated_at
BEFORE UPDATE ON animes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_download_links_updated_at
BEFORE UPDATE ON download_links
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
```

## Schema Creation SQL

The complete SQL for creating this schema is available in:
1. [Initial Schema Creation](./migrations/01_initial_schema.sql)
