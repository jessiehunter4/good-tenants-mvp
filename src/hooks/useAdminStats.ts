
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useUserStats } from "./admin/useUserStats";
import { useProfileStats } from "./admin/useProfileStats";
import { useListingStats } from "./admin/useListingStats";
import { useInviteStats } from "./admin/useInviteStats";
import { useAdminAccess } from "./admin/useAdminAccess";

const useAdminStats = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
  // Admin access check
  const { hasAccess, loading: accessLoading } = useAdminAccess();
  
  // Stats hooks
  const { userStats, recentUsers, fetchUserStats } = useUserStats();
  const { profileStats, recentTenants, unverifiedUsers, fetchProfileStats } = useProfileStats();
  const { listingStats, fetchListingStats } = useListingStats();
  const { inviteStats, fetchInviteStats } = useInviteStats();

  const fetchAdminStats = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch all stats in parallel
      await Promise.all([
        fetchUserStats(),
        fetchProfileStats(),
        fetchListingStats(),
        fetchInviteStats()
      ]);
      
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      toast({
        title: "Error",
        description: "Failed to load admin data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasAccess && !accessLoading) {
      fetchAdminStats();
    }
  }, [hasAccess, accessLoading, user, toast, navigate]);

  return {
    userStats,
    profileStats,
    listingStats,
    inviteStats,
    recentUsers,
    recentTenants,
    unverifiedUsers,
    loading: loading || accessLoading,
    refreshData: fetchAdminStats,
  };
};

export default useAdminStats;
