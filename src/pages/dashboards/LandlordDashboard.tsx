
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LandlordHeader from "@/components/landlord/LandlordHeader";
import ProfileSummary from "@/components/landlord/ProfileSummary";
import ListingsSection from "@/components/landlord/ListingsSection";
import TenantDirectory from "@/components/landlord/tenant-directory";
import { useLandlordData } from "@/hooks/useLandlordData";

const LandlordDashboard = () => {
  const { 
    user, 
    profile, 
    tenants, 
    listings, 
    loading, 
    searchQuery,
    setSearchQuery,
    handleSendInvite, 
    signOut
  } = useLandlordData();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LandlordHeader email={user?.email} onSignOut={signOut} />

      <main className="container mx-auto px-4 py-8">
        {profile && <div className="mb-8"><ProfileSummary profile={profile} /></div>}

        <Tabs defaultValue="tenants">
          <TabsList className="mb-4">
            <TabsTrigger value="tenants">Find Tenants</TabsTrigger>
            <TabsTrigger value="listings">My Properties</TabsTrigger>
          </TabsList>

          <TabsContent value="tenants">
            <TenantDirectory 
              tenants={tenants}
              profileStatus={profile?.status || 'incomplete'}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSendInvite={handleSendInvite}
            />
          </TabsContent>

          <TabsContent value="listings">
            <ListingsSection listings={listings} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default LandlordDashboard;
