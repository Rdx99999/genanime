
import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const VideoPlayer = () => {
  const { animeId } = useParams();
  const [searchParams] = useSearchParams();
  const videoUrl = searchParams.get("url");
  const episodeTitle = searchParams.get("title") || "Episode";
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handle loading state
  useEffect(() => {
    if (videoUrl) {
      setIsLoading(false);
    } else {
      setError("No video URL provided");
      setIsLoading(false);
    }
  }, [videoUrl]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h1 className="text-2xl md:text-3xl font-bold">{episodeTitle}</h1>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">Loading video...</span>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 text-xl">{error}</p>
              <Button onClick={() => window.history.back()} className="mt-4">
                Go Back
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-[0_0_25px_rgba(255,0,0,0.3)]">
                <video 
                  src={videoUrl || ""}
                  controls
                  autoPlay
                  className="w-full h-full"
                  onError={() => setError("Failed to load video. The URL might be invalid or the video format is not supported.")}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Video Controls</h3>
                  <p className="text-muted-foreground text-sm">
                    Use the video player controls to play, pause, adjust volume, or enter fullscreen mode.
                  </p>
                </div>
                <div className="flex flex-col md:items-end justify-center space-y-2">
                  <Button onClick={() => window.history.back()} variant="outline" className="md:w-auto w-full">
                    Back to Anime
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VideoPlayer;
