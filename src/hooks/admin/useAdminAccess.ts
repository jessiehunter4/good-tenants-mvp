
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useAdminAccess = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  const checkAdminAccess = async () => {
    if (!user) {
      setHasAccess(false);
      setLoading(false);
      return false;
    }

    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (userError) throw userError;
      
      const isAdmin = userData.role === "admin";
      setHasAccess(isAdmin);
      
      if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "You need admin privileges to view this page.",
          variant: "destructive",
        });
        navigate("/");
      }
      
      return isAdmin;
    } catch (error) {
      console.error("Error checking admin access:", error);
      toast({
        title: "Error",
        description: "Failed to verify admin access.",
        variant: "destructive",
      });
      navigate("/");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminAccess();
  }, [user, navigate, toast]);

  return {
    hasAccess,
    loading,
    checkAdminAccess,
  };
};
