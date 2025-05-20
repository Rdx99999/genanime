import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu, X, Search, User, Bell, ChevronDown, Star, Home, Compass, Clock, Hash } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
    { path: "/browse", label: "Browse", icon: <Compass className="h-4 w-4" /> },
    { path: "/popular", label: "Popular", icon: <Star className="h-4 w-4" /> },
    { path: "/new-releases", label: "New Releases", icon: <Clock className="h-4 w-4" /> }
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-card/80 backdrop-blur-lg shadow-lg" 
          : "bg-gradient-to-b from-background to-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.img 
              src="/genAnime-logo.png" 
              alt="GenAnime Logo" 
              className="h-9"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              GenAnime
            </span>
          </Link>

          {!isMobile ? (
            <nav className="flex items-center space-x-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-primary/10 flex items-center gap-1.5 ${
                    isActive(item.path) 
                      ? "text-primary" 
                      : "text-foreground/80"
                  }`}
                >
                  {item.icon}
                  {item.label}
                  {isActive(item.path) && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                      layoutId="navbar-indicator"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </nav>
          ) : (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-0 bg-card/95 backdrop-blur-xl border-l border-primary/10">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center p-4 border-b border-border/40">
                    <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
                      <img src="/genAnime-logo.png" alt="GenAnime Logo" className="h-8" />
                      <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        GenAnime
                      </span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)} className="hover:bg-primary/10">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </div>

                  <div className="p-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search anime..."
                        className="w-full bg-muted border-0 rounded-full py-2 pl-10 pr-4 text-sm"
                      />
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <nav className="flex flex-col p-4 pt-2 space-y-1">
                    {menuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 text-sm font-medium transition-colors px-3 py-2.5 rounded-lg ${
                          isActive(item.path) 
                            ? "text-primary bg-primary/10" 
                            : "text-foreground/80 hover:bg-muted"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="border-t border-border/40 mt-4 p-4">
                    <div className="space-y-3">
                      <div className="text-xs font-medium text-muted-foreground mb-2 px-3">ACCOUNT</div>
                      <a href="#" className="flex items-center gap-3 text-sm font-medium px-3 py-2.5 rounded-lg hover:bg-muted">
                        <User className="h-4 w-4" />
                        Profile
                      </a>
                      <a href="#" className="flex items-center gap-3 text-sm font-medium px-3 py-2.5 rounded-lg hover:bg-muted">
                        <Bell className="h-4 w-4" />
                        Notifications
                      </a>
                      <div className="flex items-center justify-between gap-3 text-sm font-medium px-3 py-2.5 rounded-lg hover:bg-muted cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Star className="h-4 w-4" />
                          Favorites
                        </div>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* Login buttons removed */}
                </div>
              </SheetContent>
            </Sheet>
          )}

          {!isMobile && (
            <div className="flex items-center space-x-2">
              <AnimatePresence>
                {searchActive ? (
                  <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "200px", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative"
                  >
                    <input
                      type="text"
                      placeholder="Search anime..."
                      className="w-full h-9 bg-muted border-0 rounded-full py-2 pl-9 pr-3 text-sm"
                      autoFocus
                      onBlur={() => setSearchActive(false)}
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </motion.div>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setSearchActive(true)}
                    className="hover:bg-primary/10 w-9 h-9"
                  >
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Search</span>
                  </Button>
                )}
              </AnimatePresence>

              <Button variant="ghost" size="icon" className="hover:bg-primary/10 w-9 h-9">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Notifications</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;