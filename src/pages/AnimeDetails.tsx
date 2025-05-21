import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Anime } from "@/types/anime";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Star, Info, Calendar, FileVideo } from "lucide-react";
import EpisodeDownloadList from "@/components/EpisodeDownloadList";
import { getAnimeById } from "@/lib/animeData";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const AnimeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <div className="container mx-auto px-4 py-24 flex flex-col justify-center items-center">
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
        <div className="container mx-auto px-4 py-12 text-center">
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

      {/* Hero banner with blurred background */}
      <div className="relative w-full h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ 
            backgroundImage: `url(${anime.coverImage || anime.imageUrl})`,
            filter: 'blur(8px)',
            transform: 'scale(1.1)'
          }}
        ></div>
        <div className="container mx-auto px-4 relative z-20 h-full flex items-end pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)} 
              className="mb-4 bg-background/80 backdrop-blur-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{anime.title}</h1>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          <div className="space-y-6">
            {/* Anime poster with shadow effect */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-[2/3] w-full max-w-[300px] mx-auto md:mx-0 bg-background rounded-lg overflow-hidden shadow-[0_0_25px_rgba(255,0,0,0.3)]"
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

            {/* Anime info cards */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 gap-3"
            >
              {anime.releaseYear && (
                <div className="bg-secondary/30 p-3 rounded-lg border border-primary/20 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground">Year</h3>
                    <p className="font-semibold">{anime.releaseYear}</p>
                  </div>
                </div>
              )}
              {anime.episodes && (
                <div className="bg-secondary/30 p-3 rounded-lg border border-primary/20 flex items-center">
                  <FileVideo className="h-4 w-4 mr-2 text-primary" />
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground">Episodes</h3>
                    <p className="font-semibold">{anime.episodes}</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Genres */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-sm font-medium mb-2 text-muted-foreground">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {anime.genres?.map((genre) => (
                  <Badge key={genre} variant="outline" className="bg-primary/10 border-primary/20 text-xs">
                    {genre}
                  </Badge>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Anime description with styled box */}
            <div className="bg-secondary/20 p-6 rounded-lg border border-primary/10 shadow-lg">
              <h2 className="text-xl font-semibold mb-3 flex items-center">
                <Info className="h-5 w-5 mr-2 text-primary" />
                About
              </h2>
              <p className="text-foreground/90 leading-relaxed">
                {anime.description || "No description available."}
              </p>
            </div>

            {/* Download section with styled header */}
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary/30 rounded-full mr-3"></div>
                <h2 className="text-xl font-semibold">Download Episodes</h2>
              </div>

              <div className="bg-secondary/10 p-6 rounded-lg border border-primary/10 shadow-lg">
                {anime.downloadLinks && anime.downloadLinks.length > 0 ? (
                  <>
                    <h4 className="font-medium text-xl mb-4">Episodes</h4>
                    <EpisodeDownloadList downloadLinks={anime.downloadLinks} animeId={id} />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Download className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                    <p className="text-muted-foreground">No download links available yet</p>
                    <p className="text-xs text-muted-foreground mt-2">Check back later for updates</p>
                  </div>
                )}
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