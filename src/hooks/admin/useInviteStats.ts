
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface InviteStats {
  total: number;
  pending: number;
  accepted: number;
  declined: number;
}

export const useInviteStats = () => {
  const [loading, setLoading] = useState(true);
  const [inviteStats, setInviteStats] = useState<InviteStats>({
    total: 0,
    pending: 0,
    accepted: 0,
    declined: 0,
  });

  const fetchInviteStats = async () => {
    try {
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
    } catch (error) {
      console.error("Error fetching invite stats:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    inviteStats,
    loading,
    fetchInviteStats,
  };
};
