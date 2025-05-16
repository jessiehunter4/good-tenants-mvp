import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { User } from "lucide-react";

interface TenantProfile {
  id: string;
  status: string;
  move_in_date: string | null;
  household_size: number | null;
  household_income: number | null;
  pets: boolean | null;
  preferred_locations: string[] | null;
  bio: string | null;
}

interface Invitation {
  id: string;
  message: string | null;
  status: string | null;
  created_at: string;
  sender: {
    email: string;
    role: string;
  } | null | any; // Changed to accommodate potential error format
  listing: {
    address: string | null;
    city: string | null;
    bedrooms: number | null;
    bathrooms: number | null;
    price: number | null;
  } | null | any; // Changed to accommodate potential error format
}

const profileStatusMap = {
  incomplete: {
    label: "Incomplete",
    progress: 25,
    color: "text-yellow-600 bg-yellow-100",
  },
  basic: {
    label: "Basic",
    progress: 50,
    color: "text-blue-600 bg-blue-100",
  },
  verified: {
    label: "Verified",
    progress: 75,
    color: "text-green-600 bg-green-100",
  },
  premium: {
    label: "Premium",
    progress: 100,
    color: "text-purple-600 bg-purple-100",
  },
};

const TenantDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<TenantProfile | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenantData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch tenant profile
        const { data: profileData, error: profileError } = await supabase
          .from("tenant_profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData as TenantProfile);

        // Fetch invitations
        const { data: invitationsData, error: invitationsError } = await supabase
          .from("invites")
          .select(`
            *,
            sender:users!invites_sender_id_fkey(email, role),
            listing:listings!invites_listing_id_fkey(address, city, bedrooms, bathrooms, price)
          `)
          .eq("tenant_id", user.id)
          .order("created_at", { ascending: false });

        if (invitationsError) throw invitationsError;
        
        // Type casting to handle potential mismatch
        setInvitations(invitationsData as unknown as Invitation[]);
      } catch (error) {
        console.error("Error fetching tenant data:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, [user, toast]);

  const getStatusInfo = (status: string) => {
    return profileStatusMap[status as keyof typeof profileStatusMap] || profileStatusMap.incomplete;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString();
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
                    <CardTitle>Welcome, Tenant</CardTitle>
                    <CardDescription>
                      Your tenant profile is {getStatusInfo(profile.status).label}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusInfo(profile.status).color}>
                    {getStatusInfo(profile.status).label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Profile Completion</span>
                      <span>{getStatusInfo(profile.status).progress}%</span>
                    </div>
                    <Progress value={getStatusInfo(profile.status).progress} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h3 className="font-medium text-gray-700">Move-in Date</h3>
                      <p>{formatDate(profile.move_in_date)}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Household Size</h3>
                      <p>{profile.household_size || 'Not specified'}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Household Income</h3>
                      <p>{profile.household_income ? `$${profile.household_income.toLocaleString()}/month` : 'Not specified'}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Pets</h3>
                      <p>{profile.pets ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate("/onboard-tenant")}>
                  Update Profile
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        <Tabs defaultValue="invitations">
          <TabsList className="mb-4">
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
            <TabsTrigger value="upgrade">Upgrade to Pre-Screened</TabsTrigger>
          </TabsList>

          <TabsContent value="invitations">
            <Card>
              <CardHeader>
                <CardTitle>Your Invitations</CardTitle>
                <CardDescription>
                  Invitations from agents and landlords will appear here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {invitations.length > 0 ? (
                  <div className="space-y-4">
                    {invitations.map((invite) => (
                      <Card key={invite.id}>
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">
                              {invite.listing?.address || 'Address not available'}, {invite.listing?.city || 'City not available'}
                            </CardTitle>
                            <Badge className={
                              invite.status === 'pending' ? 'bg-yellow-500' : 
                              invite.status === 'accepted' ? 'bg-green-500' : 
                              'bg-gray-500'
                            }>
                              {(invite.status || 'pending').charAt(0).toUpperCase() + (invite.status || 'pending').slice(1)}
                            </Badge>
                          </div>
                          <CardDescription>
                            From: {invite.sender?.email || 'Unknown sender'} ({invite.sender?.role || 'unknown role'})
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-sm text-gray-500">Bedrooms</span>
                                <p>{invite.listing?.bedrooms || 'N/A'}</p>
                              </div>
                              <div>
                                <span className="text-sm text-gray-500">Bathrooms</span>
                                <p>{invite.listing?.bathrooms || 'N/A'}</p>
                              </div>
                              <div>
                                <span className="text-sm text-gray-500">Price</span>
                                <p>${invite.listing?.price?.toLocaleString() || 'N/A'}/month</p>
                              </div>
                              <div>
                                <span className="text-sm text-gray-500">Date Received</span>
                                <p>{new Date(invite.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                            {invite.message && (
                              <div className="mt-2 pt-2 border-t border-gray-200">
                                <p className="text-sm text-gray-500">Message:</p>
                                <p className="text-sm">{invite.message}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                          {invite.status === 'pending' && (
                            <>
                              <Button variant="default" className="flex-1">
                                Accept
                              </Button>
                              <Button variant="outline" className="flex-1">
                                Decline
                              </Button>
                            </>
                          )}
                          {invite.status !== 'pending' && (
                            <Button variant="outline" className="flex-1">
                              View Details
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No invitations yet</h3>
                    <p className="text-gray-500">
                      Complete your profile to increase your chances of receiving invitations.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upgrade">
            <Card>
              <CardHeader>
                <CardTitle>Upgrade to Pre-Screened Status</CardTitle>
                <CardDescription>
                  Get pre-screened to receive more invitations from quality landlords and agents.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h3 className="font-medium text-blue-800 mb-2">Benefits of Pre-Screening:</h3>
                    <ul className="space-y-1">
                      <li className="flex items-start">
                        <span className="mr-2 text-blue-500">•</span>
                        <span>Higher visibility to property owners and agents</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-blue-500">•</span>
                        <span>Faster response times for housing applications</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-blue-500">•</span>
                        <span>Priority notifications for new listings that match your criteria</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-blue-500">•</span>
                        <span>Verified tenant badge on your profile</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white border rounded-md p-4">
                    <h3 className="font-medium mb-2">Pre-Screening Requirements:</h3>
                    <ul className="space-y-1">
                      <li className="flex items-start">
                        <span className="mr-2 text-green-500">✓</span>
                        <span>Income verification (pay stubs, W2s, or bank statements)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-green-500">✓</span>
                        <span>Credit check (soft pull, won't affect your score)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-green-500">✓</span>
                        <span>Rental history verification</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-green-500">✓</span>
                        <span>Employment verification</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Start Pre-Screening Process</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TenantDashboard;
