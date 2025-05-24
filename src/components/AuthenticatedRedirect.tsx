
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const AuthenticatedRedirect = () => {
  const { user, getUserRole, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = useRef(false);

  // Define public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/summer',
    '/auth',
    '/market-analytics',
    '/index'
  ];

  // Check if current route is public
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Check if a user should be redirected to onboarding based on their role and profile status
  const checkAndRedirectToOnboarding = async (userId: string, userRole: string) => {
    if (hasRedirected.current) return;
    
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
          hasRedirected.current = true;
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
          hasRedirected.current = true;
          navigate(`/dashboard-${userRole}`);
        } else {
          // If profile doesn't exist or is incomplete, redirect to onboarding
          navigateToOnboarding(userRole);
        }
      } else {
        // Default to dashboard if no specific role handling
        hasRedirected.current = true;
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error in redirect logic:", error);
      hasRedirected.current = true;
      navigate("/dashboard"); // Default fallback
    }
  };

  // Navigate to the appropriate onboarding page
  const navigateToOnboarding = (role: string) => {
    if (hasRedirected.current) return;
    
    hasRedirected.current = true;
    
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
    // Reset redirect flag when component mounts
    hasRedirected.current = false;
    
    // CRITICAL FIX: Only redirect authenticated users who are NOT on public routes
    if (!loading && user && !hasRedirected.current && !isPublicRoute) {
      // Get user role from Supabase with a small delay to ensure auth context is stable
      const getUserRoleAndRedirect = async () => {
        try {
          // Add a small delay to ensure auth state is fully settled
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const role = await getUserRole();
          
          if (role && !hasRedirected.current) {
            checkAndRedirectToOnboarding(user.id, role);
          } else if (!hasRedirected.current) {
            hasRedirected.current = true;
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          if (!hasRedirected.current) {
            hasRedirected.current = true;
            navigate("/dashboard");
          }
        }
      };

      getUserRoleAndRedirect();
    }
  }, [user, loading, getUserRole, navigate, location.pathname, isPublicRoute]);

  return null; // This component doesn't render anything
};

export default AuthenticatedRedirect;
