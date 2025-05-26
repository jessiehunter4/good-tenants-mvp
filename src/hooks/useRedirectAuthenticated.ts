
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useRedirectAuthenticated = () => {
  const { user, getUserRole } = useAuth();
  const navigate = useNavigate();

  // Check if a user should be redirected to onboarding based on their role and profile status
  const checkAndRedirectToOnboarding = async (userId: string, userRole: string) => {
    try {
      let profileTable = "";
      
      switch (userRole) {
        case "tenant":
          profileTable = "tenant_profiles";
          break;
        case "agent":
          profileTable = "realtor_profiles";
          break;
        case "landlord":
          profileTable = "landlord_profiles";
          break;
        case "admin":
          navigate("/admin-dashboard");
          return;
        default:
          break;
      }

      if (profileTable) {
        const { data: profileData, error } = await supabase
          .from(profileTable as "tenant_profiles" | "realtor_profiles" | "landlord_profiles")
          .select("status")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          // If there's an error, default to sending to onboarding
          navigateToOnboarding(userRole);
          return;
        }

        // If profile exists and status is not 'incomplete', redirect to dashboard
        if (profileData && profileData.status && profileData.status !== "incomplete") {
          navigate(`/dashboard-${userRole}`);
        } else {
          // If profile doesn't exist or is incomplete, redirect to onboarding
          navigateToOnboarding(userRole);
        }
      } else {
        // Default to dashboard if no specific role handling
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error in redirect logic:", error);
      navigate("/dashboard"); // Default fallback
    }
  };

  // Navigate to the appropriate onboarding page
  const navigateToOnboarding = (role: string) => {
    switch (role) {
      case "tenant":
        navigate("/onboard-tenant");
        break;
      case "agent":
        navigate("/onboard-agent");
        break;
      case "landlord":
        navigate("/onboard-landlord");
        break;
      default:
        navigate("/dashboard");
        break;
    }
  };

  useEffect(() => {
    if (user) {
      // Get user role from Supabase
      const getUserRoleAndRedirect = async () => {
        try {
          const role = await getUserRole();
          
          if (role) {
            checkAndRedirectToOnboarding(user.id, role);
          } else {
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          navigate("/dashboard");
        }
      };

      getUserRoleAndRedirect();
    }
  }, [user]);

  return { user };
};

export default useRedirectAuthenticated;
