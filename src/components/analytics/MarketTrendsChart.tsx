
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useMarketTrends } from "@/hooks/analytics/useMarketTrends";

interface MarketTrendsChartProps {
  detailed?: boolean;
}

const MarketTrendsChart = ({ detailed = false }: MarketTrendsChartProps) => {
  const { data: trendsData, isLoading } = useMarketTrends();

  const chartConfig = {
    averagePrice: {
      label: "Average Rent",
      color: "hsl(var(--chart-1))",
    },
    medianPrice: {
      label: "Median Rent",
      color: "hsl(var(--chart-2))",
    },
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">Loading market data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Trends</CardTitle>
        <CardDescription>
          {detailed ? "Detailed price trends over time" : "Average rental prices over the last 12 months"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="averagePrice"
                stroke="var(--color-averagePrice)"
                strokeWidth={2}
                dot={{ fill: "var(--color-averagePrice)" }}
              />
              {detailed && (
                <Line
                  type="monotone"
                  dataKey="medianPrice"
                  stroke="var(--color-medianPrice)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-medianPrice)" }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MarketTrendsChart;
