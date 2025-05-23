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
          --plyr-color-main: hsl(var(--primary));
          --plyr-font-family: inherit;
          --plyr-font-size-base: 14px;
          --plyr-border-radius: 12px;
          --plyr-control-icon-size: 18px;
          --plyr-control-spacing: 10px;
          --plyr-control-padding: 12px;
          --plyr-menu-background: hsl(var(--background));
          --plyr-menu-border-color: hsl(var(--border));
          --plyr-tooltip-background: hsl(var(--popover));
          --plyr-tooltip-color: hsl(var(--popover-foreground));
        }
        
        .plyr {
          border-radius: 12px;
          overflow: hidden;
        }
        
        .plyr--full-ui input[type=range] {
          color: hsl(var(--primary));
        }
        
        .plyr__control--overlaid {
          background: hsl(var(--primary) / 0.9);
          border: 2px solid hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          border-radius: 50%;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }
        
        .plyr__control--overlaid:hover {
          background: hsl(var(--primary));
          transform: scale(1.05);
          box-shadow: 0 8px 25px hsl(var(--primary) / 0.3);
        }
        
        .plyr__controls {
          background: linear-gradient(
            transparent 0%,
            rgba(0, 0, 0, 0.1) 50%,
            rgba(0, 0, 0, 0.8) 100%
          );
          padding: 20px;
          border-radius: 0 0 12px 12px;
        }
        
        .plyr__control {
          color: white;
          transition: all 0.2s ease;
        }
        
        .plyr__control:hover {
          color: hsl(var(--primary));
          transform: scale(1.1);
        }
        
        .plyr__control.plyr__tab-focus {
          box-shadow: 0 0 0 2px hsl(var(--primary));
        }
        
        .plyr__menu__container {
          background: hsl(var(--background) / 0.95);
          border: 1px solid hsl(var(--border));
          border-radius: 12px;
          backdrop-filter: blur(12px);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }
        
        .plyr__menu__container .plyr__control {
          color: hsl(var(--foreground));
        }
        
        .plyr__menu__container .plyr__control:hover {
          background: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
        }
        
        .plyr__progress input[type=range] {
          color: hsl(var(--primary));
        }
        
        .plyr__progress input[type=range]::-webkit-slider-thumb {
          background: hsl(var(--primary));
          border: 2px solid white;
          box-shadow: 0 4px 12px hsl(var(--primary) / 0.4);
        }
        
        .plyr__volume input[type=range] {
          color: hsl(var(--primary));
        }
        
        .plyr__tooltip {
          background: hsl(var(--popover));
          color: hsl(var(--popover-foreground));
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
          font-size: 12px;
          padding: 4px 8px;
        }
        
        .plyr__time {
          color: white;
          font-weight: 500;
        }
        
        /* Dark theme specific adjustments */
        @media (prefers-color-scheme: dark) {
          .plyr__controls {
            background: linear-gradient(
              transparent 0%,
              rgba(0, 0, 0, 0.2) 50%,
              rgba(0, 0, 0, 0.9) 100%
            );
          }
        }
        
        /* Mobile responsive design */
        @media (max-width: 768px) {
          .plyr__controls {
            padding: 16px;
          }
          
          .plyr__control {
            padding: 12px;
            min-width: 44px;
            min-height: 44px;
          }
          
          .plyr__control--overlaid {
            width: 64px;
            height: 64px;
          }
          
          .plyr__tooltip {
            font-size: 11px;
          }
        }
        
        /* Custom loading animation */
        .plyr__poster {
          background-size: cover;
          background-position: center;
          border-radius: 12px;
        }
        
        /* Volume slider styling */
        .plyr__volume input[type=range]::-webkit-slider-track {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }
        
        .plyr__volume input[type=range]::-webkit-slider-thumb {
          background: hsl(var(--primary));
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px hsl(var(--primary) / 0.3);
        }
      `}</style>
    </div>
  );
};

export default PlyrVideoPlayer;