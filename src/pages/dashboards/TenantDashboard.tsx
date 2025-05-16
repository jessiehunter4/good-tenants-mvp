
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TenantHeader from "@/components/tenant/TenantHeader";
import ProfileSummary from "@/components/tenant/ProfileSummary";
import InvitationsList from "@/components/tenant/InvitationsList";
import UpgradeSection from "@/components/tenant/UpgradeSection";
import { useTenantData } from "@/hooks/useTenantData";

const TenantDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { profile, invitations, loading, refreshData } = useTenantData();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TenantHeader email={user?.email} onSignOut={signOut} />

      <main className="container mx-auto px-4 py-8">
        {profile && (
          <div className="mb-8">
            <ProfileSummary profile={profile} />
          </div>
        )}

        <Tabs defaultValue="invitations">
          <TabsList className="mb-4">
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
            <TabsTrigger value="upgrade">Upgrade to Pre-Screened</TabsTrigger>
          </TabsList>

          <TabsContent value="invitations">
            <InvitationsList 
              invitations={invitations} 
              onStatusChange={refreshData} 
            />
          </TabsContent>

          <TabsContent value="upgrade">
            <UpgradeSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TenantDashboard;
