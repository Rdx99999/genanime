import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllAnimes } from "@/lib/animeData";
import { Anime } from "@/types/anime";
import AnimeCard from "@/components/AnimeCard";
import EpisodeDownloadList from "@/components/EpisodeDownloadList";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const NewReleases = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [filteredAnimes, setFilteredAnimes] = useState<Anime[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  useEffect(() => {
    if (searchQuery.trim() === "") {
      // Sort by newest release year
      const sortedAnimes = [...animes].sort((a, b) => b.releaseYear - a.releaseYear);
      setFilteredAnimes(sortedAnimes);
    } else {
      const filtered = animes.filter(
        anime => anime.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAnimes(filtered);
    }
  }, [searchQuery, animes]);

  const fetchAnimes = async () => {
    try {
      setIsLoading(true);
      const data = await getAllAnimes();

      // Filter to only show new releases
      const newReleasesAnimes = data.filter(anime => anime.isNewRelease);
      setAnimes(newReleasesAnimes);

      // Sort by newest release year within new releases
      const sortedAnimes = [...newReleasesAnimes].sort((a, b) => b.releaseYear - a.releaseYear);
      setFilteredAnimes(sortedAnimes);
    } catch (err) {
      console.error("Error fetching animes:", err);
      setError("Failed to load anime data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const openAnimeDetails = (anime: Anime) => {
    setSelectedAnime(anime);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container mx-auto px-4 py-6 md:py-12">
        <div className="flex flex-col items-center mb-6 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">New Releases</h2>
          <p className="text-foreground/70 text-center max-w-2xl text-sm md:text-base">
            The latest anime added to our collection, stay up to date with fresh content
          </p>
        </div>

        <div className="flex items-center justify-center mb-4 md:mb-8 max-w-md mx-auto">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 md:gap-6">
                {filteredAnimes.map((anime) => (
                  <div key={anime.id}>
                    <AnimeCard anime={anime} onClick={(e) => {
                      e.preventDefault();
                      openAnimeDetails(anime);
                    }} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                {searchQuery ? (
                  <p className="text-xl text-foreground/70">No anime found matching "{searchQuery}"</p>
                ) : (
                  <p className="text-xl text-foreground/70">No anime available at the moment</p>
                )}
                <p className="mt-2">Check back later or add some from the admin panel</p>
              </div>
            )}
          </>
        )}
      </div>

      <Dialog open={!!selectedAnime} onOpenChange={(open) => !open && setSelectedAnime(null)}>
        {selectedAnime && (
          <DialogContent className="max-w-4xl w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] h-[calc(100vh-2rem)] sm:h-[calc(100vh-4rem)] max-h-[800px] overflow-hidden flex flex-col p-3 sm:p-6">
            <DialogHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 space-y-2 sm:space-y-0">
              <DialogTitle className="text-lg sm:text-xl md:text-2xl line-clamp-2">{selectedAnime.title}</DialogTitle>
              <div className="flex flex-wrap gap-1">
                {selectedAnime.genres?.map((genre) => (
                  <Badge key={genre} variant="secondary" className="text-[10px] sm:text-xs">
                    {genre}
                  </Badge>
                ))}
              </div>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto -mr-3 pr-3 sm:-mr-6 sm:pr-6">
              <div className="grid grid-cols-1 md:grid-cols-[minmax(120px,300px)_1fr] gap-3 sm:gap-4 md:gap-6">
                <div className="relative aspect-[2/3] w-full max-w-[180px] sm:max-w-[300px] mx-auto md:mx-0 bg-muted rounded-lg overflow-hidden">
                  <img 
                    src={selectedAnime.imageUrl} 
                    alt={selectedAnime.title}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h4 className="font-medium text-sm md:text-base mb-1 md:mb-2">Description</h4>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                      {selectedAnime.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    {selectedAnime.releaseYear && (
                      <div>
                        <h4 className="font-medium text-xs sm:text-sm md:text-base mb-1">Year</h4>
                        <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                          {selectedAnime.releaseYear}
                        </p>
                      </div>
                    )}
                    {selectedAnime.episodes && (
                      <div>
                        <h4 className="font-medium text-xs sm:text-sm md:text-base mb-1">Episodes</h4>
                        <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                          {selectedAnime.episodes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium text-sm md:text-base mb-1 md:mb-2">Watch or Download</h4>
                    {selectedAnime.downloadLinks.length > 0 ? (
                      <EpisodeDownloadList downloadLinks={selectedAnime.downloadLinks} />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <Download className="h-8 w-8 text-muted-foreground mb-3 opacity-50" />
                        <p className="text-sm text-muted-foreground">No episodes available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      <Footer />
    </div>
  );
};

export default NewReleases;