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
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { User, Briefcase, Building } from "lucide-react";

interface UserStats {
  total: number;
  tenants: number;
  agents: number;
  landlords: number;
  admins: number;
}

interface ProfileStats {
  tenants: {
    incomplete: number;
    basic: number;
    verified: number;
    premium: number;
  };
  agents: {
    incomplete: number;
    basic: number;
    verified: number;
    premium: number;
  };
  landlords: {
    incomplete: number;
    basic: number;
    verified: number;
    premium: number;
  };
}

interface ListingStats {
  total: number;
  active: number;
  inactive: number;
}

interface InviteStats {
  total: number;
  pending: number;
  accepted: number;
  declined: number;
}

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats>({
    total: 0,
    tenants: 0,
    agents: 0,
    landlords: 0,
    admins: 0,
  });
  const [profileStats, setProfileStats] = useState<ProfileStats>({
    tenants: { incomplete: 0, basic: 0, verified: 0, premium: 0 },
    agents: { incomplete: 0, basic: 0, verified: 0, premium: 0 },
    landlords: { incomplete: 0, basic: 0, verified: 0, premium: 0 },
  });
  const [listingStats, setListingStats] = useState<ListingStats>({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [inviteStats, setInviteStats] = useState<InviteStats>({
    total: 0,
    pending: 0,
    accepted: 0,
    declined: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchAdminStats = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Check if user is admin
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        if (userError) throw userError;
        
        if (userData.role !== "admin") {
          toast({
            title: "Access Denied",
            description: "You need admin privileges to view this page.",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        // Fetch user stats
        const { data: users, error: usersError } = await supabase
          .from("users")
          .select("role");

        if (usersError) throw usersError;
        
        // Count users by role
        const userCounts = users.reduce((acc: any, user: any) => {
          acc.total++;
          acc[user.role]++;
          return acc;
        }, { total: 0, tenant: 0, agent: 0, landlord: 0, admin: 0 });

        setUserStats({
          total: userCounts.total,
          tenants: userCounts.tenant,
          agents: userCounts.agent,
          landlords: userCounts.landlord,
          admins: userCounts.admin,
        });

        // Fetch profile stats
        const fetchProfileStats = async (table: "tenant_profiles" | "realtor_profiles" | "landlord_profiles", role: keyof ProfileStats) => {
          const { data, error } = await supabase
            .from(table)
            .select("status");
          
          if (error) throw error;
          
          const counts = data.reduce((acc: any, profile: any) => {
            acc[profile.status]++;
            return acc;
          }, { incomplete: 0, basic: 0, verified: 0, premium: 0 });
          
          return counts;
        };

        const tenantProfileStats = await fetchProfileStats("tenant_profiles", "tenants");
        const agentProfileStats = await fetchProfileStats("realtor_profiles", "agents");
        const landlordProfileStats = await fetchProfileStats("landlord_profiles", "landlords");

        setProfileStats({
          tenants: tenantProfileStats,
          agents: agentProfileStats,
          landlords: landlordProfileStats,
        });

        // Fetch listing stats
        const { data: listings, error: listingsError } = await supabase
          .from("listings")
          .select("is_active");
        
        if (listingsError) throw listingsError;
        
        setListingStats({
          total: listings.length,
          active: listings.filter(l => l.is_active).length,
          inactive: listings.filter(l => !l.is_active).length,
        });

        // Fetch invite stats
        const { data: invites, error: invitesError } = await supabase
          .from("invites")
          .select("status");
        
        if (invitesError) throw invitesError;
        
        const inviteCounts = invites.reduce((acc: any, invite: any) => {
          acc.total++;
          acc[invite.status]++;
          return acc;
        }, { total: 0, pending: 0, accepted: 0, declined: 0 });

        setInviteStats(inviteCounts);

        // Fetch recent users
        const { data: recentUsersData, error: recentUsersError } = await supabase
          .from("users")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);
        
        if (recentUsersError) throw recentUsersError;
        setRecentUsers(recentUsersData);

      } catch (error) {
        console.error("Error fetching admin stats:", error);
        toast({
          title: "Error",
          description: "Failed to load admin data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, [user, toast, navigate]);

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
          <h1 className="text-2xl font-bold text-blue-900">Good Tenants Admin</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.email} (Admin)</span>
            <Button variant="outline" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{userStats.total}</div>
              <div className="flex flex-col mt-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Tenants:</span>
                  <span className="font-medium">{userStats.tenants}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Agents:</span>
                  <span className="font-medium">{userStats.agents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Landlords:</span>
                  <span className="font-medium">{userStats.landlords}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Admins:</span>
                  <span className="font-medium">{userStats.admins}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Tenant Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Object.values(profileStats.tenants).reduce((a, b) => a + b, 0)}
              </div>
              <div className="flex flex-col mt-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Incomplete:</span>
                  <span className="font-medium">{profileStats.tenants.incomplete}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Basic:</span>
                  <span className="font-medium">{profileStats.tenants.basic}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Verified:</span>
                  <span className="font-medium">{profileStats.tenants.verified}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Premium:</span>
                  <span className="font-medium">{profileStats.tenants.premium}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{listingStats.total}</div>
              <div className="flex flex-col mt-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Active:</span>
                  <span className="font-medium">{listingStats.active}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Inactive:</span>
                  <span className="font-medium">{listingStats.inactive}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Invitations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{inviteStats.total}</div>
              <div className="flex flex-col mt-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Pending:</span>
                  <span className="font-medium">{inviteStats.pending}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Accepted:</span>
                  <span className="font-medium">{inviteStats.accepted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Declined:</span>
                  <span className="font-medium">{inviteStats.declined}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="mb-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="profiles">Profiles</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>
                  Recently registered users across all roles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-3 text-left">Email</th>
                        <th className="px-6 py-3 text-left">Role</th>
                        <th className="px-6 py-3 text-left">Created</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Badge className={
                              user.role === 'tenant' ? 'bg-blue-100 text-blue-800' :
                              user.role === 'agent' ? 'bg-green-100 text-green-800' :
                              user.role === 'landlord' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profiles">
            <Card>
              <CardHeader>
                <CardTitle>Profile Statistics</CardTitle>
                <CardDescription>
                  Breakdown of profile completion across user types.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <CardTitle className="text-lg">Tenant Profiles</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Incomplete</span>
                            <span className="font-medium">{profileStats.tenants.incomplete}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-400" 
                              style={{ width: `${profileStats.tenants.incomplete * 100 / (Object.values(profileStats.tenants).reduce((a, b) => a + b, 0) || 1)}%` }} 
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Basic</span>
                            <span className="font-medium">{profileStats.tenants.basic}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-400" 
                              style={{ width: `${profileStats.tenants.basic * 100 / (Object.values(profileStats.tenants).reduce((a, b) => a + b, 0) || 1)}%` }} 
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Verified</span>
                            <span className="font-medium">{profileStats.tenants.verified}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-400" 
                              style={{ width: `${profileStats.tenants.verified * 100 / (Object.values(profileStats.tenants).reduce((a, b) => a + b, 0) || 1)}%` }} 
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Premium</span>
                            <span className="font-medium">{profileStats.tenants.premium}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-400" 
                              style={{ width: `${profileStats.tenants.premium * 100 / (Object.values(profileStats.tenants).reduce((a, b) => a + b, 0) || 1)}%` }} 
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-5 w-5" />
                        <CardTitle className="text-lg">Agent Profiles</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Incomplete</span>
                            <span className="font-medium">{profileStats.agents.incomplete}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-400" 
                              style={{ width: `${profileStats.agents.incomplete * 100 / (Object.values(profileStats.agents).reduce((a, b) => a + b, 0) || 1)}%` }} 
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Basic</span>
                            <span className="font-medium">{profileStats.agents.basic}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-400" 
                              style={{ width: `${profileStats.agents.basic * 100 / (Object.values(profileStats.agents).reduce((a, b) => a + b, 0) || 1)}%` }} 
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Verified</span>
                            <span className="font-medium">{profileStats.agents.verified}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-400" 
                              style={{ width: `${profileStats.agents.verified * 100 / (Object.values(profileStats.agents).reduce((a, b) => a + b, 0) || 1)}%` }} 
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Premium</span>
                            <span className="font-medium">{profileStats.agents.premium}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-400" 
                              style={{ width: `${profileStats.agents.premium * 100 / (Object.values(profileStats.agents).reduce((a, b) => a + b, 0) || 1)}%` }} 
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-2">
                        <Building className="h-5 w-5" />
                        <CardTitle className="text-lg">Landlord Profiles</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Incomplete</span>
                            <span className="font-medium">{profileStats.landlords.incomplete}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-400" 
                              style={{ width: `${profileStats.landlords.incomplete * 100 / (Object.values(profileStats.landlords).reduce((a, b) => a + b, 0) || 1)}%` }} 
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Basic</span>
                            <span className="font-medium">{profileStats.landlords.basic}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-400" 
                              style={{ width: `${profileStats.landlords.basic * 100 / (Object.values(profileStats.landlords).reduce((a, b) => a + b, 0) || 1)}%` }} 
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Verified</span>
                            <span className="font-medium">{profileStats.landlords.verified}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-400" 
                              style={{ width: `${profileStats.landlords.verified * 100 / (Object.values(profileStats.landlords).reduce((a, b) => a + b, 0) || 1)}%` }} 
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Premium</span>
                            <span className="font-medium">{profileStats.landlords.premium}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-400" 
                              style={{ width: `${profileStats.landlords.premium * 100 / (Object.values(profileStats.landlords).reduce((a, b) => a + b, 0) || 1)}%` }} 
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings">
            <Card>
              <CardHeader>
                <CardTitle>Listing Statistics</CardTitle>
                <CardDescription>
                  Overview of property listings in the system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8">
                  <p>Detailed listing management coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="invitations">
            <Card>
              <CardHeader>
                <CardTitle>Invitation Statistics</CardTitle>
                <CardDescription>
                  Track invitations between users and their responses.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8">
                  <p>Detailed invitation tracking coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
