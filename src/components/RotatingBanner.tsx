import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Play,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getActiveBanners } from "@/lib/bannerData";
import { Banner } from "@/types/banner";
const RotatingBanner = () => {
  const [bannerData, setBannerData] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isLoading, setIsLoading] = useState(true);

  // Load banners from admin panel
  useEffect(() => {
    const loadBanners = async () => {
      try {
        const activeBanners = await getActiveBanners();
        setBannerData(activeBanners);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load banners:", error);
        setIsLoading(false);
      }
    };
    loadBanners();
  }, []);

  // Auto-rotate banners
  useEffect(() => {
    if (!isAutoplay || bannerData.length === 0) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerData.length);
    }, 6000); // Change every 6 seconds

    return () => clearInterval(interval);
  }, [isAutoplay, bannerData.length]);

  // Pause autoplay when hovering
  const handleMouseEnter = () => setIsAutoplay(false);
  const handleMouseLeave = () => setIsAutoplay(true);

  // Navigate to previous banner
  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + bannerData.length) % bannerData.length,
    );
  };

  // Navigate to next banner
  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerData.length);
  };

  // Handle direct navigation via dots
  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const currentBanner = bannerData[currentIndex];

  // Show loading state while banners are loading
  if (isLoading) {
    return (
      <div className="relative w-full h-[70vh] overflow-hidden flex items-center justify-center bg-gradient-to-r from-primary/20 to-secondary/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading banners...</p>
        </div>
      </div>
    );
  }

  // Show message if no banners are available
  if (!bannerData.length) {
    return (
      <div className="relative w-full h-[70vh] overflow-hidden flex items-center justify-center bg-gradient-to-r from-primary/20 to-secondary/20">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">No banners available</p>
          <p className="text-muted-foreground">Add banners from the admin panel to display here</p>
        </div>
      </div>
    );
  }

  // Safety check for current banner
  if (!currentBanner) {
    return null;
  }

  // Animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <div
      className="relative w-full h-[70vh] overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background image with overlay */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentBanner.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transform transition-transform duration-10000 ease-out hover:scale-105"
            style={{ backgroundImage: `url(${currentBanner.image})` }}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-r ${currentBanner.color} mix-blend-multiply`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentBanner.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, type: "tween" }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="flex items-center mb-2">
                    <h3 className="text-sm md:text-base font-medium text-primary">
                      {currentBanner.subtitle}
                    </h3>
                    <div className="ml-3 flex items-center bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                      <span className="mr-1">★</span> {currentBanner.rating}
                    </div>
                    <div className="ml-2 bg-secondary/40 text-white/90 px-2 py-0.5 rounded-full text-xs font-medium">
                      {currentBanner.episodes} Episodes
                    </div>
                  </div>
                </motion.div>

                <motion.h2
                  className="text-4xl md:text-6xl font-bold mb-4 text-white anime-title uppercase tracking-wider"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {currentBanner.title}
                </motion.h2>

                <motion.p
                  className="text-lg md:text-xl text-white/90 mb-6 max-w-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  {currentBanner.description}
                </motion.p>

                <motion.div
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Button
                    size="lg"
                    className="rounded-full gap-2 bg-primary hover:bg-primary/90 hover:scale-105 transition-all"
                  >
                    <Play className="h-4 w-4" /> Watch Now
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full bg-black/30 border-white/30 text-white gap-2 hover:bg-black/50 hover:border-white/50 transition-all"
                  >
                    <Info className="h-4 w-4" /> More Info
                  </Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <div className="absolute inset-y-0 left-4 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/20 hover:bg-black/40 text-white border border-white/10"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      <div className="absolute inset-y-0 right-4 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/20 hover:bg-black/40 text-white border border-white/10"
          onClick={goToNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center">
        <div className="w-1/2 max-w-md bg-black/30 h-1 rounded-full flex overflow-hidden">
          {bannerData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-full transition-all duration-300 ease-in-out ${
                index === currentIndex
                  ? "bg-primary flex-grow"
                  : "bg-white/30 hover:bg-white/50 flex-grow"
              }`}
              style={{
                width: `${100 / bannerData.length}%`,
                transition:
                  index === currentIndex ? "width 5.9s linear" : "none",
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
        {bannerData.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? "bg-primary scale-125"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default RotatingBanner;
