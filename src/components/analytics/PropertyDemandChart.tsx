
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { usePropertyDemand } from "@/hooks/analytics/usePropertyDemand";

interface PropertyDemandChartProps {
  detailed?: boolean;
}

const PropertyDemandChart = ({ detailed = false }: PropertyDemandChartProps) => {
  const { data: demandData, isLoading } = usePropertyDemand();

  const chartConfig = {
    demand: {
      label: "Tenant Interest",
      color: "hsl(var(--chart-3))",
    },
    supply: {
      label: "Available Properties",
      color: "hsl(var(--chart-4))",
    },
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Property Demand</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">Loading demand data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Demand Analysis</CardTitle>
        <CardDescription>
          {detailed ? "Detailed demand vs supply analysis" : "Tenant interest vs available properties"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={demandData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="propertyType" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="demand"
                fill="var(--color-demand)"
                radius={[4, 4, 0, 0]}
              />
              {detailed && (
                <Bar
                  dataKey="supply"
                  fill="var(--color-supply)"
                  radius={[4, 4, 0, 0]}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PropertyDemandChart;
