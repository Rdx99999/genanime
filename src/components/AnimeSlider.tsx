
import { useRef } from "react";
import { Anime } from "@/types/anime";
import AnimeCard from "@/components/AnimeCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface AnimeSliderProps {
  title: string;
  description?: string;
  animes: Anime[];
  onAnimeClick: (anime: Anime) => void;
}

const AnimeSlider = ({ title, description, animes, onAnimeClick }: AnimeSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    
    const scrollAmount = isMobile ? 240 : 320;
    const currentScroll = sliderRef.current.scrollLeft;
    
    sliderRef.current.scrollTo({
      left: direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: "smooth"
    });
  };

  if (!animes || animes.length === 0) return null;

  return (
    <div className="relative mb-8">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        
        <div className="hidden md:flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-8 w-8"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-8 w-8"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div 
        ref={sliderRef}
        className="overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex gap-3 md:gap-4">
          {animes.map((anime) => (
            <div 
              key={anime.id} 
              className="flex-shrink-0 w-[160px] md:w-[200px]"
              onClick={() => onAnimeClick(anime)}
            >
              <AnimeCard anime={anime} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimeSlider;
