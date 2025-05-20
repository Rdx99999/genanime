
import devtools from 'devtools-detector';

export const initDevToolsDetector = () => {
  // Set up the detector
  devtools.addListener((isOpen) => {
    if (isOpen) {
      // If dev tools are open, refresh the page every 0.3 seconds
      const refreshInterval = setInterval(() => {
        window.location.reload();
      }, 300);
      
      // Clear interval when dev tools are closed
      devtools.removeListener(() => {
        clearInterval(refreshInterval);
      });
    }
  });
  
  // Initialize the detector
  devtools.launch();
};
