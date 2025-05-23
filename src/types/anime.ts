Adding isPopular and isNewRelease properties to the Anime interface.
```
```replit_final_file
export interface DownloadLink {
  id: string;
  quality: string;
  url: string;
  episodeNumber?: number;
  streamable?: boolean;
  thumbnail?: string;
}

export interface Anime {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  releaseYear: number;
  episodes: number;
  genres: string[];
  isPopular?: boolean;
  isNewRelease?: boolean;
  downloadLinks: DownloadLink[];
  rating?: string;
  coverImage?: string;
  type?: string;
  year?: number;
}