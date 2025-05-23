
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity, Clock } from "lucide-react";
import { useMarketMetrics } from "@/hooks/analytics/useMarketMetrics";

interface PriceAnalyticsCardProps {
  type: "average-rent" | "price-change" | "market-activity" | "time-on-market";
}

const PriceAnalyticsCard = ({ type }: PriceAnalyticsCardProps) => {
  const { data: metrics, isLoading } = useMarketMetrics();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getCardContent = () => {
    switch (type) {
      case "average-rent":
        return {
          title: "Average Rent",
          value: `$${metrics?.averageRent?.toLocaleString() || 0}`,
          description: "Monthly rental price",
          icon: Activity,
          trend: metrics?.rentChange || 0,
        };
      case "price-change":
        return {
          title: "Price Change",
          value: `${metrics?.priceChange >= 0 ? '+' : ''}${metrics?.priceChange || 0}%`,
          description: "From last month",
          icon: metrics?.priceChange >= 0 ? TrendingUp : TrendingDown,
          trend: metrics?.priceChange || 0,
        };
      case "market-activity":
        return {
          title: "Active Listings",
          value: metrics?.activeListings?.toLocaleString() || "0",
          description: "Properties available",
          icon: Activity,
          trend: metrics?.listingChange || 0,
        };
      case "time-on-market":
        return {
          title: "Avg. Time on Market",
          value: `${metrics?.avgTimeOnMarket || 0} days`,
          description: "Until rented",
          icon: Clock,
          trend: metrics?.timeChange || 0,
        };
      default:
        return {
          title: "Metric",
          value: "N/A",
          description: "No data",
          icon: Activity,
          trend: 0,
        };
    }
  };

  const content = getCardContent();
  const Icon = content.icon;
  const isPositive = content.trend >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{content.title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{content.value}</div>
        <p className="text-xs text-muted-foreground flex items-center mt-1">
          {content.trend !== 0 && (
            <>
              {isPositive ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              <span className={isPositive ? "text-green-500" : "text-red-500"}>
                {Math.abs(content.trend)}%
              </span>
              <span className="ml-1">{content.description}</span>
            </>
          )}
          {content.trend === 0 && content.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default PriceAnalyticsCard;
