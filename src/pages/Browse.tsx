import { useEffect, useState } from "react";
import { getAllAnimes } from "@/lib/animeData";
import { Anime } from "@/types/anime";
import Navbar from "@/components/Navbar";
import AnimeCard from "@/components/AnimeCard";
import EpisodeDownloadList from "@/components/EpisodeDownloadList";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Browse = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [filteredAnimes, setFilteredAnimes] = useState<Anime[]>([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [filterGenre, setFilterGenre] = useState("all");
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    fetchAnimes();
  }, []);

  // Check for search parameter in URL
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const searchParam = queryParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [window.location.search]);

  // Extract all unique genres from anime list
  useEffect(() => {
    if (animes.length > 0) {
      const genres = new Set<string>();
      animes.forEach(anime => {
        anime.genres.forEach(genre => {
          genres.add(genre);
        });
      });
      setAvailableGenres(Array.from(genres).sort());
    }
  }, [animes]);

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  useEffect(() => {
    // First filter by search
    let filtered = animes;
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        anime => anime.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply genre filter if not "all"
    if (filterGenre !== "all") {
      filtered = filtered.filter(anime => 
        anime.genres.includes(filterGenre)
      );
    }

    // Then sort the filtered results
    const sorted = [...filtered];
    switch (sortOption) {
      case 'newest':
        sorted.sort((a, b) => b.releaseYear - a.releaseYear);
        break;
      case 'oldest':
        sorted.sort((a, b) => a.releaseYear - b.releaseYear);
        break;
      case 'title_asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title_desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'episodes_high':
        sorted.sort((a, b) => b.episodes - a.episodes);
        break;
      case 'episodes_low':
        sorted.sort((a, b) => a.episodes - b.episodes);
        break;
      default:
        // Default to newest first
        sorted.sort((a, b) => b.releaseYear - a.releaseYear);
    }

    setFilteredAnimes(sorted);
  }, [searchQuery, animes, sortOption, filterGenre]);

  const fetchAnimes = async () => {
    try {
      setIsLoading(true);
      const data = await getAllAnimes();
      setAnimes(data);
      setFilteredAnimes(data);
    } catch (err) {
      console.error("Error fetching animes:", err);
      setError("Failed to load anime data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const openAnimeDetails = (anime: Anime) => {
    navigate(`/anime/${anime.id}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container mx-auto px-4 py-6 md:py-12">
        <div className="flex flex-col items-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Browse Anime</h2>
          <p className="text-foreground/70 text-center max-w-2xl text-sm md:text-base mb-4">
            Explore our complete anime collection with advanced filters and sorting options
          </p>

          {/* Search and Filters */}
          <div className="w-full max-w-4xl mb-6 space-y-4">
            <div className="relative w-full">
              <Input 
                placeholder="Search anime..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Genre:</span>
                <Select value={filterGenre} onValueChange={setFilterGenre}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Genres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    {availableGenres.map(genre => (
                      <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={sortOption} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title_asc">Title (A-Z)</SelectItem>
                    <SelectItem value="title_desc">Title (Z-A)</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="episodes_high">Most Episodes</SelectItem>
                    <SelectItem value="episodes_low">Least Episodes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading animes...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-xl">{error}</p>
            <Button onClick={() => fetchAnimes()} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : (
          <>
            {filteredAnimes && filteredAnimes.length > 0 ? (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  Showing {filteredAnimes.length} of {animes.length} anime titles
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 md:gap-6">
                  {filteredAnimes.map((anime) => (
                    <div key={anime.id}>
                      <AnimeCard anime={anime} onClick={(e) => {
                        e?.preventDefault();
                        openAnimeDetails(anime);
                      }} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                {searchQuery || filterGenre !== "all" ? (
                  <p className="text-xl text-foreground/70">No anime found matching your filters</p>
                ) : (
                  <p className="text-xl text-foreground/70">No anime available at the moment</p>
                )}
                <p className="mt-2">Try adjusting your filters or check back later</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Anime details moved to dedicated page */}

      <footer className="bg-secondary/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-foreground/70">
            © {new Date().getFullYear()} GenAnime. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Browse;