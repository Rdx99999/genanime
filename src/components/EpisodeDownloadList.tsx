
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DownloadLink {
  episodeNumber: number;
  quality: string;
  size?: string;
  url: string;
}

interface EpisodeDownloadListProps {
  downloadLinks: DownloadLink[];
  episodeCount?: number;
  animeId?: string;
}

const EpisodeDownloadList = ({ downloadLinks, episodeCount, animeId }: EpisodeDownloadListProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [episodesPerPage, setEpisodesPerPage] = useState(10);
  const [selectedQuality, setSelectedQuality] = useState<string | null>(null);
  
  // Group download links by episode number
  const episodeMap: Record<string, DownloadLink[]> = {};
  
  downloadLinks.forEach((link) => {
    const episode = link.episodeNumber.toString();
    if (!episodeMap[episode]) {
      episodeMap[episode] = [];
    }
    episodeMap[episode].push(link);
  });
  
  // Get array of episode numbers
  const episodeNumbers = Object.keys(episodeMap).map(Number).sort((a, b) => b - a);
  
  // Get available qualities across all episodes
  const allQualities = Array.from(new Set(downloadLinks.map(link => link.quality)));
  
  useEffect(() => {
    // Reset to first page when search term changes
    setCurrentPage(1);
    
    // Set default quality if not set and qualities exist
    if (!selectedQuality && allQualities.length > 0) {
      setSelectedQuality(allQualities[0]);
    }
  }, [searchTerm, allQualities, selectedQuality]);
  
  // Filter episodes based on search term
  const filteredEpisodes = episodeNumbers.filter(ep => 
    ep.toString().includes(searchTerm)
  );
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredEpisodes.length / episodesPerPage);
  const indexOfLastEpisode = currentPage * episodesPerPage;
  const indexOfFirstEpisode = indexOfLastEpisode - episodesPerPage;
  const currentEpisodes = filteredEpisodes.slice(indexOfFirstEpisode, indexOfLastEpisode);
  
  // Handle pagination
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  
  // Handle quality change
  const handleQualityChange = (quality: string) => {
    setSelectedQuality(quality);
  };
  
  // Handle watch button click
  const handleWatchClick = (episode: number) => {
    const links = episodeMap[episode.toString()];
    if (!links || links.length === 0) return;
    
    // Find link with selected quality or use the first available
    const linkToUse = selectedQuality 
      ? links.find(link => link.quality === selectedQuality) || links[0] 
      : links[0];
      
    navigate(`/video?url=${encodeURIComponent(linkToUse.url)}&episode=${episode}&quality=${linkToUse.quality}&title=${animeId || ''}`);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search episode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </div>
        </div>
        <div className="flex-shrink-0 sm:w-48">
          <Select value={selectedQuality || ""} onValueChange={handleQualityChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              {allQualities.map(quality => (
                <SelectItem key={quality} value={quality}>
                  {quality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-shrink-0 sm:w-48">
          <Select 
            value={episodesPerPage.toString()} 
            onValueChange={(value) => setEpisodesPerPage(Number(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Episodes per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredEpisodes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No episodes found matching your search</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentEpisodes.map((episode) => {
              const links = episodeMap[episode.toString()];
              const qualities = links.map(link => link.quality);
              // Find link with selected quality or default to first
              const linkToUse = selectedQuality 
                ? links.find(link => link.quality === selectedQuality) || links[0] 
                : links[0];
                
              return (
                <div 
                  key={episode} 
                  className="bg-card/50 border border-primary/10 rounded-lg p-3 hover:bg-secondary/20 transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Episode {episode}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {qualities.length} {qualities.length === 1 ? 'quality' : 'qualities'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleWatchClick(episode)}
                    >
                      <Play className="h-4 w-4 mr-2" /> Watch
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => window.open(linkToUse.url, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Pagination controls */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Showing {indexOfFirstEpisode + 1}-{Math.min(indexOfLastEpisode, filteredEpisodes.length)} of {filteredEpisodes.length} episodes
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <div className="hidden sm:flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Calculate which page numbers to show
                  let pageNum = i + 1;
                  if (totalPages > 5) {
                    if (currentPage > 3) {
                      pageNum = currentPage - 3 + i;
                    }
                    if (pageNum > totalPages) {
                      pageNum = totalPages - (4 - i);
                    }
                  }
                  
                  if (pageNum > 0 && pageNum <= totalPages) {
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => paginate(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                  return null;
                })}
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EpisodeDownloadList;
