import { useState, useRef, useEffect } from "react";
import { Anime } from "@/types/anime";
import AnimeCard from "./AnimeCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface AnimeSliderProps {
  title: string;
  description?: string;
  animes: Anime[];
  onAnimeClick: (anime: Anime) => void;
}

const AnimeSlider = ({ title, description, animes, onAnimeClick }: AnimeSliderProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const handleScroll = (direction: "left" | "right") => {
    const slider = sliderRef.current;
    if (!slider) return;

    const scrollAmount = direction === "left" ? -slider.clientWidth * 0.8 : slider.clientWidth * 0.8;
    slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleScrollEvent = () => {
      setScrollPosition(slider.scrollLeft);
    };

    slider.addEventListener("scroll", handleScrollEvent);
    return () => slider.removeEventListener("scroll", handleScrollEvent);
  }, []);

  const showLeftArrow = scrollPosition > 20;
  const showRightArrow = sliderRef.current
    ? scrollPosition < sliderRef.current.scrollWidth - sliderRef.current.clientWidth - 20
    : true;

  return (
    <div className="relative group">
      <div className="flex items-baseline justify-between mb-2 sm:mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold">{title}</h3>
          {description && <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>

      <div className="relative">
        {showLeftArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm rounded-full shadow-md opacity-90 hover:opacity-100"
            onClick={() => handleScroll("left")}
          >
            <ChevronLeft className={isMobile ? "h-4 w-4" : "h-6 w-6"} />
          </Button>
        )}

        <div
          ref={sliderRef}
          className="flex overflow-x-auto space-x-3 sm:space-x-4 pb-3 sm:pb-4 scrollbar-hide -mx-2 px-2 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {animes.map((anime) => (
            <div 
              key={anime.id} 
              className="flex-shrink-0 w-[140px] xs:w-[160px] sm:w-[180px]"
            >
              <AnimeCard anime={anime} onClick={() => onAnimeClick(anime)} />
            </div>
          ))}
        </div>

        {showRightArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm rounded-full shadow-md opacity-90 hover:opacity-100"
            onClick={() => handleScroll("right")}
          >
            <ChevronRight className={isMobile ? "h-4 w-4" : "h-6 w-6"} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default AnimeSlider;