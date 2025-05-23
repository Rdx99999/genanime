import { useState, useMemo, useEffect } from "react";
import { DownloadLink } from "@/types/anime";
import { Button } from "@/components/ui/button";
import { Download, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

interface EpisodeDownloadListProps {
  downloadLinks: DownloadLink[];
  animeTitle?: string;
}

const EpisodeDownloadList = ({ downloadLinks, animeTitle }: EpisodeDownloadListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const [searchEpisode, setSearchEpisode] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // Set loading to false after component mounts
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Short timeout to show loading indicator briefly

    // Add a timeout to detect if loading hangs
    const errorTimer = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setLoadError(true);
        console.error("Loading timed out");
      }
    }, 10000); // 10 seconds timeout

    return () => {
      clearTimeout(timer);
      clearTimeout(errorTimer);
    };
  }, [loading]);

  // Group links by episode number
  const episodeGroups = useMemo(() => {
    const groups = new Map<number, DownloadLink[]>();

    downloadLinks.forEach(link => {
      const episodeNumber = link.episodeNumber || 1;
      if (!groups.has(episodeNumber)) {
        groups.set(episodeNumber, []);
      }
      groups.get(episodeNumber)?.push(link);
    });

    // Convert to array and sort by episode number
    return Array.from(groups.entries())
      .sort((a, b) => a[0] - b[0]);
  }, [downloadLinks]);

  // Filter episodes based on search
  const filteredEpisodes = useMemo(() => {
    if (!searchEpisode) return episodeGroups;

    const searchTerm = searchEpisode.toLowerCase();
    return episodeGroups.filter(([episodeNumber]) => 
      episodeNumber.toString().includes(searchTerm)
    );
  }, [episodeGroups, searchEpisode]);

  // Pagination
  const totalPages = Math.ceil(filteredEpisodes.length / parseInt(itemsPerPage));
  const paginatedEpisodes = useMemo(() => {
    const startIndex = (currentPage - 1) * parseInt(itemsPerPage);
    const endIndex = startIndex + parseInt(itemsPerPage);
    return filteredEpisodes.slice(startIndex, endIndex);
  }, [filteredEpisodes, currentPage, itemsPerPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Handle episode click
  const toggleEpisode = (episodeNumber: number) => {
    if (selectedEpisode === episodeNumber) {
      setSelectedEpisode(null);
    } else {
      setSelectedEpisode(episodeNumber);
    }
  };

  return (
    <div className="space-y-3">
      {/* Search and filter controls */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search episode..."
            value={searchEpisode}
            onChange={(e) => {
              setSearchEpisode(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="w-full pl-8"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Show:</span>
          <Select value={itemsPerPage} onValueChange={(value) => {
            setItemsPerPage(value);
            setCurrentPage(1); // Reset to first page when changing items per page
          }}>
            <SelectTrigger className="w-[70px] h-8 sm:w-[80px] sm:h-9">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Episode list */}
      <div className="space-y-1 md:space-y-2 max-h-[50vh] sm:max-h-[300px] overflow-y-auto pr-1 -mx-2 px-2">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : loadError ? (
          <div className="p-4 text-center">
            <p className="text-red-500">Something went wrong loading the content. Please try refreshing the page.</p>
          </div>
        ) : (
          filteredEpisodes.length > 0 ? (
            paginatedEpisodes.map(([episodeNumber, links]) => (
              <div key={episodeNumber} className="space-y-1">
                <motion.div 
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                  className="flex items-center justify-between bg-gradient-to-r from-secondary/50 to-secondary/30 p-2 md:p-3 rounded-lg cursor-pointer active:bg-secondary/70 touch-manipulation border border-primary/10 hover:border-primary/30 transition-all"
                  onClick={() => toggleEpisode(episodeNumber)}
                >
                  <div className="flex-1 min-w-0 flex items-center">
                    <span className="inline-flex items-center justify-center rounded-full bg-primary/20 text-primary h-6 w-6 mr-2 text-[10px] font-bold">{episodeNumber}</span>
                    <div>
                      <span className="text-xs md:text-sm font-medium">Episode {episodeNumber}</span>
                      <span className="text-xs text-muted-foreground ml-1 md:ml-2">({links.length} qualities)</span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="ml-1 md:ml-2 p-1 hover:bg-primary/10">
                    <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${selectedEpisode === episodeNumber ? 'rotate-90 text-primary' : ''}`} />
                  </Button>
                </motion.div>

                {/* Quality options */}
                {selectedEpisode === episodeNumber && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="pl-3 sm:pl-6 space-y-2 mt-2 overflow-hidden"
                  >
                    {links.map((link) => (
                      <motion.div 
                        key={link.id} 
                        initial={{ x: -5, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between bg-background/60 backdrop-blur-sm p-2 md:p-3 rounded-lg border border-primary/10 hover:border-primary/30 transition-all"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                            <span className="text-xs text-muted-foreground">Quality: </span>
                            <span className="text-xs md:text-sm font-medium ml-1">{link.quality}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button 
                            size="sm" 
                            variant="default" 
                            className="ml-1 p-1 md:px-3 border-primary/20 hover:bg-primary hover:text-white transition-colors"
                            onClick={() => {
                              // Use the full anime title if available, otherwise use episode number
                              const title = animeTitle ? animeTitle : `Episode ${link.episodeNumber}`;
                              
                              // Use navigate instead of direct window.location for better SPA experience
                              const videoUrl = `/video?url=${encodeURIComponent(link.url)}&title=${encodeURIComponent(title)}&episode=${link.episodeNumber}&quality=${link.quality}`;
                              
                              // Save this episode as recently clicked
                              try {
                                const recent = JSON.parse(localStorage.getItem('recentClicks') || '[]');
                                const newRecent = [
                                  {
                                    title,
                                    episode: link.episodeNumber,
                                    quality: link.quality,
                                    timestamp: new Date().toISOString()
                                  },
                                  ...recent.filter((i: any) => 
                                    !(i.title === title && i.episode === link.episodeNumber)
                                  )
                                ].slice(0, 10);
                                localStorage.setItem('recentClicks', JSON.stringify(newRecent));
                              } catch (e) {
                                console.error("Error saving recent click:", e);
                              }
                              
                              // Navigate to video player
                              window.location.href = videoUrl;
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 md:h-4 md:w-4 mr-0 md:mr-1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                            <span className="sr-only sm:not-sr-only sm:inline">Watch</span>
                          </Button>
                          <Button size="sm" variant="outline" className="p-1 md:px-3 border-primary/20 hover:bg-primary hover:text-white transition-colors" asChild>
                            <a href={link.url} target="_blank" rel="noreferrer" className="flex items-center">
                              <Download className="h-3 w-3 md:h-4 md:w-4 mr-0 md:mr-1" />
                              <span className="sr-only sm:not-sr-only sm:inline">Download</span>
                            </a>
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No episodes found for your search.
            </div>
          )
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 gap-2">
          <div className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-1 justify-center sm:justify-end">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>

            {/* Show page numbers - adaptive for small screens */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;

                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    <span className="text-xs">{pageNumber}</span>
                  </Button>
                );
              })}
            </div>

            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EpisodeDownloadList;