
# Supabase Integration Guide

## Overview

This application uses Supabase as its backend database service. It provides storage for anime data and download links, as well as authentication.

## Connection Details

The application connects to Supabase using the following configuration:

```typescript
// From src/integrations/supabase/client.ts
const SUPABASE_URL = import.meta.env.VITE_APP_SUPABASE_URL
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_APP_SUPABASE_ANON_KEY
```

## Database Schema

### Tables

1. **animes** - Stores information about anime titles
   - id (UUID, PK)
   - title (TEXT)
   - description (TEXT)
   - image_url (TEXT)
   - release_year (INTEGER)
   - episodes (INTEGER) 
   - genres (TEXT[])
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

2. **download_links** - Stores download links for anime episodes
   - id (UUID, PK)
   - anime_id (UUID, FK to animes)
   - quality (TEXT)
   - url (TEXT)
   - episode_number (INTEGER)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

### Relationships

- `download_links.anime_id` references `animes.id` with CASCADE delete

## Row Level Security (RLS)

RLS is disabled on both tables to allow public access:

```sql
ALTER TABLE animes DISABLE ROW LEVEL SECURITY;
ALTER TABLE download_links DISABLE ROW LEVEL SECURITY;
```

## Policies

The following policies are in place:

```sql
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

## Using the Supabase Client

Import the Supabase client in your components or services:

```typescript
import { supabase } from '@/integrations/supabase/client';
```

### Example: Fetching all animes

```typescript
const fetchAnimes = async () => {
  const { data, error } = await supabase
    .from('animes')
    .select('*, download_links(*)');
  
  if (error) {
    console.error('Error fetching animes:', error);
    return [];
  }
  
  return data;
};
```
