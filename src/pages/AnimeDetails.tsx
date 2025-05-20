
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Anime } from "@/types/anime";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download } from "lucide-react";
import EpisodeDownloadList from "@/components/EpisodeDownloadList";
import { getAnimeById } from "@/lib/animeData";

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
        <div className="container mx-auto px-4 py-12 flex justify-center items-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <span className="ml-3">Loading anime details...</span>
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
      <div className="container mx-auto px-4 py-6 md:py-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          <div className="relative aspect-[2/3] w-full max-w-[300px] mx-auto md:mx-0 bg-muted rounded-lg overflow-hidden shadow-xl">
            <img 
              src={anime.imageUrl || anime.coverImage} 
              alt={anime.title}
              className="object-cover w-full h-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=500";
              }}
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{anime.title}</h1>
              <div className="flex flex-wrap gap-1 mb-4">
                {anime.genres?.map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>
              <p className="text-muted-foreground">
                {anime.description || "No description available."}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {anime.releaseYear && (
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-1">Year</h3>
                  <p className="text-lg">{anime.releaseYear}</p>
                </div>
              )}
              {anime.episodes && (
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-1">Episodes</h3>
                  <p className="text-lg">{anime.episodes}</p>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Available Downloads</h2>
              {anime.downloadLinks && anime.downloadLinks.length > 0 ? (
                <EpisodeDownloadList downloadLinks={anime.downloadLinks} />
              ) : (
                <p className="text-muted-foreground">No download links available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-secondary/30 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-foreground/70">
            © {new Date().getFullYear()} GenAnime. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AnimeDetails;
