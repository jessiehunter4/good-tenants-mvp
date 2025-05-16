
import { useEffect, useState } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profileStatus, setProfileStatus] = useState<string>("incomplete");
  const [profileProgress, setProfileProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        // Fetch user role
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        if (userError) throw userError;
        if (userData) setUserRole(userData.role);

        // Fetch profile status based on role
        if (userData?.role) {
          let profileTable = "";
          switch (userData.role) {
            case "tenant":
              profileTable = "tenant_profiles";
              break;
            case "agent":
              profileTable = "realtor_profiles";
              break;
            case "landlord":
              profileTable = "landlord_profiles";
              break;
            default:
              break;
          }

          if (profileTable) {
            const { data: profileData, error: profileError } = await supabase
              .from(profileTable as "tenant_profiles" | "realtor_profiles" | "landlord_profiles")
              .select("status")
              .eq("id", user.id)
              .single();

            if (profileError) throw profileError;
            if (profileData && profileData.status) {
              setProfileStatus(profileData.status);
              // Calculate approximate profile completion
              switch (profileData.status) {
                case "incomplete":
                  setProfileProgress(25);
                  break;
                case "basic":
                  setProfileProgress(50);
                  break;
                case "verified":
                  setProfileProgress(75);
                  break;
                case "premium":
                  setProfileProgress(100);
                  break;
                default:
                  setProfileProgress(25);
                  break;
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, toast]);

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
            <span className="text-gray-600">
              {user?.email} ({userRole})
            </span>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Welcome to Good Tenants</CardTitle>
            <CardDescription>
              Complete your profile to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Profile Completion</span>
                  <span>{profileProgress}%</span>
                </div>
                <Progress value={profileProgress} />
              </div>
              <div>
                <p>Current status: <span className="font-medium capitalize">{profileStatus}</span></p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Complete your profile information to improve your visibility and matches.
                </p>
              </div>
              <Button>Complete Profile</Button>
            </div>
          </CardContent>
        </Card>

        {userRole && (
          <Tabs defaultValue="dashboard">
            <TabsList className="mb-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              {userRole === "tenant" && (
                <TabsTrigger value="invitations">Invitations</TabsTrigger>
              )}
              {(userRole === "agent" || userRole === "landlord") && (
                <>
                  <TabsTrigger value="listings">My Listings</TabsTrigger>
                  <TabsTrigger value="tenants">Find Tenants</TabsTrigger>
                </>
              )}
            </TabsList>

            <TabsContent value="dashboard" className="space-y-4">
              {userRole === "tenant" && (
                <>
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
                </>
              )}

              {(userRole === "agent" || userRole === "landlord") && (
                <>
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
                </>
              )}
            </TabsContent>

            {userRole === "tenant" && (
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
            )}

            {(userRole === "agent" || userRole === "landlord") && (
              <>
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
              </>
            )}
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
