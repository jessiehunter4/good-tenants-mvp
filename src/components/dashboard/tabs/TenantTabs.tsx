
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TenantTabs = () => {
  return (
    <Tabs defaultValue="dashboard">
      <TabsList className="mb-4">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="invitations">Invitations</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Get Pre-Screened</CardTitle>
            <CardDescription>
              Complete pre-screening to receive invitations from agents and landlords.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>Start Pre-Screening</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="invitations">
        <Card>
          <CardHeader>
            <CardTitle>Your Invitations</CardTitle>
            <CardDescription>
              Invitations from agents and landlords will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 text-muted-foreground">
              No invitations yet. Complete your profile to increase your chances.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default TenantTabs;
