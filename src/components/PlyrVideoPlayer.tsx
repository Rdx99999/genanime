import { useEffect, useRef } from 'react';

// Define Plyr interface
interface PlyrOptions {
  controls?: string[];
  settings?: string[];
  speed?: { selected: number; options: number[] };
  keyboard?: { focused: boolean; global: boolean };
  tooltips?: { controls: boolean; seek: boolean };
  captions?: { active: boolean; language: string };
  fullscreen?: { enabled: boolean; fallback: boolean; iosNative: boolean };
  storage?: { enabled: boolean; key: string };
  quality?: { default: string; options: string[] };
}

interface PlyrVideoPlayerProps {
  src: string;
  className?: string;
}

const PlyrVideoPlayer = ({ src, className = "" }: PlyrVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Load Plyr dynamically
    const loadPlyr = async () => {
      try {
        // Import Plyr CSS
        const plyrCSS = document.createElement('link');
        plyrCSS.rel = 'stylesheet';
        plyrCSS.href = 'https://cdn.plyr.io/3.7.8/plyr.css';
        document.head.appendChild(plyrCSS);

        // Import Plyr JS
        const response = await fetch('https://cdn.plyr.io/3.7.8/plyr.polyfilled.js');
        const plyrJS = await response.text();
        
        // Create and execute script
        const script = document.createElement('script');
        script.textContent = plyrJS;
        document.head.appendChild(script);

        // Wait for Plyr to be available
        const waitForPlyr = () => {
          return new Promise<void>((resolve) => {
            const check = () => {
              if ((window as any).Plyr) {
                resolve();
              } else {
                setTimeout(check, 100);
              }
            };
            check();
          });
        };

        await waitForPlyr();

        // Initialize Plyr
        if (videoRef.current && (window as any).Plyr) {
          const plyrOptions: PlyrOptions = {
            controls: [
              'play-large', 
              'play', 
              'progress', 
              'current-time', 
              'duration', 
              'mute', 
              'volume', 
              'settings', 
              'fullscreen'
            ],
            settings: ['speed', 'quality'],
            speed: { 
              selected: 1, 
              options: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] 
            },
            keyboard: { 
              focused: true, 
              global: false 
            },
            tooltips: { 
              controls: true, 
              seek: true 
            },
            fullscreen: { 
              enabled: true, 
              fallback: true, 
              iosNative: true 
            },
            storage: { 
              enabled: false, 
              key: 'plyr' 
            }
          };

          playerRef.current = new (window as any).Plyr(videoRef.current, plyrOptions);

          // Set video source
          playerRef.current.source = {
            type: 'video',
            sources: [
              {
                src: src,
                type: 'video/mp4',
              }
            ]
          };
        }
      } catch (error) {
        console.error('Error loading Plyr:', error);
      }
    };

    loadPlyr();

    // Cleanup
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.error('Error destroying Plyr:', error);
        }
      }
    };
  }, []);

  // Update source when src changes
  useEffect(() => {
    if (playerRef.current && src) {
      playerRef.current.source = {
        type: 'video',
        sources: [
          {
            src: src,
            type: 'video/mp4',
          }
        ]
      };
    }
  }, [src]);

  return (
    <div className={`plyr-video-container ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-full"
        playsInline
        crossOrigin="anonymous"
      />
      
      <style>{`
        .plyr-video-container {
          --plyr-color-main: #3b82f6;
          --plyr-font-family: inherit;
          --plyr-font-size-base: 14px;
          --plyr-border-radius: 8px;
        }
        
        .plyr--full-ui input[type=range] {
          color: #3b82f6;
        }
        
        .plyr__control--overlaid {
          background: rgba(59, 130, 246, 0.9);
        }
        
        .plyr__control--overlaid:hover {
          background: rgba(59, 130, 246, 1);
        }
        
        .plyr__menu__container {
          background: rgba(0, 0, 0, 0.9);
          border-radius: 8px;
        }
        
        .plyr__controls {
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
          padding: 20px;
        }
        
        .plyr__progress input[type=range] {
          color: #3b82f6;
        }
        
        .plyr__volume input[type=range] {
          color: #3b82f6;
        }
        
        @media (max-width: 768px) {
          .plyr__controls {
            padding: 15px;
          }
          
          .plyr__control {
            padding: 10px;
          }
          
          .plyr__control--overlaid {
            width: 60px;
            height: 60px;
          }
        }
      `}</style>
    </div>
  );
};

export default PlyrVideoPlayer;