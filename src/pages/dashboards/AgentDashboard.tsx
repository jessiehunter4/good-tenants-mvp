
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Search, Home, User, Plus } from "lucide-react";

interface RealtorProfile {
  id: string;
  status: string;
  license_number: string | null;
  agency: string | null;
  years_experience: number | null;
}

interface TenantProfile {
  id: string;
  user_email: string;
  status: string;
  move_in_date: string | null;
  household_size: number | null;
  household_income: number | null;
  pets: boolean | null;
  preferred_locations: string[] | null;
  bio: string | null;
}

interface Listing {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  price: number;
  available_date: string;
  is_active: boolean;
}

const AgentDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<RealtorProfile | null>(null);
  const [tenants, setTenants] = useState<TenantProfile[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAgentData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch agent profile
        const { data: profileData, error: profileError } = await supabase
          .from("realtor_profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData as RealtorProfile);

        // Fetch listings
        const { data: listingsData, error: listingsError } = await supabase
          .from("listings")
          .select("*")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false });

        if (listingsError) throw listingsError;
        setListings(listingsData as Listing[]);

        // Only fetch tenant directory if agent is verified
        if (profileData && profileData.status === "verified" || profileData.status === "premium") {
          // Join tenant_profiles with users to get email
          const { data: tenantsData, error: tenantsError } = await supabase
            .from("tenant_profiles")
            .select(`
              *,
              user_email:users(email)
            `)
            .eq("status", "verified")
            .order("created_at", { ascending: false });

          if (tenantsError) throw tenantsError;
          
          // Format tenant data
          const formattedTenants = tenantsData.map((tenant: any) => ({
            ...tenant,
            user_email: tenant.user_email?.email || "No email available"
          }));
          
          setTenants(formattedTenants as TenantProfile[]);
        }
      } catch (error) {
        console.error("Error fetching agent data:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAgentData();
  }, [user, toast]);

  const handleSendInvite = async (tenantId: string) => {
    if (!user || listings.length === 0) {
      toast({
        title: "Cannot send invite",
        description: "You need to add a listing first.",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real app, you would show a modal to select which listing to invite to
      // For now, we'll use the first listing if available
      const listingId = listings[0]?.id;
      
      if (!listingId) {
        toast({
          title: "No listings available",
          description: "Please create a listing first.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("invites")
        .insert({
          tenant_id: tenantId,
          sender_id: user.id,
          listing_id: listingId,
          message: "I'd like to invite you to view this property.",
          status: "pending"
        });

      if (error) throw error;

      toast({
        title: "Invite sent!",
        description: "You have successfully invited this tenant.",
      });
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast({
        title: "Error",
        description: "Failed to send invitation.",
        variant: "destructive",
      });
    }
  };

  const filteredTenants = tenants.filter(tenant => {
    const query = searchQuery.toLowerCase();
    return (
      tenant.user_email?.toLowerCase().includes(query) ||
      tenant.preferred_locations?.some(location => location.toLowerCase().includes(query)) ||
      (tenant.bio && tenant.bio.toLowerCase().includes(query))
    );
  });

  const formattedIncome = (income: number | null) => {
    if (!income) return "Not specified";
    return `$${income.toLocaleString()}/month`;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900">Good Tenants</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.email}</span>
            <Button variant="outline" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {profile && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Welcome, Agent</CardTitle>
                    <CardDescription>
                      {profile.agency ? `${profile.agency}` : "Complete your profile details"}
                    </CardDescription>
                  </div>
                  <Badge className={
                    profile.status === 'verified' || profile.status === 'premium' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }>
                    {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-700">License Number</h3>
                    <p>{profile.license_number || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Agency/Brokerage</h3>
                    <p>{profile.agency || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Years of Experience</h3>
                    <p>{profile.years_experience !== null ? profile.years_experience : 'Not specified'}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate("/onboard-agent")}>
                  Update Profile
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        <Tabs defaultValue="tenants">
          <TabsList className="mb-4">
            <TabsTrigger value="tenants">Find Tenants</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
          </TabsList>

          <TabsContent value="tenants">
            <Card>
              <CardHeader>
                <CardTitle>Tenant Directory</CardTitle>
                <CardDescription>
                  Browse through pre-screened, move-ready tenants.
                </CardDescription>

                <div className="mt-4 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by location, email, or description..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                {profile && (profile.status === "verified" || profile.status === "premium") ? (
                  filteredTenants.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredTenants.map((tenant) => (
                        <Card key={tenant.id} className="overflow-hidden">
                          <CardHeader className="bg-blue-50 pb-3">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center space-x-2">
                                <div className="bg-blue-100 p-2 rounded-full">
                                  <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium">{tenant.user_email}</p>
                                  <p className="text-sm text-gray-500">
                                    Moving: {tenant.move_in_date ? new Date(tenant.move_in_date).toLocaleDateString() : 'Flexible'}
                                  </p>
                                </div>
                              </div>
                              <Badge className="bg-green-100 text-green-800">
                                Verified
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-3">
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <p className="text-sm text-gray-500">Household</p>
                                  <p className="font-medium">{tenant.household_size || 'Not specified'} {tenant.household_size === 1 ? 'person' : 'people'}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Income</p>
                                  <p className="font-medium">{formattedIncome(tenant.household_income)}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Pets</p>
                                  <p className="font-medium">{tenant.pets ? 'Yes' : 'No'}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Preferred Locations</p>
                                  <p className="font-medium truncate">{tenant.preferred_locations?.join(', ') || 'Not specified'}</p>
                                </div>
                              </div>
                              {tenant.bio && (
                                <div>
                                  <p className="text-sm text-gray-500">Bio</p>
                                  <p className="text-sm line-clamp-2">{tenant.bio}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="border-t bg-gray-50">
                            <Button 
                              className="w-full" 
                              onClick={() => handleSendInvite(tenant.id)}
                            >
                              Send Invitation
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <User className="h-6 w-6 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No tenants found</h3>
                      <p className="text-gray-500">
                        No verified tenants match your search criteria.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Verification Required</h3>
                    <p className="text-gray-500 mb-4">
                      You need to be verified to access the tenant directory.
                    </p>
                    <Button>
                      Get Verified
                    </Button>
                  </div>
                )}
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
                {listings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {listings.map((listing) => (
                      <Card key={listing.id}>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{listing.address}</CardTitle>
                              <CardDescription>
                                {listing.city}, {listing.state} {listing.zip}
                              </CardDescription>
                            </div>
                            <Badge className={listing.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100'}>
                              {listing.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-3">
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <p className="text-sm text-gray-500">Bedrooms</p>
                              <p className="font-medium">{listing.bedrooms}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Bathrooms</p>
                              <p className="font-medium">{listing.bathrooms}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Square Feet</p>
                              <p className="font-medium">{listing.square_feet.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Price</p>
                              <p className="font-medium">${listing.price.toLocaleString()}/month</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Available</p>
                              <p className="font-medium">{new Date(listing.available_date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="border-t">
                          <div className="flex w-full gap-2">
                            <Button variant="outline" className="flex-1">
                              Edit
                            </Button>
                            <Button variant="default" className="flex-1">
                              Find Tenants
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Home className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No listings yet</h3>
                    <p className="text-gray-500 mb-4">
                      Add your first property listing to start finding tenants.
                    </p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Listing
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AgentDashboard;
