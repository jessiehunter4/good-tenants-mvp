
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MarketTrendsChart from "@/components/analytics/MarketTrendsChart";
import PriceAnalyticsCard from "@/components/analytics/PriceAnalyticsCard";
import MarketInsightsGrid from "@/components/analytics/MarketInsightsGrid";
import PropertyDemandChart from "@/components/analytics/PropertyDemandChart";
import { useAuth } from "@/contexts/AuthContext";

const MarketAnalytics = () => {
  const { getUserRole } = useAuth();
  const [userRole, setUserRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUserRole = async () => {
      const role = await getUserRole();
      setUserRole(role);
    };
    fetchUserRole();
  }, [getUserRole]);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Market Intelligence</h1>
        <p className="text-muted-foreground">
          Real-time market insights and analytics for informed decisions
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Market Overview</TabsTrigger>
          <TabsTrigger value="trends">Price Trends</TabsTrigger>
          <TabsTrigger value="demand">Demand Analysis</TabsTrigger>
          <TabsTrigger value="insights">Market Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <PriceAnalyticsCard type="average-rent" />
            <PriceAnalyticsCard type="price-change" />
            <PriceAnalyticsCard type="market-activity" />
            <PriceAnalyticsCard type="time-on-market" />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <MarketTrendsChart />
            <PropertyDemandChart />
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Price Trend Analysis</CardTitle>
              <CardDescription>
                Historical and projected rental prices by location and property type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MarketTrendsChart detailed />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demand" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Demand Analysis</CardTitle>
              <CardDescription>
                Tenant demand patterns and property competition metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PropertyDemandChart detailed />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <MarketInsightsGrid userRole={userRole} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketAnalytics;
