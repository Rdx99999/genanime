import React from "react";
import { Link } from "react-router-dom";
import { DownloadLink } from "@/types/anime";
import { Button } from "@/components/ui/button";
import { Download, Play } from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

interface EpisodeDownloadListProps {
  downloadLinks: DownloadLink[];
  animeId?: string;
}

const EpisodeDownloadList: React.FC<EpisodeDownloadListProps> = ({ downloadLinks, animeId }) => {
  if (!downloadLinks || downloadLinks.length === 0) {
    return <p className="text-muted-foreground">No download links available.</p>;
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {downloadLinks.map((downloadLink, index) => (
        <AccordionItem key={index} value={`episode-${index}`} className="border border-border rounded-md mb-3 overflow-hidden bg-card">
          <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline hover:bg-accent/50">
            {downloadLink.episodeTitle}
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-3 pt-1">
            <div className="space-y-2">
              {downloadLink.links.map((link, linkIndex) => (
                <div key={linkIndex} className="flex flex-col sm:flex-row gap-2">
                  {/* Watch Now Button - Only show for streamable links */}
                  {link.url && link.url.endsWith('.mp4') && (
                    <Link 
                      to={`/watch/${animeId || 'episode'}?url=${encodeURIComponent(link.url)}&title=${encodeURIComponent(downloadLink.episodeTitle)}`}
                      className="block flex-1"
                    >
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="w-full justify-between bg-primary hover:bg-primary/90"
                      >
                        <span className="truncate">Watch Now ({link.quality})</span>
                        <Play className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  )}

                  {/* Download Button */}
                  <a 
                    href={link.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block flex-1"
                  >
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-between hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <span className="truncate">{link.quality} - {link.size}</span>
                      <Download className="h-4 w-4 ml-2" />
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default EpisodeDownloadList;