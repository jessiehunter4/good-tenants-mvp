import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { createHash } from "crypto-js/sha256";

interface UserProfile {
  id: string;
  status: string;
  // Add other profile fields as needed
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: string, adminCode?: string) => Promise<void>;
  signOut: () => Promise<void>;
  getUserRole: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Store a hash of the admin code instead of the raw value
const ADMIN_CODE_HASH = "8c1c86e76a314f2a7637d60318111195b0c3c6f999e99282aaf1068f699b32e5"; // SHA-256 hash of GT_ADMIN_2024

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user profile based on role
  const fetchUserProfile = async (userId: string, role: string) => {
    try {
      let tableName = '';
      switch (role) {
        case 'tenant':
          tableName = 'tenant_profiles';
          break;
        case 'agent':
          tableName = 'realtor_profiles';
          break;
        case 'landlord':
          tableName = 'landlord_profiles';
          break;
        default:
          return null;
      }

      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, sessionData) => {
        if (sessionData) {
          setSession(sessionData);
          setUser(sessionData.user);
          
          // Fetch user profile
          const role = await getUserRole();
          if (role) {
            const profile = await fetchUserProfile(sessionData.user.id, role);
            setUserProfile(profile);
          }
        } else {
          setSession(null);
          setUser(null);
          setUserProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: sessionData } }) => {
      setSession(sessionData);
      setUser(sessionData?.user ?? null);
      
      if (sessionData?.user) {
        const role = await getUserRole();
        if (role) {
          const profile = await fetchUserProfile(sessionData.user.id, role);
          setUserProfile(profile);
        }
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getUserRole = async (): Promise<string | null> => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();
      
      if (error) {
        console.error("Error fetching user role:", error);
        return null;
      }
      
      return data?.role || null;
    } catch (error) {
      console.error("Error in getUserRole:", error);
      return null;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Validate email format
      if (!validateEmail(email)) {
        throw new Error("Invalid email format");
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, role: string, adminCode?: string) => {
    try {
      // Validate email format
      if (!validateEmail(email)) {
        throw new Error("Invalid email format");
      }

      // Validate password strength
      if (!validatePassword(password)) {
        throw new Error("Password must be at least 8 characters and include a number and special character");
      }

      // Verify admin code if trying to register as admin
      if (role === "admin") {
        if (!adminCode) {
          throw new Error("Admin registration code is required");
        }
        
        // Compare the hash of the provided code with the stored hash
        const providedCodeHash = createHash(adminCode).toString();
        if (providedCodeHash !== ADMIN_CODE_HASH) {
          throw new Error("Invalid admin registration code");
        }
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role
          }
        }
      });

      if (error) throw error;
      
      toast({
        title: "Account created!",
        description: "Please check your email for verification instructions.",
      });
    } catch (error: any) {
      toast({
        title: "Error creating account",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Helper function to validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Helper function to validate password strength
  const validatePassword = (password: string): boolean => {
    // Require at least 8 characters, 1 number, and 1 special character
    return password.length >= 8 && 
           /\d/.test(password) && 
           /[!@#$%^&*(),.?":{}|<>]/.test(password);
  };

  return (
    <AuthContext.Provider value={{ user, session, userProfile, loading, signIn, signUp, signOut, getUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
