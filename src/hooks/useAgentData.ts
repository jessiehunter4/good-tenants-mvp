
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface RealtorProfile {
  id: string;
  status: string;
  license_number: string | null;
  agency: string | null;
  years_experience: number | null;
}

export interface Listing {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  price: number;
  available_date: string;
  is_active: boolean;
}

export interface TenantProfile {
  id: string;
  user_email: string;
  status: string;
  move_in_date: string | null;
  household_size: number | null;
  household_income: number | null;
  pets: boolean | null;
  preferred_locations: string[] | null;
  bio: string | null;
}

export const useAgentData = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<RealtorProfile | null>(null);
  const [tenants, setTenants] = useState<TenantProfile[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgentData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch agent profile
        const { data: profileData, error: profileError } = await supabase
          .from("realtor_profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData as RealtorProfile);

        // Fetch listings
        const { data: listingsData, error: listingsError } = await supabase
          .from("listings")
          .select("*")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false });

        if (listingsError) throw listingsError;
        setListings(listingsData as Listing[]);

        // Only fetch tenant directory if agent is verified
        if (profileData && (profileData.status === "verified" || profileData.status === "premium")) {
          // Join tenant_profiles with users to get email
          const { data: tenantsData, error: tenantsError } = await supabase
            .from("tenant_profiles")
            .select(`
              *,
              user_email:users(email)
            `)
            .eq("status", "verified")
            .order("created_at", { ascending: false });

          if (tenantsError) throw tenantsError;
          
          // Format tenant data
          const formattedTenants = tenantsData.map((tenant: any) => ({
            ...tenant,
            user_email: tenant.user_email?.email || "No email available"
          }));
          
          setTenants(formattedTenants as TenantProfile[]);
        }
      } catch (error) {
        console.error("Error fetching agent data:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAgentData();
  }, [user, toast]);

  const sendInvite = async (tenantId: string) => {
    if (!user || listings.length === 0) {
      toast({
        title: "Cannot send invite",
        description: "You need to add a listing first.",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real app, you would show a modal to select which listing to invite to
      // For now, we'll use the first listing if available
      const listingId = listings[0]?.id;
      
      if (!listingId) {
        toast({
          title: "No listings available",
          description: "Please create a listing first.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("invites")
        .insert({
          tenant_id: tenantId,
          sender_id: user.id,
          listing_id: listingId,
          message: "I'd like to invite you to view this property.",
          status: "pending"
        });

      if (error) throw error;

      toast({
        title: "Invite sent!",
        description: "You have successfully invited this tenant.",
      });
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast({
        title: "Error",
        description: "Failed to send invitation.",
        variant: "destructive",
      });
    }
  };

  return {
    user,
    profile,
    tenants,
    listings,
    loading,
    signOut,
    sendInvite
  };
};
