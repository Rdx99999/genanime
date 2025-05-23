
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
  Maximize, 
  Minimize, 
  Volume2, 
  VolumeX,
  PlayCircle,
  PauseCircle,
  SkipForward,
  RotateCcw,
  Settings,
  Share2
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const VideoPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [animeTitle, setAnimeTitle] = useState<string>("");
  const [episodeNumber, setEpisodeNumber] = useState<number>(1);
  const [quality, setQuality] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [buffered, setBuffered] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);
  const [availableEpisodes, setAvailableEpisodes] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [watchHistory, setWatchHistory] = useState<{[key: string]: number}>({});

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
    // In a real application, you would fetch this data from your API
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
    
    // Start playback automatically
    setTimeout(() => {
      setIsLoading(false);
      setIsPlaying(true);
      
      // Auto-play video when loaded
      if (videoRef.current) {
        videoRef.current.play().catch(err => {
          console.error("Error auto-playing video:", err);
        });
        
        // Restore previous watch position if available
        const historyKey = `${animeTitle}-ep${episodeNumber}`;
        if (watchHistory[historyKey]) {
          videoRef.current.currentTime = watchHistory[historyKey];
        }
      }
    }, 1000);
    
    // Hide controls after 3 seconds of inactivity
    const controlsTimer = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
    
    return () => clearTimeout(controlsTimer);
  }, [location, animeTitle, episodeNumber, watchHistory]);
  
  // Save watch progress periodically
  useEffect(() => {
    if (!videoRef.current || currentTime === 0) return;
    
    const historyKey = `${animeTitle}-ep${episodeNumber}`;
    const newHistory = {...watchHistory, [historyKey]: currentTime};
    setWatchHistory(newHistory);
    
    // Save to localStorage
    localStorage.setItem('animeWatchHistory', JSON.stringify(newHistory));
  }, [currentTime, animeTitle, episodeNumber]);
  
  // Update current time and buffered amount
  useEffect(() => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    
    const updateProgress = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
      
      // Update buffered
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };
    
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('progress', updateProgress);
    video.addEventListener('loadedmetadata', updateProgress);
    
    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('progress', updateProgress);
      video.removeEventListener('loadedmetadata', updateProgress);
    };
  }, []);

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(err => {
        console.error("Error playing video:", err);
      });
    }
    
    setIsPlaying(!isPlaying);
    setShowControls(true);
  };
  
  const handleQualityChange = (newQuality: string) => {
    const currentTime = videoRef.current?.currentTime || 0;
    setQuality(newQuality);
    
    // In a real application, you would update the video URL based on the quality
    // For demonstration purposes, we'll assume the same URL
    // After changing quality, restore playback position
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = currentTime;
        if (isPlaying) videoRef.current.play();
      }
    }, 500);
    
    setShowSettings(false);
  };

  const handleEpisodeChange = (newEpisode: number) => {
    // Save current episode progress before changing
    if (videoRef.current && videoRef.current.currentTime > 0) {
      const historyKey = `${animeTitle}-ep${episodeNumber}`;
      const newHistory = {...watchHistory, [historyKey]: videoRef.current.currentTime};
      localStorage.setItem('animeWatchHistory', JSON.stringify(newHistory));
    }
    
    setEpisodeNumber(newEpisode);
    navigate(`/video?url=${encodeURIComponent(videoUrl)}&title=${encodeURIComponent(animeTitle)}&episode=${newEpisode}&quality=${quality}`);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !e.currentTarget) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    
    videoRef.current.currentTime = pos * videoRef.current.duration;
    setCurrentTime(videoRef.current.currentTime);
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };
  
  const skipForward = (seconds: number = 10) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + seconds);
    setShowControls(true);
  };
  
  const skipBackward = (seconds: number = 10) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - seconds);
    setShowControls(true);
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleMute = () => {
    if (!videoRef.current) return;
    
    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
    
    // If unmuting, restore previous volume or set to 0.5
    if (!newMutedState && videoRef.current.volume === 0) {
      videoRef.current.volume = 0.5;
      setVolume(0.5);
    }
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
        
        <div 
          ref={playerContainerRef}
          className="relative bg-black rounded-lg overflow-hidden shadow-xl mb-6"
          onMouseMove={() => {
            setShowControls(true);
            // Hide controls after 3 seconds of inactivity
            const timer = setTimeout(() => {
              if (isPlaying) setShowControls(false);
            }, 3000);
            return () => clearTimeout(timer);
          }}
        >
          <div className="aspect-video relative">
            {videoUrl ? (
              <video 
                ref={videoRef}
                src={videoUrl} 
                className="w-full h-full" 
                autoPlay
                preload="auto"
                poster="https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=1000"
                onClick={handlePlayPause}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => {
                  // Automatically navigate to next episode
                  if (episodeNumber < Math.max(...availableEpisodes)) {
                    handleEpisodeChange(episodeNumber + 1);
                  }
                }}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <p className="text-white">No video source available</p>
              </div>
            )}
            
            {/* Episode badge */}
            <div className="absolute top-4 left-4 z-20">
              <Badge variant="secondary" className="bg-primary/80 text-white px-3 py-1 text-sm">
                Episode {episodeNumber}
              </Badge>
            </div>
            
            {/* Play/Pause overlay centered */}
            {videoUrl && !isPlaying && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer z-10"
                   onClick={handlePlayPause}>
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="rounded-full bg-primary/90 p-5 hover:bg-primary transition-colors"
                >
                  <PlayCircle className="h-12 w-12 text-white" />
                </motion.div>
              </div>
            )}
            
            {/* Center control buttons (only visible on mouse movement) */}
            {isPlaying && showControls && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-8 z-30">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-black/40 rounded-full p-3 text-white hover:bg-primary/70 transition-colors"
                  onClick={() => skipBackward(10)}
                >
                  <RotateCcw className="h-6 w-6" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-black/40 rounded-full p-5 text-white hover:bg-primary/70 transition-colors"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? 
                    <PauseCircle className="h-10 w-10" /> : 
                    <PlayCircle className="h-10 w-10" />
                  }
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-black/40 rounded-full p-3 text-white hover:bg-primary/70 transition-colors"
                  onClick={() => skipForward(10)}
                >
                  <SkipForward className="h-6 w-6" />
                </motion.button>
              </div>
            )}
            
            {/* Video Controls */}
            <div 
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent pt-10 pb-2 px-4 transition-opacity duration-300 z-20 ${showControls ? 'opacity-100' : 'opacity-0'}`}
            >
              {/* Progress bar */}
              <div className="mb-2">
                <div 
                  className="w-full h-2 bg-gray-700/60 rounded-full cursor-pointer relative"
                  onClick={handleSeek}
                >
                  {/* Buffered progress */}
                  <div 
                    className="absolute top-0 left-0 h-full bg-gray-400/40 rounded-full"
                    style={{ width: `${(buffered / duration) * 100}%` }}
                  ></div>
                  
                  {/* Watched progress */}
                  <div 
                    className="absolute top-0 left-0 h-full bg-primary rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  >
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Controls row */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-white/20" 
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? 
                      <PauseCircle className="h-5 w-5" /> : 
                      <PlayCircle className="h-5 w-5" />
                    }
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white hover:bg-white/20" 
                      onClick={toggleMute}
                    >
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                    
                    <div className="w-24 hidden sm:block">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-full accent-primary cursor-pointer"
                      />
                    </div>
                  </div>
                  
                  <div className="text-sm text-white/90">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-white/20" 
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-white/20" 
                    onClick={handleShareEpisode}
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-white/20" 
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
              
              {/* Settings popup */}
              {showSettings && (
                <div className="absolute bottom-16 right-4 bg-black/90 backdrop-blur-sm rounded-lg p-3 w-48 z-40 border border-primary/30">
                  <h4 className="text-white text-sm font-semibold mb-2">Quality</h4>
                  <div className="space-y-1">
                    {availableQualities.map((q) => (
                      <button
                        key={q}
                        className={`w-full text-left px-3 py-1.5 text-sm rounded-md ${q === quality ? 'bg-primary text-white' : 'text-white/80 hover:bg-white/10'}`}
                        onClick={() => handleQualityChange(q)}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50">
                <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
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
