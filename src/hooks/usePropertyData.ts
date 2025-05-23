
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Listing } from "@/types/listings";

export const usePropertyData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      setLoading(true);
      
      // Fetch all active listings with owner information
      const { data: listingsData, error } = await supabase
        .from("listings")
        .select(`
          *,
          owner:users!listings_owner_id_fkey(email, role)
        `)
        .eq("is_active", true)
        .eq("listing_status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setListings(listingsData as Listing[]);
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast({
        title: "Error",
        description: "Failed to load property listings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const expressInterest = async (listingId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to express interest in properties.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Find the listing to get the owner
      const listing = listings.find(l => l.id === listingId);
      if (!listing) return;

      // Create an invitation record
      const { error } = await supabase
        .from("invites")
        .insert({
          tenant_id: user.id,
          sender_id: listing.owner_id,
          listing_id: listingId,
          message: `Tenant has expressed interest in your property at ${listing.address}`,
          status: "pending"
        });

      if (error) throw error;

      toast({
        title: "Interest Expressed",
        description: "Your interest has been sent to the property owner.",
      });
    } catch (error) {
      console.error("Error expressing interest:", error);
      toast({
        title: "Error",
        description: "Failed to express interest. Please try again.",
        variant: "destructive",
      });
    }
  };

  const requestShowing = async (listingId: string, date: Date, time: string, message: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to request showings.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("property_showings")
        .insert({
          tenant_id: user.id,
          listing_id: listingId,
          requested_date: date.toISOString().split('T')[0],
          requested_time: time,
          message: message || null,
          status: "pending"
        });

      if (error) throw error;

      toast({
        title: "Showing Requested",
        description: "Your showing request has been sent to the property owner.",
      });
    } catch (error) {
      console.error("Error requesting showing:", error);
      toast({
        title: "Error",
        description: "Failed to request showing. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return {
    listings,
    loading,
    expressInterest,
    requestShowing,
    refreshListings: fetchListings
  };
};
