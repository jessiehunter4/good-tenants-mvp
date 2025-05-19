
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface UserStats {
  total: number;
  tenants: number;
  agents: number;
  landlords: number;
  admins: number;
}

interface ProfileStats {
  tenants: {
    incomplete: number;
    basic: number;
    verified: number;
    premium: number;
  };
  agents: {
    incomplete: number;
    basic: number;
    verified: number;
    premium: number;
  };
  landlords: {
    incomplete: number;
    basic: number;
    verified: number;
    premium: number;
  };
}

interface ListingStats {
  total: number;
  active: number;
  inactive: number;
}

interface InviteStats {
  total: number;
  pending: number;
  accepted: number;
  declined: number;
}

interface AdminStats {
  userStats: UserStats;
  profileStats: ProfileStats;
  listingStats: ListingStats;
  inviteStats: InviteStats;
  recentUsers: any[];
  recentTenants: any[];
  unverifiedUsers: any[];
  loading: boolean;
  refreshData: () => void;
}

export const useAdminStats = (): AdminStats => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats>({
    total: 0,
    tenants: 0,
    agents: 0,
    landlords: 0,
    admins: 0,
  });
  const [profileStats, setProfileStats] = useState<ProfileStats>({
    tenants: { incomplete: 0, basic: 0, verified: 0, premium: 0 },
    agents: { incomplete: 0, basic: 0, verified: 0, premium: 0 },
    landlords: { incomplete: 0, basic: 0, verified: 0, premium: 0 },
  });
  const [listingStats, setListingStats] = useState<ListingStats>({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [inviteStats, setInviteStats] = useState<InviteStats>({
    total: 0,
    pending: 0,
    accepted: 0,
    declined: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentTenants, setRecentTenants] = useState<any[]>([]);
  const [unverifiedUsers, setUnverifiedUsers] = useState<any[]>([]);

  const fetchAdminStats = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Check if user is admin
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (userError) throw userError;
      
      if (userData.role !== "admin") {
        toast({
          title: "Access Denied",
          description: "You need admin privileges to view this page.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      // Fetch user stats
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("role");

      if (usersError) throw usersError;
      
      // Count users by role
      const userCounts = users.reduce((acc: any, user: any) => {
        acc.total++;
        acc[user.role]++;
        return acc;
      }, { total: 0, tenant: 0, agent: 0, landlord: 0, admin: 0 });

      setUserStats({
        total: userCounts.total,
        tenants: userCounts.tenant,
        agents: userCounts.agent,
        landlords: userCounts.landlord,
        admins: userCounts.admin,
      });

      // Fetch profile stats
      const fetchProfileStats = async (table: "tenant_profiles" | "realtor_profiles" | "landlord_profiles", role: keyof ProfileStats) => {
        const { data, error } = await supabase
          .from(table)
          .select("status");
        
        if (error) throw error;
        
        const counts = data.reduce((acc: any, profile: any) => {
          acc[profile.status]++;
          return acc;
        }, { incomplete: 0, basic: 0, verified: 0, premium: 0 });
        
        return counts;
      };

      const tenantProfileStats = await fetchProfileStats("tenant_profiles", "tenants");
      const agentProfileStats = await fetchProfileStats("realtor_profiles", "agents");
      const landlordProfileStats = await fetchProfileStats("landlord_profiles", "landlords");

      setProfileStats({
        tenants: tenantProfileStats,
        agents: agentProfileStats,
        landlords: landlordProfileStats,
      });

      // Fetch listing stats
      const { data: listings, error: listingsError } = await supabase
        .from("listings")
        .select("is_active");
      
      if (listingsError) throw listingsError;
      
      setListingStats({
        total: listings.length,
        active: listings.filter(l => l.is_active).length,
        inactive: listings.filter(l => !l.is_active).length,
      });

      // Fetch invite stats
      const { data: invites, error: invitesError } = await supabase
        .from("invites")
        .select("status");
      
      if (invitesError) throw invitesError;
      
      const inviteCounts = invites.reduce((acc: any, invite: any) => {
        acc.total++;
        acc[invite.status]++;
        return acc;
      }, { total: 0, pending: 0, accepted: 0, declined: 0 });

      setInviteStats(inviteCounts);

      // Fetch recent users
      const { data: recentUsersData, error: recentUsersError } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (recentUsersError) throw recentUsersError;
      setRecentUsers(recentUsersData);

      // Fetch recent tenant profiles with their user data
      const { data: recentTenantsData, error: recentTenantsError } = await supabase
        .from("tenant_profiles")
        .select(`
          *,
          users:id (email)
        `)
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (recentTenantsError) throw recentTenantsError;
      
      // Format the data to include email from the users table
      const formattedTenants = recentTenantsData.map((tenant: any) => ({
        ...tenant,
        email: tenant.users?.email
      }));
      
      setRecentTenants(formattedTenants);

      // Fetch unverified users - we'll get users from all profile tables where is_verified is false or null
      // First, let's get tenant profiles
      const { data: unverifiedTenants, error: unverifiedTenantsError } = await supabase
        .from("tenant_profiles")
        .select(`
          *,
          users:id (email)
        `)
        .in('status', ['incomplete', 'basic'])
        .order("created_at", { ascending: false });
      
      if (unverifiedTenantsError) throw unverifiedTenantsError;

      // Next, let's get agent profiles
      const { data: unverifiedAgents, error: unverifiedAgentsError } = await supabase
        .from("realtor_profiles")
        .select(`
          *,
          users:id (email)
        `)
        .in('status', ['incomplete', 'basic'])
        .order("created_at", { ascending: false });
      
      if (unverifiedAgentsError) throw unverifiedAgentsError;

      // Finally, let's get landlord profiles
      const { data: unverifiedLandlords, error: unverifiedLandlordsError } = await supabase
        .from("landlord_profiles")
        .select(`
          *,
          users:id (email)
        `)
        .in('status', ['incomplete', 'basic'])
        .order("created_at", { ascending: false });
      
      if (unverifiedLandlordsError) throw unverifiedLandlordsError;

      // Format all the unverified users to include email and role
      const formattedUnverifiedTenants = unverifiedTenants.map((tenant: any) => ({
        ...tenant,
        email: tenant.users?.email,
        role: 'tenant'
      }));

      const formattedUnverifiedAgents = unverifiedAgents.map((agent: any) => ({
        ...agent,
        email: agent.users?.email,
        role: 'agent'
      }));

      const formattedUnverifiedLandlords = unverifiedLandlords.map((landlord: any) => ({
        ...landlord,
        email: landlord.users?.email,
        role: 'landlord'
      }));

      // Combine all unverified users
      const allUnverifiedUsers = [
        ...formattedUnverifiedTenants,
        ...formattedUnverifiedAgents,
        ...formattedUnverifiedLandlords
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setUnverifiedUsers(allUnverifiedUsers);

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
    fetchAdminStats();
  }, [user, toast, navigate]);

  return {
    userStats,
    profileStats,
    listingStats,
    inviteStats,
    recentUsers,
    recentTenants,
    unverifiedUsers,
    loading,
    refreshData: fetchAdminStats,
  };
};

export default useAdminStats;
