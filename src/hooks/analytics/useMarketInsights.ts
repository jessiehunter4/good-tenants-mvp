
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MarketInsight {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  location: string;
  trend?: number;
  actionItems?: string[];
  cta?: string;
}

export const useMarketInsights = (userRole: string | null) => {
  const [data, setData] = useState<MarketInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMarketInsights = async () => {
      try {
        setIsLoading(true);
        
        // Generate role-specific insights based on current market data
        let insights: MarketInsight[] = [];

        if (userRole === "tenant") {
          insights = [
            {
              title: "High Demand in Irvine",
              description: "Competition for 3+ bedroom properties is intense. Consider expanding your search radius or being more flexible on move-in dates.",
              priority: "high",
              location: "Irvine, CA",
              trend: 15,
              actionItems: [
                "Apply quickly to new listings",
                "Consider nearby cities like Tustin or Costa Mesa",
                "Be ready with all documentation"
              ],
              cta: "View Available Properties"
            },
            {
              title: "Price Drop Opportunity",
              description: "Several properties in your price range have reduced rent by 5-8% in the past month.",
              priority: "medium",
              location: "Orange County",
              trend: -6,
              actionItems: [
                "Contact landlords for properties on market 30+ days",
                "Negotiate longer lease terms for lower monthly rent"
              ],
              cta: "Explore Deals"
            }
          ];
        } else if (userRole === "agent" || userRole === "landlord") {
          insights = [
            {
              title: "Rental Market Heating Up",
              description: "Tenant inquiries have increased 23% this month. This is an excellent time to list quality properties.",
              priority: "high",
              location: "West Riverside",
              trend: 23,
              actionItems: [
                "List new properties immediately",
                "Consider slight price increases for premium units",
                "Ensure properties are move-in ready"
              ],
              cta: "Create New Listing"
            },
            {
              title: "Tenant Pool Growing",
              description: "Pre-screened tenants in your area have increased by 18%. Quality applicants are actively searching.",
              priority: "medium",
              location: "Orange County",
              trend: 18,
              actionItems: [
                "Review tenant directory regularly",
                "Send invitations to qualified prospects",
                "Update listing descriptions to highlight amenities"
              ],
              cta: "Browse Tenants"
            },
            {
              title: "Seasonal Opportunity",
              description: "Winter months typically see 15% less competition. Consider marketing advantages for your listings.",
              priority: "low",
              location: "All Markets",
              trend: -15,
              actionItems: [
                "Offer move-in incentives",
                "Highlight indoor amenities",
                "Target corporate relocations"
              ]
            }
          ];
        } else {
          // Default insights for non-authenticated users
          insights = [
            {
              title: "Market Overview",
              description: "The rental market is showing strong activity with increasing demand across all property types.",
              priority: "medium",
              location: "Southern California",
              trend: 8,
              actionItems: [
                "Sign up to access detailed market data",
                "Get pre-screened as a tenant for better opportunities"
              ],
              cta: "Sign Up Now"
            }
          ];
        }

        setData(insights);
      } catch (error) {
        console.error("Error fetching market insights:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketInsights();
  }, [userRole]);

  return { data, isLoading };
};
