
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
import { Input } from "@/components/ui/input";

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
  const [watchProgress, setWatchProgress] = useState<Record<string, number>>({});
  const [volume, setVolume] = useState<number>(100);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const videoRef = useState<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (animeId) {
      fetchAnimeDetails(animeId);
      // Load saved progress from localStorage
      const savedProgress = localStorage.getItem(`anime-progress-${animeId}`);
      if (savedProgress) {
        setWatchProgress(JSON.parse(savedProgress));
      }
    }
  }, [animeId]);

  // Save progress to localStorage when component unmounts
  useEffect(() => {
    return () => {
      if (animeId && Object.keys(watchProgress).length > 0) {
        localStorage.setItem(`anime-progress-${animeId}`, JSON.stringify(watchProgress));
      }
    };
  }, [animeId, watchProgress]);

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
    if (!anime) return;
    
    const episodeLinks = anime.downloadLinks.filter(
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
    if (!anime) return;
    
    const episodeLinks = anime.downloadLinks.filter(
      (link) => link.episodeNumber.toString() === currentEpisode && link.quality === quality
    ) || [];

    if (episodeLinks.length > 0) {
      setCurrentQuality(quality);
      setVideoUrl(episodeLinks[0].url);

      // Update URL params without refreshing the page
      navigate(`/video?animeId=${animeId}&url=${encodeURIComponent(episodeLinks[0].url)}&episode=${currentEpisode}&quality=${quality}`, { replace: true });
    }
  };

  // Get unique episode numbers and sort numerically in ascending order
  const episodes = Object.keys(episodeLinks).sort((a, b) => parseInt(a) - parseInt(b));

  const filteredEpisodes = episodes.filter(episode => 
    episode.includes(episodeSearch)
  );

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
                <>
                  <video
                    ref={(el) => {
                      videoRef.current = el;
                      if (el) {
                        el.volume = volume / 100;
                        el.muted = isMuted;
                      }
                    }}
                    src={videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full"
                    controlsList="nodownload"
                    onTimeUpdate={(e) => {
                      const video = e.currentTarget;
                      // Save progress every 5 seconds
                      if (video.currentTime % 5 < 1 && video.currentTime > 0) {
                        setWatchProgress(prev => ({
                          ...prev,
                          [currentEpisode]: video.currentTime
                        }));
                      }
                    }}
                    onLoadedData={(e) => {
                      // Restore saved progress when video loads
                      const savedTime = watchProgress[currentEpisode];
                      if (savedTime && e.currentTarget) {
                        // Only seek if the saved time is less than the total duration (to avoid seeking beyond the end)
                        if (savedTime < e.currentTarget.duration - 10) {
                          e.currentTarget.currentTime = savedTime;
                        }
                      }
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Custom Volume Control */}
                  <div className="absolute bottom-16 right-4 bg-card border border-border shadow-lg rounded-lg p-3 flex flex-col gap-2 w-52 opacity-80 hover:opacity-100 transition-opacity">
                    <div className="flex justify-between items-center mb-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => {
                          setIsMuted(!isMuted);
                          if (videoRef.current) {
                            videoRef.current.muted = !isMuted;
                          }
                        }}
                        className="h-8 w-8"
                      >
                        {isMuted ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z"></path><line x1="23" x2="17" y1="9" y2="15"></line><line x1="17" x2="23" y1="9" y2="15"></line></svg>
                        ) : volume > 50 ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                        ) : volume > 0 ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z"></path><line x1="23" x2="17" y1="9" y2="15"></line><line x1="17" x2="23" y1="9" y2="15"></line></svg>
                        )}
                      </Button>
                      <p className="text-sm">{isMuted ? "Muted" : `Volume: ${volume}%`}</p>
                    </div>
                    <div className="w-full">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={volume}
                        onChange={(e) => {
                          const newVolume = parseInt(e.target.value);
                          setVolume(newVolume);
                          if (videoRef.current) {
                            videoRef.current.volume = newVolume / 100;
                            if (newVolume === 0) {
                              setIsMuted(true);
                              videoRef.current.muted = true;
                            } else if (isMuted) {
                              setIsMuted(false);
                              videoRef.current.muted = false;
                            }
                          }
                        }}
                        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setVolume(0);
                          setIsMuted(true);
                          if (videoRef.current) {
                            videoRef.current.volume = 0;
                            videoRef.current.muted = true;
                          }
                        }}
                        className="text-xs h-6 px-2"
                      >
                        0%
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setVolume(50);
                          setIsMuted(false);
                          if (videoRef.current) {
                            videoRef.current.volume = 0.5;
                            videoRef.current.muted = false;
                          }
                        }}
                        className="text-xs h-6 px-2"
                      >
                        50%
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setVolume(100);
                          setIsMuted(false);
                          if (videoRef.current) {
                            videoRef.current.volume = 1;
                            videoRef.current.muted = false;
                          }
                        }}
                        className="text-xs h-6 px-2"
                      >
                        100%
                      </Button>
                    </div>
                  </div>
                </>
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
                  {Object.keys(episodeLinks).length > 0 ? (
                    <div>
                      <div className="mb-4">
                        <Input
                          type="text"
                          placeholder="Search episodes..."
                          value={episodeSearch}
                          onChange={(e) => setEpisodeSearch(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                        {filteredEpisodes.map(episode => {
                          const isWatched = watchProgress[episode] !== undefined;
                          const isCurrentEpisode = currentEpisode === episode;
                          
                          // Calculate whether the episode is completely watched (> 90% of duration)
                          const episodeLinks = anime?.downloadLinks.filter(
                            (link) => link.episodeNumber.toString() === episode
                          ) || [];
                          
                          return (
                            <Button
                              key={`episode-${episode}`}
                              variant={isCurrentEpisode ? "default" : "outline"}
                              className={`h-10 w-full relative ${
                                isCurrentEpisode 
                                  ? "bg-primary text-primary-foreground" 
                                  : isWatched 
                                    ? "border-primary/50 hover:bg-primary/10" 
                                    : "hover:bg-primary/10"
                              }`}
                              onClick={() => changeEpisode(episode)}
                            >
                              {episode}
                              {isWatched && !isCurrentEpisode && (
                                <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></div>
                              )}
                            </Button>
                          );
                        })}
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
