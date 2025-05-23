
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PropertyDemandData {
  propertyType: string;
  demand: number;
  supply: number;
  ratio: number;
}

export const usePropertyDemand = () => {
  const [data, setData] = useState<PropertyDemandData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyDemand = async () => {
      try {
        setIsLoading(true);
        
        // Get supply data from listings
        const { data: listingsData } = await supabase
          .from("listings")
          .select("property_type")
          .eq("is_active", true);

        // Get demand data from tenant profiles
        const { data: tenantsData } = await supabase
          .from("tenant_profiles")
          .select("desired_property_types")
          .not("desired_property_types", "is", null);

        // Calculate supply by property type
        const supplyByType: Record<string, number> = {};
        listingsData?.forEach(listing => {
          if (listing.property_type) {
            supplyByType[listing.property_type] = (supplyByType[listing.property_type] || 0) + 1;
          }
        });

        // Calculate demand by property type
        const demandByType: Record<string, number> = {};
        tenantsData?.forEach(tenant => {
          if (tenant.desired_property_types) {
            tenant.desired_property_types.forEach((type: string) => {
              demandByType[type] = (demandByType[type] || 0) + 1;
            });
          }
        });

        // Combine and format data
        const propertyTypes = ["house", "townhouse_condo", "apartment"];
        const demandData: PropertyDemandData[] = propertyTypes.map(type => {
          const supply = supplyByType[type] || 0;
          const demand = demandByType[type] || 0;
          return {
            propertyType: type.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase()),
            demand,
            supply,
            ratio: supply > 0 ? demand / supply : 0,
          };
        });

        setData(demandData);
      } catch (error) {
        console.error("Error fetching property demand:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyDemand();
  }, []);

  return { data, isLoading };
};
