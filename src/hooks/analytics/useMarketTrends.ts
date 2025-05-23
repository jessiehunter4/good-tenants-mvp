
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MarketTrendData {
  month: string;
  averagePrice: number;
  medianPrice: number;
  listingCount: number;
}

export const useMarketTrends = () => {
  const [data, setData] = useState<MarketTrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMarketTrends = async () => {
      try {
        setIsLoading(true);
        
        // Generate mock data for now - in production, this would query aggregated market data
        const mockData: MarketTrendData[] = [
          { month: "Jan", averagePrice: 3200, medianPrice: 3000, listingCount: 45 },
          { month: "Feb", averagePrice: 3250, medianPrice: 3100, listingCount: 52 },
          { month: "Mar", averagePrice: 3300, medianPrice: 3150, listingCount: 48 },
          { month: "Apr", averagePrice: 3400, medianPrice: 3200, listingCount: 58 },
          { month: "May", averagePrice: 3500, medianPrice: 3300, listingCount: 62 },
          { month: "Jun", averagePrice: 3600, medianPrice: 3400, listingCount: 55 },
          { month: "Jul", averagePrice: 3650, medianPrice: 3450, listingCount: 59 },
          { month: "Aug", averagePrice: 3700, medianPrice: 3500, listingCount: 61 },
          { month: "Sep", averagePrice: 3750, medianPrice: 3550, listingCount: 57 },
          { month: "Oct", averagePrice: 3800, medianPrice: 3600, listingCount: 53 },
          { month: "Nov", averagePrice: 3850, medianPrice: 3650, listingCount: 49 },
          { month: "Dec", averagePrice: 3900, medianPrice: 3700, listingCount: 46 },
        ];

        setData(mockData);
      } catch (error) {
        console.error("Error fetching market trends:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketTrends();
  }, []);

  return { data, isLoading };
};
