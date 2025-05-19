
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TenantTabs from "./tabs/TenantTabs";
import AgentLandlordTabs from "./tabs/AgentLandlordTabs";

const DashboardTabs = () => {
  const { getUserRole } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await getUserRole();
      setUserRole(role);
    };

    fetchUserRole();
  }, [getUserRole]);

  if (!userRole) {
    return null;
  }

  return (
    <>
      {userRole === "tenant" && <TenantTabs />}
      {(userRole === "agent" || userRole === "landlord") && <AgentLandlordTabs userRole={userRole} />}
    </>
  );
};

export default DashboardTabs;
