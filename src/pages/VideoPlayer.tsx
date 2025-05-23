import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Play, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAnimeById } from "@/lib/animeData";
import { Anime, DownloadLink } from "@/types/anime";

const VideoPlayer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Video state
  const initialUrl = searchParams.get("url") || "";
  const initialEpisode = searchParams.get("episode") || "1";
  const initialQuality = searchParams.get("quality") || "720p";
  const animeId = searchParams.get("animeId") || "";

  const [videoUrl, setVideoUrl] = useState(initialUrl);
  const [currentEpisode, setCurrentEpisode] = useState(initialEpisode);
  const [currentQuality, setCurrentQuality] = useState(initialQuality);
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);
  const [episodeLinks, setEpisodeLinks] = useState<Record<string, DownloadLink[]>>({});
  const [episodeSearch, setEpisodeSearch] = useState<string>("");

  useEffect(() => {
    if (animeId) {
      fetchAnimeDetails(animeId);
    }
  }, [animeId]);

  const fetchAnimeDetails = async (id: string) => {
    try {
      setIsLoading(true);
      const animeData = await getAnimeById(id);
      setAnime(animeData);

      // Organize episode links by episode number
      const episodeMap: Record<string, DownloadLink[]> = {};

      if (animeData.downloadLinks && animeData.downloadLinks.length > 0) {
        animeData.downloadLinks.forEach((link) => {
          const episode = link.episodeNumber.toString();
          if (!episodeMap[episode]) {
            episodeMap[episode] = [];
          }
          episodeMap[episode].push(link);
        });

        // Set available qualities for current episode
        const currentEpisodeLinks = episodeMap[currentEpisode] || [];
        const qualities = currentEpisodeLinks.map(link => link.quality);
        setAvailableQualities(qualities);

        // If URL is not set but we have links, set the URL to the first link of current quality
        if (!videoUrl && currentEpisodeLinks.length > 0) {
          const qualityLink = currentEpisodeLinks.find(link => link.quality === currentQuality);
          if (qualityLink) {
            setVideoUrl(qualityLink.url);
          } else if (currentEpisodeLinks[0]) {
            setVideoUrl(currentEpisodeLinks[0].url);
            setCurrentQuality(currentEpisodeLinks[0].quality);
          }
        }
      }

      setEpisodeLinks(episodeMap);
    } catch (err) {
      console.error("Error fetching anime details:", err);
      setError("Failed to load anime details");
    } finally {
      setIsLoading(false);
    }
  };

  const changeEpisode = (episode: string) => {
    const episodeLinks = anime?.downloadLinks.filter(
      (link) => link.episodeNumber.toString() === episode
    ) || [];

    if (episodeLinks.length > 0) {
      const qualityLink = episodeLinks.find(link => link.quality === currentQuality);
      const newUrl = qualityLink ? qualityLink.url : episodeLinks[0].url;
      const newQuality = qualityLink ? currentQuality : episodeLinks[0].quality;

      setCurrentEpisode(episode);
      setVideoUrl(newUrl);
      setCurrentQuality(newQuality);

      // Update qualities available for this episode
      const qualities = episodeLinks.map(link => link.quality);
      setAvailableQualities(qualities);

      // Update URL params without refreshing the page
      navigate(`/video?animeId=${animeId}&url=${encodeURIComponent(newUrl)}&episode=${episode}&quality=${newQuality}`, { replace: true });
    }
  };

  const changeQuality = (quality: string) => {
    const episodeLinks = anime?.downloadLinks.filter(
      (link) => link.episodeNumber.toString() === currentEpisode && link.quality === quality
    ) || [];

    if (episodeLinks.length > 0) {
      setCurrentQuality(quality);
      setVideoUrl(episodeLinks[0].url);

      // Update URL params without refreshing the page
      navigate(`/video?animeId=${animeId}&url=${encodeURIComponent(episodeLinks[0].url)}&episode=${currentEpisode}&quality=${quality}`, { replace: true });
    }
  };

  // Get unique episode numbers
  const episodes = Object.keys(episodeLinks).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 hover:bg-primary/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading video player...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-destructive text-lg mb-4">{error}</p>
            <Button onClick={() => navigate("/")}>Return to Home</Button>
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold">
              {anime?.title || "Video Player"} {currentEpisode && `- Episode ${currentEpisode}`}
            </h1>

            {/* Video Player */}
            <div className="aspect-video bg-black rounded-lg overflow-hidden relative shadow-xl border border-primary/20">
              {videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full"
                  controlsList="nodownload"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-muted-foreground">No video URL available</p>
                </div>
              )}
            </div>

            {/* Episode Controls */}
            <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Episodes</h2>
                <div className="bg-card rounded-lg p-4 border shadow-sm">
                  {Object.keys(episodeLinks).length > 0 && (
                    <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
                      <h2 className="font-semibold mb-3 flex items-center">
                        {/*<List className="h-5 w-5 mr-2 text-primary" />*/}
                        Episodes
                      </h2>

                      {/* Episode Search */}
                      {/*<div className="relative mb-3">
                        <Input
                          type="text"
                          placeholder="Search episode..."
                          className="pl-10"
                          value={episodeSearch}
                          onChange={(e) => setEpisodeSearch(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                          </svg>
                        </div>
                      </div>*/}

                      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                        {episodes
                          .filter(episode => episode.includes(episodeSearch))
                          .map(episode => (
                            <Button
                              key={`episode-${episode}`}
                              variant={currentEpisode === episode ? "default" : "outline"}
                              className={`h-10 w-full ${currentEpisode === episode ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"}`}
                              onClick={() => changeEpisode(episode)}
                            >
                              {episode}
                            </Button>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No episodes available</p>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Quality</h2>
                <div className="bg-card rounded-lg p-4 border shadow-sm">
                  {availableQualities.length > 0 ? (
                    <div className="space-y-2">
                      {availableQualities.map((quality) => (
                        <Button
                          key={`quality-${quality}`}
                          variant={currentQuality === quality ? "default" : "outline"}
                          className={`w-full justify-start ${currentQuality === quality ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"}`}
                          onClick={() => changeQuality(quality)}
                        >
                          <Play className="mr-2 h-4 w-4" /> {quality}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No quality options available</p>
                  )}
                </div>

                {/* Download Button */}
                {videoUrl && (
                  <div className="mt-4">
                    <Button variant="outline" className="w-full" asChild>
                      <a href={videoUrl} download target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" /> Download Episode
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Anime Description */}
            {anime?.description && (
              <Card className="mt-6">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-2">About {anime.title}</h2>
                  <p className="text-muted-foreground">{anime.description}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default VideoPlayer;