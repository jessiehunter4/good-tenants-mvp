
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MarketMetrics {
  averageRent: number;
  priceChange: number;
  rentChange: number;
  activeListings: number;
  listingChange: number;
  avgTimeOnMarket: number;
  timeChange: number;
}

export const useMarketMetrics = () => {
  const [data, setData] = useState<MarketMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMarketMetrics = async () => {
      try {
        setIsLoading(true);
        
        // Get active listings count
        const { count: activeListings } = await supabase
          .from("listings")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true);

        // Get average price from active listings
        const { data: priceData } = await supabase
          .from("listings")
          .select("price")
          .eq("is_active", true)
          .not("price", "is", null);

        const averageRent = priceData && priceData.length > 0
          ? priceData.reduce((sum, listing) => sum + (listing.price || 0), 0) / priceData.length
          : 0;

        // Mock calculated metrics - in production, these would come from historical data analysis
        const metrics: MarketMetrics = {
          averageRent: Math.round(averageRent),
          priceChange: 2.3, // Mock: 2.3% increase from last month
          rentChange: 1.8, // Mock: 1.8% increase in rental prices
          activeListings: activeListings || 0,
          listingChange: 5.2, // Mock: 5.2% more listings than last month
          avgTimeOnMarket: 18, // Mock: 18 days average
          timeChange: -3.1, // Mock: 3.1% faster than last month
        };

        setData(metrics);
      } catch (error) {
        console.error("Error fetching market metrics:", error);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketMetrics();
  }, []);

  return { data, isLoading };
};
