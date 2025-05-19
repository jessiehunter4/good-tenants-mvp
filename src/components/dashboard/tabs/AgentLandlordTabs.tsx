
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AgentLandlordTabsProps {
  userRole: string;
}

const AgentLandlordTabs = ({ userRole }: AgentLandlordTabsProps) => {
  return (
    <Tabs defaultValue="dashboard">
      <TabsList className="mb-4">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="listings">My Listings</TabsTrigger>
        <TabsTrigger value="tenants">Find Tenants</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Add Your First Listing</CardTitle>
            <CardDescription>
              Create a property listing to start finding tenants.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>Create Listing</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="listings">
        <Card>
          <CardHeader>
            <CardTitle>Your Listings</CardTitle>
            <CardDescription>
              Manage your property listings here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 text-muted-foreground">
              You haven't created any listings yet.
            </p>
            <div className="flex justify-center">
              <Button>Add Listing</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="tenants">
        <Card>
          <CardHeader>
            <CardTitle>Find Tenants</CardTitle>
            <CardDescription>
              Search through pre-screened, move-ready tenants.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 text-muted-foreground">
              You need to be verified to access the tenant directory.
            </p>
            <div className="flex justify-center">
              <Button>Get Verified</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AgentLandlordTabs;
