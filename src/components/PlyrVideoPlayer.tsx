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
  autoplay?: boolean;
  muted?: boolean;
}

interface PlyrVideoPlayerProps {
  src: string;
  className?: string;
  onStatsUpdate?: (stats: any) => void;
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
            },
            autoplay: true,
            muted: false
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

        /* Hide volume controls on mobile portrait mode */
        @media (max-width: 767px) and (orientation: portrait) {
          .plyr [data-plyr="mute"],
          .plyr [data-plyr="volume"] {
            display: none !important;
          }
        }

        .plyr__control:hover {
          color: hsl(var(--primary));
          transform: scale(1.1);
        }

        .plyr__control.plyr__tab-focus {
          box-shadow: 0 0 0 2px hsl(var(--primary));
        }

        .plyr__menu__container {
          background: rgba(0, 0, 0, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          backdrop-filter: blur(12px);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          width: auto !important;
          min-width: 160px;
          padding: 6px;
          z-index: 9999;
          /* Ensure items are fully visible */
          overflow: visible !important;
        }

        /* Position menu properly in different modes */
        @media (orientation: landscape) {
          .plyr__menu__container {
            right: 5px !important;
          }
        }

        @media (orientation: portrait) {
          .plyr__menu__container {
            left: 50% !important;
            right: auto !important;
            transform: translateX(-50%) !important;
            bottom: 60px !important;
            top: auto !important;
            width: 200px !important;
            max-height: 300px !important;
            overflow-y: auto !important;
            background: rgba(0, 0, 0, 0.95) !important;
          }
          
          /* Make the back button more visible */
          .plyr__menu__container .plyr__control--back {
            padding: 10px !important;
            margin-bottom: 8px !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
          }
          
          /* Make menu items better for touch */
          .plyr__menu__container .plyr__control,
          .plyr__menu__container [role="menuitem"] {
            padding: 12px !important;
            margin: 4px 0 !important;
            font-size: 16px !important;
            display: block !important;
            width: 100% !important;
            text-align: left !important;
            line-height: 1.5 !important;
          }
          
          /* Highlight selected item with accent color */
          .plyr__menu__container [role="menuitemradio"][aria-checked=true] {
            background: rgba(255, 0, 0, 0.2) !important;
            color: hsl(var(--primary)) !important;
          }
          
          /* Make sure the speed values are visible */
          .plyr__menu__container [role="menuitemradio"] .plyr__menu__value {
            display: inline-block !important;
            padding-left: 10px !important;
            color: rgba(255, 255, 255, 0.8) !important;
          }
        }

        .plyr__menu__container .plyr__control {
          color: white;
          font-size: 14px;
          text-align: center;
          padding: 8px;
        }

        .plyr__menu__container .plyr__control--back {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 5px;
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
            min-width: 48px;
            min-height: 48px;
          }

          .plyr__control--overlaid {
            width: 70px;
            height: 70px;
          }

          .plyr__control--overlaid svg {
            transform: scale(1.2);
          }

          .plyr__tooltip {
            font-size: 13px;
            padding: 6px 10px;
          }
        }

        /* Portrait mode specific styles */
        @media (max-width: 768px) and (orientation: portrait) {
          /* Increase spacing between controls for better touch targets */
          .plyr__controls {
            gap: 8px;
            padding-bottom: 20px;
          }

          /* Custom style for playback rate menu on mobile portrait */
          .plyr__menu__container {
            background: rgba(0, 0, 0, 0.95);
            width: 200px !important;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 10px;
            z-index: 9999 !important;
            /* Improved visibility with shadow */
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
          }

          /* Make touch targets larger on mobile portrait */
          .plyr__menu__container .plyr__control {
            padding: 14px;
            margin: 5px 0;
            font-size: 16px;
            border-radius: 8px;
          }
          
          /* Ensure menu is high enough in the z-index stack */
          .plyr__menu__container {
            z-index: 9999 !important;
          }
          
          /* Make sure all menu options are visible by setting a max height and scroll */
          .plyr__menu__container [role="menu"] {
            max-height: 300px;
            overflow-y: auto;
          }

          /* Position the time display for better visibility */
          .plyr__time {
            font-size: 14px;
            min-width: 50px;
            text-align: center;
          }
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

          /* Optimize touch experience for mobile portrait mode */
          @media (orientation: portrait) {
            .plyr__control--overlaid {
              opacity: 0.9;
              background: rgba(0, 0, 0, 0.6);
              border: 2px solid hsl(var(--primary));
              transform: scale(1.1);
            }

            /* Increase progress bar height for better touch control */
            .plyr__progress input[type=range]::-webkit-slider-runnable-track {
              height: 6px !important;
            }

            .plyr__progress input[type=range]::-webkit-slider-thumb {
              width: 16px !important;
              height: 16px !important;
              margin-top: -5px !important;
            }
          }
      `}</style>
    </div>
  );
};

export default PlyrVideoPlayer;