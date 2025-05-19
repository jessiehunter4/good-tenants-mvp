
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import DashboardLoader from "@/components/dashboard/DashboardLoader";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import DashboardTabs from "@/components/dashboard/DashboardTabs";

const Dashboard = () => {
  const { user, getUserRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const redirectBasedOnRole = async () => {
      if (!user) return;

      try {
        // Fetch user role
        const role = await getUserRole();
        if (role) {
          // Redirect to role-specific dashboard
          switch (role) {
            case "tenant":
              navigate("/dashboard-tenant");
              break;
            case "agent":
              navigate("/dashboard-agent");
              break;
            case "landlord":
              navigate("/dashboard-landlord");
              break;
            case "admin":
              navigate("/admin-dashboard");
              break;
            default:
              break;
          }
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile data.",
          variant: "destructive",
        });
      }
    };

    redirectBasedOnRole();
  }, [user, toast, navigate, getUserRole]);

  if (!user) {
    return <DashboardLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <WelcomeCard />
        <DashboardTabs />
      </main>
    </div>
  );
};

export default Dashboard;
