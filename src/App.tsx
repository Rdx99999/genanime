import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect } from "react";
import { initDevToolsDetector } from "@/lib/devtoolsDetector";

// Import pages
import Index from "@/pages/Index";
import Popular from "@/pages/Popular";
import NewReleases from "@/pages/NewReleases";
import Browse from "@/pages/Browse";
import Admin from "@/pages/Admin";
import AdminLogin from "@/pages/AdminLogin";
import CreateAnime from "@/pages/CreateAnime";
import EditAnime from "@/pages/EditAnime";
import Documentation from "@/pages/Documentation";
import NotFound from "@/pages/NotFound";
import AnimeDetails from "@/pages/AnimeDetails";
import Contact from "@/pages/Contact";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  useEffect(() => {
    // Initialize dev tools detector
    initDevToolsDetector();
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/popular" element={<Popular />} />
              <Route path="/new-releases" element={<NewReleases />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/anime/:id" element={<AnimeDetails />} />
              <Route path="/docs" element={<Documentation />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
          <Route path="/admin/create" element={<ProtectedRoute><CreateAnime /></ProtectedRoute>} />
          <Route path="/admin/edit/:id" element={<ProtectedRoute><EditAnime /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
  );
};

export default App;