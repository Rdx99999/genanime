import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '@videojs/themes/dist/city/index.css';

interface VideoJSPlayerProps {
  src: string;
  onTimeUpdate?: (currentTime: number) => void;
  onLoadedData?: (duration: number) => void;
  startTime?: number;
  className?: string;
}

const VideoJSPlayer = ({ 
  src, 
  onTimeUpdate, 
  onLoadedData, 
  startTime = 0,
  className = "" 
}: VideoJSPlayerProps) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add('vjs-default-skin', 'vjs-theme-city');
      videoRef.current.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, {
        controls: true,
        responsive: true,
        fluid: true,
        autoplay: true,
        preload: 'auto',
        playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
        plugins: {
          hotkeys: {
            volumeStep: 0.1,
            seekStep: 5,
            enableModifiersForNumbers: false
          }
        }
      });

      // Set up event listeners
      player.on('timeupdate', () => {
        if (onTimeUpdate) {
          onTimeUpdate(player.currentTime());
        }
      });

      player.on('loadeddata', () => {
        if (onLoadedData) {
          onLoadedData(player.duration());
        }
        // Set start time if provided
        if (startTime > 0 && startTime < player.duration() - 10) {
          player.currentTime(startTime);
        }
      });

      player.on('error', () => {
        console.error('Video player error:', player.error());
      });
    }
  }, []);

  useEffect(() => {
    if (playerRef.current && src) {
      playerRef.current.src({
        src: src,
        type: 'video/mp4'
      });
    }
  }, [src]);

  useEffect(() => {
    if (playerRef.current && startTime > 0) {
      const player = playerRef.current;
      if (player.readyState() >= 1) {
        // Video metadata is loaded
        if (startTime < player.duration() - 10) {
          player.currentTime(startTime);
        }
      }
    }
  }, [startTime]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`video-player-wrapper ${className}`}>
      <div 
        ref={videoRef} 
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ aspectRatio: '16/9' }}
      />
      
      <style>{`
        @media (max-width: 767px) and (orientation: portrait) {
          .vjs-mute-control,
          .vjs-volume-panel {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default VideoJSPlayer;