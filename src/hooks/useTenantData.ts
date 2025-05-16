
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export interface TenantProfile {
  id: string;
  status: string;
  move_in_date: string | null;
  household_size: number | null;
  household_income: number | null;
  pets: boolean | null;
  preferred_locations: string[] | null;
  bio: string | null;
}

export interface Invitation {
  id: string;
  message: string | null;
  status: string | null;
  created_at: string;
  sender: {
    email: string;
    role: string;
  } | null;
  listing: {
    address: string | null;
    city: string | null;
    bedrooms: number | null;
    bathrooms: number | null;
    price: number | null;
  } | null;
}

export const useTenantData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<TenantProfile | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTenantData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch tenant profile
      const { data: profileData, error: profileError } = await supabase
        .from("tenant_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData as TenantProfile);

      // Fetch invitations with proper joins
      const { data: invitationsData, error: invitationsError } = await supabase
        .from("invites")
        .select(`
          *,
          sender:users!invites_sender_id_fkey(email, role),
          listing:listings!invites_listing_id_fkey(address, city, bedrooms, bathrooms, price)
        `)
        .eq("tenant_id", user.id)
        .order("created_at", { ascending: false });

      if (invitationsError) throw invitationsError;
      
      // Process invitations data to ensure it matches the expected format
      const processedInvitations = invitationsData.map((invite: any) => ({
        ...invite,
        sender: invite.sender || { email: 'Unknown', role: 'unknown' },
        listing: invite.listing || { address: 'Unknown', city: 'Unknown', bedrooms: null, bathrooms: null, price: null }
      }));
      
      setInvitations(processedInvitations as Invitation[]);
    } catch (error) {
      console.error("Error fetching tenant data:", error);
      toast({
        title: "Error",
        description: "Failed to load your profile data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenantData();
  }, [user, toast]);

  return {
    profile,
    invitations,
    loading,
    refreshData: fetchTenantData
  };
};
