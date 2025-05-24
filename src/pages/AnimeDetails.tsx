
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Anime } from "@/types/anime";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Star, Info, Calendar, FileVideo, Play } from "lucide-react";
import EpisodeDownloadList from "@/components/EpisodeDownloadList";
import { getAnimeById } from "@/lib/animeData";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useIsMobile, useResponsive } from "@/hooks/use-mobile";

const AnimeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { isTablet } = useResponsive();

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        setIsLoading(true);
        if (!id) {
          throw new Error("Anime ID is required");
        }
        const data = await getAnimeById(id);
        if (!data) {
          throw new Error("Anime not found");
        }
        setAnime(data);
      } catch (err) {
        console.error("Error fetching anime:", err);
        setError(err instanceof Error ? err.message : "Failed to load anime data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnime();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex flex-col justify-center items-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <span className="text-lg">Loading anime details...</span>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-muted-foreground mb-6">{error || "Anime not found"}</p>
          <Button onClick={() => navigate('/browse')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero banner with responsive height */}
      <div className="relative w-full h-[30vh] sm:h-[35vh] md:h-[40vh] lg:h-[50vh] overflow-hidden">
        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10"></div>
        
        {/* Side gradients for visual flair */}
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-primary/30 to-transparent opacity-40 z-5"></div>
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-primary/30 to-transparent opacity-40 z-5"></div>
        
        {/* Background image with subtle motion effect */}
        <motion.div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ 
            backgroundImage: `url(${anime.coverImage || anime.imageUrl})`,
          }}
          initial={{ scale: 1.05 }}
          animate={{ 
            scale: 1.08,
            y: -5
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            repeatType: "reverse", 
            ease: "easeInOut" 
          }}
        ></motion.div>
        
        {/* Content container with improved spacing */}
        <div className="container mx-auto px-4 relative z-20 h-full flex flex-col justify-end pb-6 sm:pb-8 md:pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "default"}
              onClick={() => navigate(-1)} 
              className="mb-3 md:mb-6 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 drop-shadow-md line-clamp-2">{anime.title}</h1>
            
            {/* Quick info section with badges - horizontal scrolling on mobile */}
            <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:gap-3 sm:pb-0 sm:mb-3 hide-scrollbar">
              {anime.releaseYear && (
                <Badge variant="secondary" className="bg-primary/20 backdrop-blur-md text-white border-primary/30 px-2 py-1 text-xs sm:text-sm whitespace-nowrap">
                  <Calendar className="h-3 w-3 mr-1" /> {anime.releaseYear}
                </Badge>
              )}
              {anime.episodes && (
                <Badge variant="secondary" className="bg-primary/20 backdrop-blur-md text-white border-primary/30 px-2 py-1 text-xs sm:text-sm whitespace-nowrap">
                  <FileVideo className="h-3 w-3 mr-1" /> {anime.episodes} Episodes
                </Badge>
              )}
              {anime.genres && anime.genres.length > 0 && (
                <Badge variant="secondary" className="bg-primary/20 backdrop-blur-md text-white border-primary/30 px-2 py-1 text-xs sm:text-sm whitespace-nowrap">
                  {anime.genres[0]}
                </Badge>
              )}
            </div>
            
            {/* Brief description preview - hidden on very small screens */}
            {anime.description && !isMobile && (
              <p className="hidden sm:block text-white/80 text-xs md:text-sm max-w-2xl line-clamp-2 backdrop-blur-sm bg-black/10 p-2 rounded-md">
                {anime.description}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Main content area with responsive grid */}
      <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)] md:grid-cols-[minmax(0,300px)_1fr] gap-4 sm:gap-6 md:gap-8">
          {/* Left column - anime poster and info */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            <div className="flex flex-row sm:flex-col gap-4">
              {/* Anime poster with responsive sizing */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-1/3 sm:w-full max-w-[300px] aspect-[2/3] bg-background rounded-lg overflow-hidden shadow-[0_0_15px_rgba(255,0,0,0.2)] sm:shadow-[0_0_25px_rgba(255,0,0,0.3)]"
              >
                <img 
                  src={anime.imageUrl || anime.coverImage} 
                  alt={anime.title}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=500";
                  }}
                />
              </motion.div>

              {/* Quick info on mobile only */}
              <div className="w-2/3 sm:hidden flex flex-col justify-center space-y-3">
                {anime.releaseYear && (
                  <div className="bg-gradient-to-br from-secondary/40 to-primary/10 backdrop-blur-md p-3 rounded-lg border border-primary/30 flex items-center shadow hover:shadow-primary/10 hover:border-primary/40 transition-all">
                    <div className="p-1.5 rounded-full bg-primary/20 mr-2">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Year</h3>
                      <p className="font-bold text-base">{anime.releaseYear}</p>
                    </div>
                  </div>
                )}
                
                {anime.episodes && (
                  <div className="bg-gradient-to-br from-secondary/40 to-primary/10 backdrop-blur-md p-3 rounded-lg border border-primary/30 flex items-center shadow hover:shadow-primary/10 hover:border-primary/40 transition-all">
                    <div className="p-1.5 rounded-full bg-primary/20 mr-2">
                      <FileVideo className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Episodes</h3>
                      <p className="font-bold text-base">{anime.episodes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced anime info cards - tablet/desktop only */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden sm:grid grid-cols-2 gap-3"
            >
              {anime.releaseYear && (
                <div className="bg-gradient-to-br from-secondary/40 to-primary/10 backdrop-blur-md p-3 sm:p-4 rounded-lg border border-primary/30 flex items-center shadow-lg hover:shadow-primary/10 hover:border-primary/40 transition-all duration-300">
                  <div className="p-1.5 sm:p-2 rounded-full bg-primary/20 mr-2 sm:mr-3">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Year</h3>
                    <p className="font-bold text-base sm:text-lg">{anime.releaseYear}</p>
                  </div>
                </div>
              )}
              {anime.episodes && (
                <div className="bg-gradient-to-br from-secondary/40 to-primary/10 backdrop-blur-md p-3 sm:p-4 rounded-lg border border-primary/30 flex items-center shadow-lg hover:shadow-primary/10 hover:border-primary/40 transition-all duration-300">
                  <div className="p-1.5 sm:p-2 rounded-full bg-primary/20 mr-2 sm:mr-3">
                    <FileVideo className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Episodes</h3>
                    <p className="font-bold text-base sm:text-lg">{anime.episodes}</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Genres - shown on all screens */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-secondary/20 p-3 sm:p-4 rounded-lg border border-primary/20 shadow-lg"
            >
              <h3 className="text-sm font-medium mb-2 sm:mb-3 text-foreground flex items-center">
                <span className="h-4 w-1 bg-primary rounded-full mr-2"></span>
                Genres
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {anime.genres?.map((genre) => (
                  <Badge 
                    key={genre} 
                    variant="outline" 
                    className="bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30 text-xs py-1 px-2 sm:px-3 hover:scale-105 transition-transform cursor-default"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right column - anime description and episodes */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4 sm:space-y-6 md:space-y-8"
          >
            {/* Enhanced anime description with styled box */}
            <div className="bg-gradient-to-br from-secondary/30 to-secondary/10 p-4 sm:p-6 rounded-lg border border-primary/20 shadow-lg relative overflow-hidden group">
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
              
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center relative">
                <div className="p-1.5 sm:p-2 rounded-md bg-primary/10 mr-2 sm:mr-3 group-hover:bg-primary/20 transition-colors">
                  <Info className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <span className="relative">
                  About
                  <span className="absolute -bottom-1 left-0 w-1/3 h-0.5 bg-primary rounded-full"></span>
                </span>
              </h2>
              <p className="text-foreground/90 leading-relaxed text-sm sm:text-base md:text-lg relative z-10">
                {anime.description || "No description available."}
              </p>
            </div>

            {/* Enhanced download section with better visual elements */}
            <div className="space-y-3 sm:space-y-4 md:space-y-5">
              <div className="flex items-center">
                <div className="h-8 sm:h-10 w-1.5 bg-gradient-to-b from-primary to-primary/30 rounded-full mr-2 sm:mr-3 shadow-lg shadow-primary/20"></div>
                <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Episodes</h2>
              </div>

              <div className="bg-gradient-to-br from-secondary/20 to-background border border-primary/20 rounded-xl shadow-xl overflow-hidden">
                <div className="bg-primary/5 border-b border-primary/10 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                  {anime.downloadLinks && anime.downloadLinks.length > 0 ? (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-base sm:text-lg font-medium flex items-center">
                        <div className="p-1 sm:p-1.5 rounded-md bg-primary/10 mr-2 sm:mr-2.5">
                          <Play className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        </div>
                        Watch or Download Episodes
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-0">
                        <span className="text-primary font-semibold">{anime.episodes}</span> episodes available
                      </p>
                    </div>
                  ) : (
                    <h3 className="text-base sm:text-lg font-medium flex items-center">
                      <div className="p-1 sm:p-1.5 rounded-md bg-primary/10 mr-2 sm:mr-2.5">
                        <Info className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                      </div>
                      Episode Status
                    </h3>
                  )}
                </div>
                
                <div className="p-3 sm:p-4 md:p-6">
                  {anime.downloadLinks && anime.downloadLinks.length > 0 ? (
                    <div>
                      <div className="bg-primary/5 p-2 sm:p-3 rounded-lg mb-3 sm:mb-4 border border-primary/10">
                        <p className="text-xs sm:text-sm flex items-center">
                          <Info className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-primary/70" />
                          Use the filters below to find specific episodes.
                        </p>
                      </div>
                      <EpisodeDownloadList 
                        downloadLinks={anime.downloadLinks || []} 
                        episodeCount={anime.episodes}
                        animeId={anime.id}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center bg-secondary/10 rounded-lg">
                      <div className="relative">
                        <Download className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-3 sm:mb-4 opacity-50" />
                        <div className="absolute inset-0 animate-ping h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-primary/10 opacity-75"></div>
                      </div>
                      <p className="text-base sm:text-lg font-medium text-muted-foreground">No episodes available yet</p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-md px-3">We're working on adding episodes for this anime. Check back later for updates.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AnimeDetails;
