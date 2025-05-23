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

const VideoPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const url = params.get("url");
    const title = params.get("title");
    const episode = params.get("episode");
    const qualityParam = params.get("quality");

    if (!url) {
      setError("No video URL provided");
      setIsLoading(false);
      return;
    }

    // Simulate fetching available qualities and episodes
    const mockQualities = ["1080p", "720p", "480p", "360p"];
    const mockEpisodes = Array.from({ length: 12 }, (_, i) => i + 1);

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

  // Handle video events
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);

      // Update watch history
      if (videoElement.currentTime > 0) {
        const historyKey = `${animeTitle}-ep${episodeNumber}`;
        const newHistory = {...watchHistory, [historyKey]: videoElement.currentTime};
        setWatchHistory(newHistory);
        localStorage.setItem('animeWatchHistory', JSON.stringify(newHistory));
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
      setIsLoading(false);

      // Restore saved position
      const historyKey = `${animeTitle}-ep${episodeNumber}`;
      const savedTime = watchHistory[historyKey] || 0;
      if (savedTime > 0) {
        videoElement.currentTime = savedTime;
      }
    };

    const handlePlay = () => setIsPaused(false);
    const handlePause = () => setIsPaused(true);
    const handleEnded = () => {
      if (episodeNumber < Math.max(...availableEpisodes)) {
        handleEpisodeChange(episodeNumber + 1);
      }
    };

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('ended', handleEnded);

    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, [videoRef.current, episodeNumber, animeTitle, watchHistory, availableEpisodes]);

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleQualityChange = (newQuality: string) => {
    setQuality(newQuality);
    // In a real app, you would update the video URL based on the quality
  };

  const handleEpisodeChange = (newEpisode: number) => {
    setEpisodeNumber(newEpisode);
    navigate(`/video?url=${encodeURIComponent(videoUrl)}&title=${encodeURIComponent(animeTitle)}&episode=${newEpisode}&quality=${quality}`);
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

  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  if (isLoading) {
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

            {videoUrl ? (
              <div className="relative w-full h-full" onClick={togglePlayPause}>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full"
                  poster="https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=1000"
                  controls
                ></video>

                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
                    <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <p className="text-white">No video source available</p>
              </div>
            )}
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
              <h3 className="font-medium mb-3">Episodes</h3>
              <div className="grid grid-cols-4 gap-2">
                {availableEpisodes.map((ep) => {
                  const historyKey = `${animeTitle}-ep${ep}`;
                  const hasWatched = !!watchHistory[historyKey];
                  const isCurrentEpisode = episodeNumber === ep;

                  return (
                    <Button
                      key={ep}
                      variant={isCurrentEpisode ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleEpisodeChange(ep)}
                      className={`relative ${isCurrentEpisode ? "bg-primary" : ""}`}
                    >
                      {ep}
                      {hasWatched && !isCurrentEpisode && (
                        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary/70 rounded-full"></div>
                      )}
                    </Button>
                  );
                })}
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