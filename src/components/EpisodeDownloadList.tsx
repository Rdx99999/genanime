import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DownloadLink } from "@/types/anime";
import { Link } from "react-router-dom";
import { Play, Download } from "lucide-react";

interface EpisodeDownloadListProps {
  downloadLinks: DownloadLink[];
  episodeCount: number;
  animeId?: string;
}

const EpisodeDownloadList = ({
  downloadLinks,
  episodeCount,
  animeId,
}: EpisodeDownloadListProps) => {
  const [expandedEpisodes, setExpandedEpisodes] = useState<Record<number, boolean>>({});

  // Organize download links by episode number
  const episodeLinks: Record<number, DownloadLink[]> = {};
  downloadLinks.forEach((link) => {
    if (!episodeLinks[link.episodeNumber]) {
      episodeLinks[link.episodeNumber] = [];
    }
    episodeLinks[link.episodeNumber].push(link);
  });

  const toggleEpisode = (episodeNumber: number) => {
    setExpandedEpisodes((prev) => ({
      ...prev,
      [episodeNumber]: !prev[episodeNumber],
    }));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Episodes</h2>

      {Array.from({ length: episodeCount }, (_, i) => i + 1).map((episodeNumber) => {
        const links = episodeLinks[episodeNumber] || [];
        const isExpanded = expandedEpisodes[episodeNumber];

        return (
          <div
            key={`episode-${episodeNumber}`}
            className="border rounded-lg overflow-hidden"
          >
            <div
              className="flex justify-between items-center p-4 cursor-pointer bg-card hover:bg-card/80 transition-colors"
              onClick={() => toggleEpisode(episodeNumber)}
            >
              <h3 className="font-medium">Episode {episodeNumber}</h3>
              <div className="flex items-center gap-2">
                {links.length > 0 ? (
                  <Badge variant="outline">{links.length} qualities</Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">Coming soon</Badge>
                )}
                <span className="text-muted-foreground">{isExpanded ? "▼" : "▶"}</span>
              </div>
            </div>

            {isExpanded && (
              <div className="p-4 border-t bg-card/50">
                {links.length > 0 ? (
                  <div className="space-y-3">
                    {/* Watch Button - Primary action */}
                    {links.length > 0 && animeId && (
                      <Link
                        to={`/video?animeId=${animeId}&url=${encodeURIComponent(links[0].url)}&episode=${episodeNumber}&quality=${links[0].quality}`}
                        className="block"
                      >
                        <Button className="w-full gap-2" variant="default">
                          <Play className="h-4 w-4" /> Watch Episode {episodeNumber}
                        </Button>
                      </Link>
                    )}

                    {/* Download Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {links.map((link, index) => (
                        <Button
                          key={`link-${episodeNumber}-${index}`}
                          variant="outline"
                          className="justify-start"
                          asChild
                        >
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="truncate"
                          >
                            <Download className="mr-2 h-4 w-4" /> {link.quality}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-2">
                    No download links available for this episode yet.
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default EpisodeDownloadList;