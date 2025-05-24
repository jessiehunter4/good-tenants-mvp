
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const AuthenticatedRedirect = () => {
  const { user, getUserRole, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = useRef(false);
  const isProcessingLogin = useRef(false);

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

  // Check if a fresh login is happening
  const isFreshLogin = () => {
    const freshLoginFlag = sessionStorage.getItem('freshLogin');
    return freshLoginFlag === 'true';
  };

  // Check if a user should be redirected to onboarding based on their role and profile status
  const checkAndRedirectToOnboarding = async (userId: string, userRole: string) => {
    if (hasRedirected.current || isProcessingLogin.current || isFreshLogin()) {
      console.log('AuthenticatedRedirect: Skipping redirect - already redirected, processing login, or fresh login in progress');
      return;
    }
    
    console.log('AuthenticatedRedirect: Checking redirect for user:', userId, 'role:', userRole);
    
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
          console.log('AuthenticatedRedirect: Redirecting admin to dashboard');
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
          console.error("AuthenticatedRedirect: Error fetching profile:", error);
          // If there's an error, default to sending to onboarding
          navigateToOnboarding(userRole);
          return;
        }

        // If profile exists and status is not 'incomplete', redirect to dashboard
        if (profileData && profileData.status && profileData.status !== "incomplete") {
          hasRedirected.current = true;
          console.log('AuthenticatedRedirect: Redirecting to role dashboard:', userRole);
          navigate(`/dashboard-${userRole}`);
        } else {
          // If profile doesn't exist or is incomplete, redirect to onboarding
          navigateToOnboarding(userRole);
        }
      } else {
        // Default to dashboard if no specific role handling
        hasRedirected.current = true;
        console.log('AuthenticatedRedirect: Redirecting to default dashboard');
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("AuthenticatedRedirect: Error in redirect logic:", error);
      hasRedirected.current = true;
      navigate("/dashboard"); // Default fallback
    }
  };

  // Navigate to the appropriate onboarding page
  const navigateToOnboarding = (role: string) => {
    if (hasRedirected.current || isProcessingLogin.current || isFreshLogin()) {
      console.log('AuthenticatedRedirect: Skipping onboarding redirect - already redirected, processing login, or fresh login in progress');
      return;
    }
    
    hasRedirected.current = true;
    console.log('AuthenticatedRedirect: Redirecting to onboarding for role:', role);
    
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
    // Reset redirect flag when component mounts or route changes
    if (location.pathname !== '/auth') {
      hasRedirected.current = false;
      isProcessingLogin.current = false;
    }
    
    // Set processing flag when on auth page to prevent premature redirects
    if (location.pathname === '/auth') {
      isProcessingLogin.current = true;
      // Clear the flag after a longer delay to give LoginForm time to handle redirect
      const timer = setTimeout(() => {
        isProcessingLogin.current = false;
      }, 10000); // Increased timeout to 10 seconds
      return () => clearTimeout(timer);
    }
    
    // Check for fresh login flag
    const freshLogin = isFreshLogin();
    console.log('AuthenticatedRedirect - user:', !!user, 'loading:', loading, 'route:', location.pathname, 'isPublic:', isPublicRoute, 'freshLogin:', freshLogin);
    
    // Only redirect authenticated users who are NOT on public routes
    // and not currently processing a login or handling a fresh login
    if (!loading && user && !hasRedirected.current && !isPublicRoute && !isProcessingLogin.current && !freshLogin) {
      console.log('AuthenticatedRedirect: Starting redirect process for authenticated user');
      
      // Get user role from Supabase with a delay to ensure auth state is stable
      const getUserRoleAndRedirect = async () => {
        try {
          // Add a delay to ensure auth state is fully settled and no fresh login is happening
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Double-check we're still in a valid state for redirect
          if (hasRedirected.current || isProcessingLogin.current || isFreshLogin()) {
            console.log('AuthenticatedRedirect: Redirect cancelled - already redirected, processing login, or fresh login detected');
            return;
          }
          
          const role = await getUserRole();
          console.log('AuthenticatedRedirect: Retrieved user role:', role);
          
          if (role && !hasRedirected.current && !isProcessingLogin.current && !isFreshLogin()) {
            checkAndRedirectToOnboarding(user.id, role);
          } else if (!hasRedirected.current && !isProcessingLogin.current && !isFreshLogin()) {
            hasRedirected.current = true;
            console.log('AuthenticatedRedirect: No role found, redirecting to default dashboard');
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("AuthenticatedRedirect: Error fetching user role:", error);
          if (!hasRedirected.current && !isProcessingLogin.current && !isFreshLogin()) {
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
