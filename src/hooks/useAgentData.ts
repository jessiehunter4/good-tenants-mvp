
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
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter tenants based on search query
  const filteredTenants = tenants.filter(tenant => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      tenant.user_email?.toLowerCase().includes(query) ||
      tenant.preferred_locations?.some(location => location.toLowerCase().includes(query)) ||
      (tenant.bio && tenant.bio.toLowerCase().includes(query))
    );
  });

  // Function to trigger Make.com webhook
  const triggerWebhook = async (payload: any) => {
    try {
      const webhookUrl = "https://hook.make.com/example-webhook-id";
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        mode: "no-cors", // Handle CORS issues
      });
      
      console.log("Webhook triggered successfully");
      return true;
    } catch (error) {
      console.error("Error triggering webhook:", error);
      return false;
    }
  };

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

      // 1. Create invite record in the database
      const { data: invite, error } = await supabase
        .from("invites")
        .insert({
          tenant_id: tenantId,
          sender_id: user.id,
          listing_id: listingId,
          message: "I'd like to invite you to view this property.",
          status: "pending"
        })
        .select('id')
        .single();

      if (error) throw error;
      
      // 2. Trigger Make.com webhook with required payload
      const webhookPayload = {
        tenant_id: tenantId,
        sender_id: user.id,
        listing_id: listingId,
        timestamp: new Date().toISOString()
      };
      
      await triggerWebhook(webhookPayload);

      toast({
        title: "Invitation sent!",
        description: "We'll notify the tenant right away.",
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
    tenants: filteredTenants,
    listings,
    loading,
    searchQuery,
    setSearchQuery,
    sendInvite,
    signOut
  };
};
