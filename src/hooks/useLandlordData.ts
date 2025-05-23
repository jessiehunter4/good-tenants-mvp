
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { LandlordProfile, TenantProfile } from "@/types/profiles";
import { Listing } from "@/types/listings";
import { filterTenantsByQuery } from "@/utils/filters/tenantFilters";
import { sendInviteToTenant } from "@/utils/invitations/inviteService";

// Re-export types for backward compatibility
export type { LandlordProfile, TenantProfile, Listing };

export const useLandlordData = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<LandlordProfile | null>(null);
  const [tenants, setTenants] = useState<TenantProfile[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchLandlordData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch landlord profile
        const { data: profileData, error: profileError } = await supabase
          .from("landlord_profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData as LandlordProfile);

        // Fetch listings
        const { data: listingsData, error: listingsError } = await supabase
          .from("listings")
          .select("*")
          .eq("owner_id", user.id);

        if (listingsError) throw listingsError;
        setListings(listingsData as Listing[]);

        // Only fetch tenant directory if landlord is verified
        if (profileData && (profileData.status === "verified" || profileData.status === "premium")) {
          // Join tenant_profiles with users to get email
          // Updated query to include both verified and pre-screened tenants
          const { data: tenantsData, error: tenantsError } = await supabase
            .from("tenant_profiles")
            .select(`
              *,
              user_email:users(email)
            `)
            .or('status.eq.verified,is_pre_screened.eq.true');

          if (tenantsError) throw tenantsError;
          
          // Format tenant data
          const formattedTenants = tenantsData.map((tenant: any) => ({
            ...tenant,
            user_email: tenant.user_email?.email || "No email available"
          }));
          
          setTenants(formattedTenants as TenantProfile[]);
        }
      } catch (error) {
        console.error("Error fetching landlord data:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLandlordData();
  }, [user, toast]);

  // Handle sending invitation to tenant with property and message
  const handleSendInvite = async (tenantId: string, propertyId: string, message: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to send invitations.",
        variant: "destructive",
      });
      return;
    }

    if (!propertyId) {
      toast({
        title: "Property required",
        description: "Please select a property to invite the tenant to.",
        variant: "destructive",
      });
      return;
    }

    await sendInviteToTenant(tenantId, user.id, propertyId, toast);
  };

  // Filter tenants based on search query
  const filteredTenants = filterTenantsByQuery(tenants, searchQuery);

  return {
    user,
    profile,
    tenants: filteredTenants,
    listings,
    loading,
    searchQuery,
    setSearchQuery,
    handleSendInvite,
    signOut
  };
};
