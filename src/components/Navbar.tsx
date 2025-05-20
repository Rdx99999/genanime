import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu, X, Search, User, Bell, ChevronDown, Star, Home, Compass, Clock, Hash, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

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
    { path: "/new-releases", label: "New Releases", icon: <Clock className="h-4 w-4" /> },
    { path: "/contact", label: "Contact", icon: <Hash className="h-4 w-4" /> } // Added contact page
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-200 ${
        scrolled ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80" : "bg-background"
      }`}
    >
      <div className="container mx-auto px-4 py-2 md:py-3">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/genAnime-logo.png" alt="GenAnime" className="h-7 w-auto sm:h-8" />
            <span className="text-lg md:text-xl font-bold hidden sm:inline-block">GenAnime</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5 ${
                  isActive(item.path) ? "text-primary" : "text-foreground/80"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:w-80 bg-background">
              <div className="flex flex-col h-full">
                <div className="px-6 py-5 flex items-center justify-between">
                  <Link to="/" className="flex items-center space-x-2">
                    <img src="/genAnime-logo.png" alt="GenAnime" className="h-7 w-auto" />
                    <span className="text-lg font-bold">GenAnime</span>
                  </Link>
                  <Button variant="ghost" size="sm" className="hover:bg-accent" onClick={() => setIsMenuOpen(false)}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>
                <nav className="flex flex-col space-y-1 px-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-accent transition-colors ${
                        isActive(item.path) ? "text-primary" : ""
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto px-6 py-4">
                  <Button variant="outline" className="w-full justify-center">
                    Login
                  </Button>
                  <Button className="w-full justify-center">Sign Up</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hover:bg-accent">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="ghost" size="sm" className="relative hover:bg-accent">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full border border-background"></div>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;