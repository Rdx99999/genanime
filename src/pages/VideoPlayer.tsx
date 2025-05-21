
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, RotateCw, Maximize, Volume2, Volume1, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

const VideoPlayer = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const videoUrl = searchParams.get("url");
  const episodeNumber = searchParams.get("episode") || "1";
  const animeTitle = searchParams.get("title") || "Anime";
  const quality = searchParams.get("quality") || "HD";
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        toast({
          title: "Fullscreen Error",
          description: `Error attempting to enable fullscreen: ${err.message}`,
          variant: "destructive"
        });
      });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleError = () => {
    setError("Error loading video. The video URL might be invalid or the format is not supported.");
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleGoBack = () => {
    navigate(`/anime/${id}`);
  };

  if (!videoUrl) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <h1 className="text-2xl font-bold text-red-500">Error</h1>
            <p>No video URL provided. Please select a valid episode to watch.</p>
            <Button onClick={() => navigate(`/anime/${id}`)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Details
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-4">
          <Button variant="ghost" onClick={handleGoBack} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Details
          </Button>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{animeTitle}</h1>
            <div className="flex items-center space-x-3">
              <span className="px-2 py-1 bg-primary/10 text-primary text-sm rounded">Episode {episodeNumber}</span>
              <span className="px-2 py-1 bg-secondary/20 text-secondary text-sm rounded">{quality}</span>
            </div>
          </div>
          
          <div 
            ref={containerRef}
            className="relative bg-black rounded-lg overflow-hidden aspect-video shadow-xl border border-secondary/10"
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
            
            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10 p-4 text-center">
                <div className="text-red-500 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Video Error</h3>
                <p className="text-gray-300 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  <RotateCw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
              </div>
            )}
            
            <video
              ref={videoRef}
              className="w-full h-auto"
              controls
              autoPlay
              playsInline
              onError={handleError}
              onLoadedData={handleLoad}
              onCanPlay={() => setIsLoading(false)}
              controlsList="nodownload"
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Custom video controls overlay - can be expanded in the future */}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={toggleMute}
                    className="p-1 text-white hover:text-primary transition-colors"
                  >
                    {isMuted ? 
                      <VolumeX className="h-4 w-4" /> : 
                      volume > 0.5 ? <Volume2 className="h-4 w-4" /> : <Volume1 className="h-4 w-4" />
                    }
                  </button>
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-16 accent-primary"
                  />
                </div>
                
                <button 
                  onClick={toggleFullscreen}
                  className="p-1 text-white hover:text-primary transition-colors"
                >
                  <Maximize className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-medium">Download this episode</h2>
                <p className="text-sm text-muted-foreground">Save this episode to watch offline later</p>
              </div>
              <Button asChild className="bg-primary hover:bg-primary/90 text-white">
                <a href={videoUrl} download={`${animeTitle} - Episode ${episodeNumber}.mp4`} target="_blank" rel="noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default VideoPlayer;
