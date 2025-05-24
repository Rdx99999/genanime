
import { useEffect, useState } from "react";
import { getAllAnimes } from "@/lib/animeData";
import { Anime } from "@/types/anime";
import Navbar from "@/components/Navbar";
import AnimeCard from "@/components/AnimeCard";
import AnimeSlider from "@/components/AnimeSlider";
import EpisodeDownloadList from "@/components/EpisodeDownloadList";
import RotatingBanner from "@/components/RotatingBanner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Footer from "@/components/Footer";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [filteredAnimes, setFilteredAnimes] = useState<Anime[]>([]);
  // Remove popup state variables
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

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
      setFilteredAnimes(animes);
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
      <RotatingBanner />

      <div className="w-full px-4 sm:px-6 lg:container lg:mx-auto py-6 md:py-10">
        <div className="flex flex-col mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Explore Anime</h2>
          <p className="text-foreground/70 max-w-2xl text-xs sm:text-sm md:text-base">
            Discover the best anime from our collection, ready to stream and download in high quality
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
          <div className="flex flex-col justify-center items-center py-12 sm:py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
            <span className="text-base sm:text-lg">Loading animes...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12 sm:py-20">
            <p className="text-red-500 text-base sm:text-xl mb-4">{error}</p>
            <Button onClick={() => fetchAnimes()} size={isMobile ? "sm" : "default"}>
              Try Again
            </Button>
          </div>
        ) : (
          <>
            {filteredAnimes && filteredAnimes.length > 0 ? (
              <div className="space-y-6 sm:space-y-8 md:space-y-12">
                <AnimeSlider 
                  title="Featured Anime" 
                  description="Most popular titles" 
                  animes={filteredAnimes.slice(0, 10)} 
                  onAnimeClick={openAnimeDetails} 
                />

                <AnimeSlider 
                  title="New Releases" 
                  description="Latest episodes and shows" 
                  animes={filteredAnimes.slice(10, 20)} 
                  onAnimeClick={openAnimeDetails} 
                />

                <AnimeSlider 
                  title="Popular Anime" 
                  description="Top-rated titles" 
                  animes={filteredAnimes.filter(anime => anime.isPopular).slice(0, 10)} 
                  onAnimeClick={openAnimeDetails} 
                />

                <AnimeSlider 
                  title="New Releases" 
                  description="Latest additions" 
                  animes={filteredAnimes.filter(anime => anime.isNewRelease).slice(0, 10)} 
                  onAnimeClick={openAnimeDetails} 
                />
              </div>
            ) : (
              <div className="text-center py-12 sm:py-20">
                {searchQuery ? (
                  <p className="text-base sm:text-xl text-foreground/70">No anime found matching "{searchQuery}"</p>
                ) : (
                  <p className="text-base sm:text-xl text-foreground/70">No anime available at the moment</p>
                )}
                <p className="mt-2 text-sm sm:text-base">Check back later or add some from the admin panel</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Dialog removed - using full anime details page instead */}

      <Footer />
    </div>
  );
};

export default Index;
