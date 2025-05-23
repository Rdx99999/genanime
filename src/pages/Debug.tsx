
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Debug = () => {
  const [status, setStatus] = useState<string>("Checking...");
  
  useEffect(() => {
    // Check if basic app loading works
    setStatus("App loaded successfully");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-card rounded-xl p-8 shadow-lg border border-primary/10">
          <h1 className="text-3xl font-bold mb-6 text-center">Debug Page</h1>
          
          <div className="mb-6 p-4 bg-background rounded-md">
            <h2 className="text-xl font-semibold mb-2">Application Status</h2>
            <p className="text-primary">{status}</p>
          </div>
          
          <div className="mb-6 p-4 bg-background rounded-md">
            <h2 className="text-xl font-semibold mb-2">Environment Info</h2>
            <ul className="space-y-2">
              <li>Running on port: 5001</li>
              <li>React version: {React.version}</li>
              <li>Current URL: {window.location.href}</li>
            </ul>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button onClick={() => window.location.href = "/"}>Go to Home</Button>
            <Button onClick={() => window.location.reload()}>Reload Page</Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Debug;
