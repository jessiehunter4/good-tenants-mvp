
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface UserStats {
  total: number;
  tenants: number;
  agents: number;
  landlords: number;
  admins: number;
}

export const useUserStats = () => {
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats>({
    total: 0,
    tenants: 0,
    agents: 0,
    landlords: 0,
    admins: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  const fetchUserStats = async () => {
    try {
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

      // Fetch recent users
      const { data: recentUsersData, error: recentUsersError } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (recentUsersError) throw recentUsersError;
      setRecentUsers(recentUsersData);

    } catch (error) {
      console.error("Error fetching user stats:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    userStats,
    recentUsers,
    loading,
    fetchUserStats,
  };
};
