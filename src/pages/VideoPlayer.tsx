
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
  Settings,
  Share2
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '@videojs/themes/dist/forest/index.css';

const VideoPlayerComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLElement | null>(null);
  const playerRef = useRef<any>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [animeTitle, setAnimeTitle] = useState<string>("");
  const [episodeNumber, setEpisodeNumber] = useState<number>(1);
  const [quality, setQuality] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);
  const [availableEpisodes, setAvailableEpisodes] = useState<number[]>([]);
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
    
    setIsLoading(false);
  }, [location]);

  // Initialize video.js
  useEffect(() => {
    if (!videoUrl) return;
    
    const historyKey = `${animeTitle}-ep${episodeNumber}`;
    const savedTime = watchHistory[historyKey] || 0;
    
    // Create video element if it doesn't exist
    if (!videoRef.current) {
      const videoElement = document.createElement('video-js');
      videoElement.className = 'video-js vjs-big-play-centered vjs-theme-forest';
      // Add a unique ID to ensure proper initialization
      videoElement.id = 'anime-player';
      
      // Find the player container and append the video element
      const playerContainer = document.querySelector('[data-vjs-player]');
      if (playerContainer) {
        playerContainer.innerHTML = '';
        playerContainer.appendChild(videoElement);
        videoRef.current = videoElement;
      }
    }
    
    if (!videoRef.current) return;
    
    const options = {
      autoplay: false, // Set to false initially to reduce playback issues
      controls: true,
      responsive: true,
      fluid: true,
      playbackRates: [0.5, 1, 1.5, 2],
      sources: [{
        src: videoUrl,
        type: 'video/mp4'
      }],
      poster: "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=1000",
      controlBar: {
        children: [
          'playToggle',
          'volumePanel',
          'currentTimeDisplay',
          'timeDivider',
          'durationDisplay',
          'progressControl',
          'remainingTimeDisplay',
          'fullscreenToggle',
        ],
      },
    };
    
    // Dispose previous player instance if exists
    if (playerRef.current) {
      playerRef.current.dispose();
      playerRef.current = null;
    }
    
    // Initialize video.js player with a slight delay to ensure DOM is ready
    setTimeout(() => {
      try {
        // Initialize video.js player
        const player = videojs(videoRef.current, options, function onPlayerReady() {
          console.log('Player ready');
          // Try to play after a short delay
          setTimeout(() => {
            if (savedTime > 0) {
              this.currentTime(savedTime);
            }
            // Try to play - may be blocked by browser autoplay policy
            const playPromise = this.play();
            if (playPromise !== undefined) {
              playPromise.catch(error => {
                console.log('Autoplay prevented:', error);
                // Show play button explicitly
                this.bigPlayButton.show();
              });
            }
          }, 300);
        });
        
        player.addClass('vjs-theme-forest');
        
        // Save player instance to ref
        playerRef.current = player;
        
        // Setup watch history tracking
        player.on('timeupdate', () => {
          const currentTime = player.currentTime();
          if (currentTime > 0) {
            const historyKey = `${animeTitle}-ep${episodeNumber}`;
            const newHistory = {...watchHistory, [historyKey]: currentTime};
            setWatchHistory(newHistory);
            localStorage.setItem('animeWatchHistory', JSON.stringify(newHistory));
          }
        });
        
        // Handle end of video
        player.on('ended', () => {
          if (episodeNumber < Math.max(...availableEpisodes)) {
            handleEpisodeChange(episodeNumber + 1);
          }
        });
        
        // Log errors
        player.on('error', (e) => {
          console.error('Video player error:', e);
          setError('Error playing video: ' + (player.error()?.message || 'Unknown error'));
        });
      } catch (err) {
        console.error('Error initializing player:', err);
        setError('Failed to initialize video player: ' + err.message);
      }
    }, 100);
    
    // Cleanup
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [videoUrl, animeTitle, episodeNumber, watchHistory, availableEpisodes]);

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleQualityChange = (newQuality: string) => {
    setQuality(newQuality);
    
    // In a real application, you would update the video URL based on the quality
    // For demonstration purposes, we'll assume the same URL
    
    // After changing quality, the player would reload with new source but maintain position
    // This would need real implementation with different quality sources
    
    setShowSettings(false);
  };

  const handleEpisodeChange = (newEpisode: number) => {
    // Save current episode progress before changing is handled by the timeupdate event
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
  
  // Get current time from player
  const getCurrentTime = () => {
    if (!playerRef.current) return 0;
    return playerRef.current.currentTime();
  };
  
  // Get duration from player
  const getDuration = () => {
    if (!playerRef.current) return 0;
    return playerRef.current.duration();
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
              <div data-vjs-player className="w-full h-full">
                {/* Video.js will create and manage the video element */}
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <p className="text-white">No video source available</p>
              </div>
            )}
            
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
                  style={{ width: `${(getCurrentTime() / getDuration()) * 100 || 0}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                <span>{formatTime(getCurrentTime())}</span>
                <span>{formatTime(getDuration())}</span>
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

// Add some custom styles
const styles = `
  .video-js .vjs-big-play-button {
    background-color: rgba(var(--primary), 0.8);
    border-color: white;
    border-radius: 50%;
    height: 3em;
    width: 3em;
    line-height: 3em;
    margin-left: -1.5em;
    margin-top: -1.5em;
  }
  
  .video-js:hover .vjs-big-play-button,
  .video-js .vjs-big-play-button:focus {
    background-color: rgb(var(--primary));
  }
  
  .vjs-theme-forest {
    --vjs-theme-forest--primary: rgb(var(--primary));
  }
  
  .vjs-theme-forest .vjs-control-bar {
    background-color: rgba(0, 0, 0, 0.7);
  }
  
  .vjs-theme-forest .vjs-button:hover {
    color: rgb(var(--primary));
  }
  
  .vjs-theme-forest .vjs-progress-holder .vjs-play-progress,
  .vjs-theme-forest .vjs-progress-holder .vjs-load-progress,
  .vjs-theme-forest .vjs-progress-holder .vjs-load-progress div,
  .vjs-theme-forest .vjs-slider-horizontal .vjs-volume-level {
    height: 6px;
  }
  
  .vjs-theme-forest .vjs-progress-holder {
    height: 6px;
    margin: 0;
  }
  
  .vjs-theme-forest .vjs-progress-control:hover .vjs-progress-holder {
    height: 8px;
  }
  
  .vjs-theme-forest .vjs-play-progress {
    background-color: rgb(var(--primary));
  }
  
  .vjs-theme-forest .vjs-remaining-time {
    display: none;
  }
  
  .vjs-theme-forest.vjs-waiting .vjs-big-play-button {
    display: none;
  }
`;

const VideoPlayer = Object.assign(VideoPlayerComponent, {
  styles,
});

// Add the styles to the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default VideoPlayer;
