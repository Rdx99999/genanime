
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ChevronLeft, ChevronRight, Download, Maximize, Minimize, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

const VideoPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [animeTitle, setAnimeTitle] = useState<string>("");
  const [episodeNumber, setEpisodeNumber] = useState<number>(1);
  const [quality, setQuality] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);
  const [availableEpisodes, setAvailableEpisodes] = useState<number[]>([]);

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
    const mockQualities = ["720p", "1080p", "480p"];
    const mockEpisodes = Array.from({ length: 12 }, (_, i) => i + 1);
    
    setAvailableQualities(mockQualities);
    setAvailableEpisodes(mockEpisodes);
    setVideoUrl(url);
    setAnimeTitle(title || "Unknown Anime");
    setEpisodeNumber(episode ? parseInt(episode) : 1);
    setQuality(qualityParam || mockQualities[0]);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [location]);

  const handleQualityChange = (newQuality: string) => {
    setQuality(newQuality);
    // In a real application, you would update the video URL based on the quality
    // For demonstration purposes, we'll keep the same URL
  };

  const handleEpisodeChange = (newEpisode: number) => {
    // In a real application, you would navigate to the new episode
    // For demonstration purposes, we'll just update the state
    setEpisodeNumber(newEpisode);
    navigate(`/video?url=${encodeURIComponent(videoUrl)}&title=${encodeURIComponent(animeTitle)}&episode=${newEpisode}&quality=${quality}`);
  };

  const toggleFullscreen = () => {
    const videoElement = document.getElementById("video-player");
    
    if (!document.fullscreenElement) {
      videoElement?.requestFullscreen().catch(err => {
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
    const videoElement = document.getElementById("video-player") as HTMLVideoElement;
    if (videoElement) {
      videoElement.muted = !videoElement.muted;
      setIsMuted(!isMuted);
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
            {videoUrl ? (
              <video 
                id="video-player"
                src={videoUrl} 
                className="w-full h-full" 
                controls 
                autoPlay
                poster="https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=1000"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <p className="text-white">No video source available</p>
              </div>
            )}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/20" 
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
              </div>
              <div>
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
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-6">
            <div className="bg-secondary/20 p-6 rounded-lg border border-primary/10 shadow-lg">
              <h2 className="text-xl font-semibold mb-3 flex items-center">
                Video Player Controls
              </h2>
              <p className="text-foreground/90 leading-relaxed mb-4">
                You can change the episode or video quality using the controls provided. Use the player's built-in controls to play, pause, adjust volume, or enable full-screen mode.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href={videoUrl} download className="inline-flex">
                  <Button className="flex items-center gap-2">
                    <Download className="h-4 w-4" /> Download this episode
                  </Button>
                </a>
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
                {availableEpisodes.map((ep) => (
                  <Button
                    key={ep}
                    variant={episodeNumber === ep ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleEpisodeChange(ep)}
                    className={episodeNumber === ep ? "bg-primary" : ""}
                  >
                    {ep}
                  </Button>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex justify-between"
            >
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
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VideoPlayer;
