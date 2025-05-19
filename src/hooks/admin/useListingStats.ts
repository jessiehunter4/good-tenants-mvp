
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ListingStats {
  total: number;
  active: number;
  inactive: number;
}

export const useListingStats = () => {
  const [loading, setLoading] = useState(true);
  const [listingStats, setListingStats] = useState<ListingStats>({
    total: 0,
    active: 0,
    inactive: 0,
  });

  const fetchListingStats = async () => {
    try {
      const { data: listings, error: listingsError } = await supabase
        .from("listings")
        .select("is_active");
      
      if (listingsError) throw listingsError;
      
      setListingStats({
        total: listings.length,
        active: listings.filter(l => l.is_active).length,
        inactive: listings.filter(l => !l.is_active).length,
      });
    } catch (error) {
      console.error("Error fetching listing stats:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    listingStats,
    loading,
    fetchListingStats,
  };
};
