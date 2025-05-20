import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Anime } from "@/types/anime";
import { Star, Calendar, Play, Download } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";

interface AnimeCardProps {
  anime: Anime;
  onClick?: (e?: React.MouseEvent) => void;
}

const AnimeCard = ({ anime, onClick }: AnimeCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    } else {
      navigate(`/anime/${anime.id}`);
    }
  };

  return (
    <div onClick={handleClick} className="h-full overflow-visible cursor-pointer">
      <motion.div
        whileHover={{ 
          y: -10,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="h-full pt-6 -mt-3 overflow-visible"
      >
        <Card className="overflow-hidden h-full border-primary/10 shadow-lg relative group flex flex-col">
          <div className="aspect-[3/4] relative overflow-hidden flex-shrink-0">
            <motion.img 
              src={anime.imageUrl || anime.coverImage}
              alt={anime.title} 
              className="object-cover w-full h-full transition-transform"
              animate={{ 
                scale: isHovered ? 1.05 : 1 
              }}
              transition={{ duration: 0.5 }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=500";
              }}
            />

            {/* Overlay on hover */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
            >
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mb-2"
              >
                <button className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-colors">
                  <Download className="h-4 w-4" /> Download Now
                </button>
              </motion.div>
            </motion.div>
              <div className="absolute top-2 right-2 flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 bg-background/90 text-primary font-semibold rounded-lg text-[10px] sm:text-xs">
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1 fill-primary stroke-0" />
                {anime.rating || "N/A"}
              </div>
              <div className="absolute left-0 top-0 p-1.5 sm:p-2 flex flex-col gap-1">
                {anime.isPopular && (
                  <span className="bg-primary text-white text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 rounded-md">
                    Popular
                  </span>
                )}
                {anime.isNewRelease && (
                  <span className="bg-accent text-white text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 rounded-md">
                    New
                  </span>
                )}
              </div>
          </div>

          <CardContent className="p-4 pt-3 relative flex-grow flex flex-col">
            <h3 className="font-semibold text-base mb-1 line-clamp-1 group-hover:text-primary transition-colors anime-title">
              {anime.title}
            </h3>

            <div className="flex justify-between items-center text-xs text-muted-foreground mt-auto">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{anime.releaseYear || anime.year}</span>
              </div>

              <div className="flex items-center gap-1">
                <span>EP: {anime.episodes || anime.episodeCount}</span>
              </div>
            </div>

            {/* Genre pills */}
            {anime.genres && anime.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2 min-h-[22px]">
                {anime.genres.slice(0, 2).map((genre, index) => (
                  <span key={index} className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px]">
                    {genre}
                  </span>
                ))}
                {anime.genres.length > 2 && (
                  <span className="px-1.5 py-0.5 bg-muted text-muted-foreground rounded text-[10px]">
                    +{anime.genres.length - 2}
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

// Add some sample genres for demonstration
const AnimeCardWithGenres = ({ anime, onClick }: AnimeCardProps) => {
  // Add random genres if not present
  const animeWithGenres = {
    ...anime,
    genres: anime.genres || [
      ["Action", "Fantasy", "Adventure", "Comedy", "Sci-Fi", "Romance", "Drama", "Mystery", "Supernatural"][
        Math.floor(Math.random() * 9)
      ],
      ["Action", "Fantasy", "Adventure", "Comedy", "Sci-Fi", "Romance", "Drama", "Mystery", "Supernatural"][
        Math.floor(Math.random() * 9)
      ],
      ["Action", "Fantasy", "Adventure", "Comedy", "Sci-Fi", "Romance", "Drama", "Mystery", "Supernatural"][
        Math.floor(Math.random() * 9)
      ]
    ]
  };

  return <AnimeCard anime={animeWithGenres} onClick={onClick}/>;
};

export default AnimeCardWithGenres;