
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Share2
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import ReactPlayer from "react-player";

const VideoPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const playerRef = useRef<ReactPlayer>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [animeTitle, setAnimeTitle] = useState<string>("");
  const [episodeNumber, setEpisodeNumber] = useState<number>(1);
  const [quality, setQuality] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);
  const [availableEpisodes, setAvailableEpisodes] = useState<number[]>([]);
  const [watchHistory, setWatchHistory] = useState<{[key: string]: number}>({});
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const url = params.get("url");
    const title = params.get("title");
    const episode = params.get("episode");
    const qualityParam = params.get("quality");

    console.log("URL from params:", url);

    if (!url) {
      setError("No video URL provided");
      setIsLoading(false);
      return;
    }

    // In a real app, you would fetch this data from your API
    // For now, we simulate fetching available qualities and episodes
    const mockQualities = ["1080p", "720p", "480p", "360p"];
    
    // Generate more episodes for better testing
    const mockEpisodes = Array.from({ length: 24 }, (_, i) => i + 1);
    
    setAvailableQualities(mockQualities);
    setAvailableEpisodes(mockEpisodes);
    setVideoUrl(url);
    setAnimeTitle(title || "Unknown Anime");
    setEpisodeNumber(episode ? parseInt(episode) : 1);
    setQuality(qualityParam || mockQualities[0]);

    // Get watch history from localStorage
    const savedHistory = localStorage.getItem('animeWatchHistory');
    if (savedHistory) {
      try {
        setWatchHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Error parsing watch history:", e);
      }
    }

    setIsLoading(false);
  }, [location]);

  // Handle video playback
  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    setCurrentTime(state.playedSeconds);

    // Update watch history
    if (state.playedSeconds > 0) {
      const historyKey = `${animeTitle}-ep${episodeNumber}`;
      const newHistory = {...watchHistory, [historyKey]: state.playedSeconds};
      setWatchHistory(newHistory);
      localStorage.setItem('animeWatchHistory', JSON.stringify(newHistory));
    }
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
    setIsLoading(false);

    // Restore saved position
    const historyKey = `${animeTitle}-ep${episodeNumber}`;
    const savedTime = watchHistory[historyKey] || 0;
    if (savedTime > 0 && playerRef.current) {
      playerRef.current.seekTo(savedTime, 'seconds');
    }
  };

  const handleReady = () => {
    setIsLoading(false);
    setHasStarted(true);
  };

  const handleError = (error: any) => {
    console.error("Video playback error:", error);
    setIsLoading(false);
    setError("Error loading video. Please try another quality or check your network connection.");
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleQualityChange = (newQuality: string) => {
    // Update URL with new quality
    const params = new URLSearchParams(location.search);
    params.set('quality', newQuality);
    
    // Keep current video time
    const currentVideoTime = currentTime;
    
    // Navigate to the updated URL
    navigate(`/video?${params.toString()}`);
    
    // Update state
    setQuality(newQuality);
    
    // After video loads, restore playback position
    setTimeout(() => {
      if (playerRef.current) {
        playerRef.current.seekTo(currentVideoTime, 'seconds');
      }
    }, 500);
  };

  const handleEpisodeChange = (newEpisode: number) => {
    setIsLoading(true);
    setEpisodeNumber(newEpisode);
    
    // In a real app, you would fetch the specific URL for this episode
    // For demo purposes, we'll just use the same URL with different episode number
    const episodeUrl = videoUrl;
    
    // Navigate to the new episode URL
    navigate(`/video?url=${encodeURIComponent(episodeUrl)}&title=${encodeURIComponent(animeTitle)}&episode=${newEpisode}&quality=${quality}`);
    
    // Update page title to reflect current episode
    document.title = `${animeTitle} - Episode ${newEpisode}`;
    
    // Save to recently watched
    const recentlyWatched = JSON.parse(localStorage.getItem('recentlyWatched') || '[]');
    const newItem = {
      id: Date.now(),
      title: animeTitle,
      episode: newEpisode,
      timestamp: new Date().toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=300' // Placeholder
    };
    
    const filtered = recentlyWatched.filter((item: any) => 
      !(item.title === animeTitle && item.episode === newEpisode)
    );
    
    localStorage.setItem('recentlyWatched', JSON.stringify([newItem, ...filtered].slice(0, 10)));
  };

  const handleShareEpisode = () => {
    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: `${animeTitle} - Episode ${episodeNumber}`,
        text: `Check out ${animeTitle} Episode ${episodeNumber} on GenAnime!`,
        url: shareUrl,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Link copied to clipboard!');
      }).catch(err => {
        console.error('Error copying link:', err);
      });
    }
  };

  if (isLoading && !hasStarted) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-lg">Loading video player...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="bg-red-500/10 p-4 rounded-lg mb-4 text-red-500">
            <p className="text-lg font-medium">{error}</p>
          </div>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)} 
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{animeTitle}</h1>
          <p className="text-muted-foreground">Episode {episodeNumber}</p>
        </div>

        <div className="relative bg-black rounded-lg overflow-hidden shadow-xl mb-6">
          <div className="aspect-video relative">
            {/* Episode badge */}
            <div className="absolute top-4 left-4 z-20">
              <Badge variant="secondary" className="bg-primary/80 text-white px-3 py-1 text-sm">
                Episode {episodeNumber}
              </Badge>
            </div>

            <div className="relative w-full h-full">
              {videoUrl ? (
                <div className="relative w-full h-full">
                  <ReactPlayer
                    ref={playerRef}
                    url={videoUrl}
                    width="100%"
                    height="100%"
                    controls={true}
                    playing={isPlaying}
                    playsinline={true}
                    volume={0.8}
                    onPlay={() => {
                      setIsPlaying(true);
                      setIsPaused(false);
                    }}
                    onPause={() => {
                      setIsPlaying(false);
                      setIsPaused(true);
                    }}
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    onReady={handleReady}
                    onError={handleError}
                    onBuffer={() => setIsLoading(true)}
                    onBufferEnd={() => setIsLoading(false)}
                    config={{
                      file: {
                        attributes: {
                          controlsList: 'nodownload',
                          poster: "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=1000",
                          preload: "auto"
                        },
                        forceVideo: true
                      }
                    }}
                    style={{ backgroundColor: '#000' }}
                    fallback={
                      <div className="flex items-center justify-center h-full bg-black text-white">
                        <p>Loading video player...</p>
                      </div>
                    }
                  />

                  {/* Loading overlay */}
                  {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10">
                      <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                      <p className="text-white text-sm">Loading episode {episodeNumber}...</p>
                    </div>
                  )}
                  
                  {/* Error overlay will be shown if video fails to load */}
                  {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10 p-6">
                      <div className="bg-red-500/20 p-4 rounded-lg mb-4">
                        <p className="text-red-400 text-center">{error}</p>
                      </div>
                      <Button onClick={() => window.location.reload()}>
                        Try Again
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
                  Video URL not provided
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-6">
            <div className="bg-secondary/20 p-6 rounded-lg border border-primary/10 shadow-lg">
              <h2 className="text-xl font-semibold mb-3 flex items-center">
                Episode Information
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-primary">{animeTitle}</h3>
                  <p className="text-foreground/90">Episode {episodeNumber}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Keyboard Shortcuts</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>Space - Play/Pause</div>
                    <div>F - Full Screen</div>
                    <div>← → - Seek 10 seconds</div>
                    <div>M - Mute/Unmute</div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex flex-wrap gap-4">
                    <a href={videoUrl} download className="inline-flex">
                      <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
                        <Download className="h-4 w-4" /> Download Episode
                      </Button>
                    </a>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2 border-primary/20"
                      onClick={handleShareEpisode}
                    >
                      <Share2 className="h-4 w-4" /> Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Watch progress */}
            <div className="bg-secondary/20 p-4 rounded-lg border border-primary/10">
              <h3 className="font-medium mb-3">Watch Progress</h3>
              <div className="w-full bg-background/50 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-secondary/20 p-4 rounded-lg border border-primary/10"
            >
              <h3 className="font-medium mb-3">Video Quality</h3>
              <Select
                value={quality}
                onValueChange={handleQualityChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  {availableQualities.map((q) => (
                    <SelectItem key={q} value={q}>
                      {q}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-secondary/20 p-4 rounded-lg border border-primary/10"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Episodes</h3>
                <span className="text-xs text-muted-foreground">{availableEpisodes.length} total</span>
              </div>
              
              {/* Episodes grid with scrolling container */}
              <div className="max-h-[180px] overflow-y-auto pr-1 -mr-1 custom-scrollbar">
                <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
                  {availableEpisodes.map((ep) => {
                    const historyKey = `${animeTitle}-ep${ep}`;
                    const hasWatched = !!watchHistory[historyKey];
                    const isCurrentEpisode = episodeNumber === ep;
                    const watchProgress = watchHistory[historyKey] ? 
                      Math.min(100, Math.round((watchHistory[historyKey] / 1200) * 100)) : 0;

                    return (
                      <Button
                        key={ep}
                        variant={isCurrentEpisode ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleEpisodeChange(ep)}
                        className={`relative ${isCurrentEpisode ? "bg-primary" : hasWatched ? "border-primary/40" : ""}`}
                      >
                        <span>{ep}</span>
                        
                        {/* Show progress indicator for watched episodes */}
                        {hasWatched && !isCurrentEpisode && (
                          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-secondary">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${watchProgress}%` }}
                            ></div>
                          </div>
                        )}
                        
                        {/* Current episode indicator */}
                        {isCurrentEpisode && (
                          <div className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>
              
              {/* Episode range indicator */}
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>EP 1</span>
                <span>EP {availableEpisodes.length}</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (episodeNumber > 1) {
                      handleEpisodeChange(episodeNumber - 1);
                    }
                  }}
                  disabled={episodeNumber <= 1}
                  className="flex-1 mr-2"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (episodeNumber < Math.max(...availableEpisodes)) {
                      handleEpisodeChange(episodeNumber + 1);
                    }
                  }}
                  disabled={episodeNumber >= Math.max(...availableEpisodes)}
                  className="flex-1 ml-2"
                >
                  Next <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              {/* Next Episode Recommendation */}
              {episodeNumber < Math.max(...availableEpisodes) && (
                <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                  <p className="text-xs text-muted-foreground mb-1">Up Next:</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{animeTitle}</p>
                      <p className="text-xs text-muted-foreground">Episode {episodeNumber + 1}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => handleEpisodeChange(episodeNumber + 1)}
                    >
                      Watch
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VideoPlayer;
