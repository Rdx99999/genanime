
import * as React from "react"

// Define breakpoints for responsive design
export const breakpoints = {
  mobile: 640,
  tablet: 768,
  laptop: 1024,
  desktop: 1280
};

/**
 * Hook to detect if the current viewport is mobile-sized
 * @returns boolean indicating if the current viewport is mobile
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoints.tablet - 1}px)`)
    
    const onChange = () => {
      setIsMobile(window.innerWidth < breakpoints.tablet)
    }
    
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < breakpoints.tablet)
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

/**
 * Hook to detect current device screen size
 * @returns Object with boolean flags for different screen sizes
 */
export function useResponsive() {
  const [screenSize, setScreenSize] = React.useState({
    isMobile: false,
    isTablet: false,
    isLaptop: false,
    isDesktop: false
  });

  React.useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width < breakpoints.mobile,
        isTablet: width >= breakpoints.mobile && width < breakpoints.laptop,
        isLaptop: width >= breakpoints.laptop && width < breakpoints.desktop,
        isDesktop: width >= breakpoints.desktop
      });
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  return screenSize;
}
