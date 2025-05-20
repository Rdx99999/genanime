
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithAdmin: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if session exists in localStorage (for admin login)
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession) {
      setIsAuthenticated(true);
      setUser({ role: 'admin' });
    }

    // Check for Supabase session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
        setUser(data.session.user);
      }
      setLoading(false);
    };

    checkSession();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session);
        setUser(session?.user || null);
      }
    );

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Logged in successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to login",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithAdmin = async (username: string, password: string): Promise<boolean> => {
    try {
      const adminUsername = import.meta.env.VITE_APP_ADMIN_USERNAME;
      const adminPassword = import.meta.env.VITE_APP_ADMIN_PASSWORD;
      
      // Import hashUtils (will be used for future password hashing)
      const { hashUtils } = await import('@/lib/hashUtils');
      
      // For demonstration - in a real app, you would store hashed passwords
      // and compare the hashes, not the raw values
      if (username === adminUsername && password === adminPassword) {
        // Generate a session token with HMAC for better security
        const timestamp = Date.now().toString();
        const sessionToken = hashUtils.hmacSha256(username + timestamp, adminPassword);
        
        // Set admin session with the secure token
        localStorage.setItem('adminSession', sessionToken);
        localStorage.setItem('adminSessionTime', timestamp);
        
        setIsAuthenticated(true);
        setUser({ role: 'admin', sessionToken });
        
        toast({
          title: "Success",
          description: "Admin logged in successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: "Invalid admin credentials",
          variant: "destructive",
        });
        return false;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to login as admin",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Clear admin session if exists
      localStorage.removeItem('adminSession');
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      setIsAuthenticated(false);
      setUser(null);
      
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to logout",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, loginWithAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
