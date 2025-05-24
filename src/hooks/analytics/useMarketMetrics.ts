
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
  averageCapRate: number;
  averageCashFlow: number;
  roiBenchmarks: {
    excellent: number;
    good: number;
    fair: number;
  };
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

        // Calculate ROI benchmarks based on market data
        const averageCapRate = 7.2; // Mock: typical cap rate for the market
        const averageCashFlow = averageRent * 0.12; // Mock: 12% of rent as average cash flow

        const metrics: MarketMetrics = {
          averageRent: Math.round(averageRent),
          priceChange: 2.3,
          rentChange: 1.8,
          activeListings: activeListings || 0,
          listingChange: 5.2,
          avgTimeOnMarket: 18,
          timeChange: -3.1,
          averageCapRate,
          averageCashFlow,
          roiBenchmarks: {
            excellent: 12, // 12%+ cap rate considered excellent
            good: 8,      // 8-12% cap rate considered good
            fair: 6,      // 6-8% cap rate considered fair
          },
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
