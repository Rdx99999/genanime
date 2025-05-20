
# AniStream Documentation

## Overview

AniStream is a responsive web application for browsing and managing anime content, with features for both users and administrators. The application is built using React, TypeScript, Tailwind CSS, and Supabase for backend functionality.

## Architecture

The application follows a modern React component architecture with the following key parts:

1. **Frontend Components**: React components using Tailwind CSS for styling
2. **State Management**: React hooks and context for local state management
3. **Backend Integration**: Supabase for data storage, authentication, and API
4. **Routing**: React Router for navigation

## Core Features

### User Features
- Browse anime catalog
- View detailed information about each anime
- Download episodes in different qualities
- Responsive design for mobile, tablet, and desktop

### Admin Features
- Add, edit, and delete anime entries
- Manage download links for each anime
- Filter and search anime content

## Database Schema

The application uses Supabase with the following database tables:

### animes
- `id`: UUID (primary key)
- `title`: TEXT
- `description`: TEXT
- `image_url`: TEXT
- `release_year`: INTEGER
- `episodes`: INTEGER
- `genres`: TEXT[]
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### download_links
- `id`: UUID (primary key)
- `anime_id`: UUID (foreign key to animes.id)
- `quality`: TEXT
- `url`: TEXT
- `episode_number`: INTEGER
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

## Technical Implementation

### Responsive Design

The application uses Tailwind CSS for responsive design with:
- Mobile-first approach
- Breakpoint-based layouts
- Flexbox and Grid for component arrangement
- Dynamic component sizing based on viewport

Breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1023px
- Desktop: ≥ 1024px

### Components Structure

- `src/pages/`: Main page components
- `src/components/`: Reusable UI components
- `src/lib/`: Business logic and data handling
- `src/hooks/`: Custom React hooks
- `src/types/`: TypeScript type definitions

### Key Components

1. **AnimeCard**: Displays anime preview information
2. **AnimeForm**: Form for creating and editing anime entries
3. **HeroSection**: Landing page hero component
4. **Navbar**: Navigation component for users
5. **AdminNavbar**: Navigation component for administrators

## Data Flow

1. User interactions trigger component state changes
2. Data operations are handled through service functions in `lib/animeData.ts`
3. Service functions interact with Supabase for database operations
4. Components update based on data changes

## Getting Started for Developers

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. The application will be available at `http://localhost:5173/`

## Deployment

The application can be deployed through the Lovable platform:
1. Click the "Publish" button in the Lovable editor
2. Choose deployment options
3. Your application will be deployed to a production URL

## Future Enhancements

- User authentication
- User favorites and watchlist
- Episode streaming capabilities
- Advanced search and filter options
- User reviews and ratings
