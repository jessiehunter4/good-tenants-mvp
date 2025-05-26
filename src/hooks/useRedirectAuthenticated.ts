
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const useRedirectAuthenticated = () => {
  const { user, getUserRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if user is already authenticated when the component mounts
    // Don't interfere with fresh login flows or sign-out processes
    if (user) {
      console.log("useRedirectAuthenticated: User is authenticated:", user.id);
      
      // Check if this is from a fresh login by looking at sessionStorage
      const isFromLogin = sessionStorage.getItem('fresh_login');
      if (isFromLogin) {
        console.log("Fresh login detected, clearing flag and skipping auto-redirect");
        sessionStorage.removeItem('fresh_login');
        return;
      }

      // Get user role from metadata (no async call needed)
      const role = getUserRole();
      console.log("useRedirectAuthenticated: User role:", role);
      
      if (role) {
        // For authenticated users who are not from a fresh login,
        // redirect them to their appropriate dashboard
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
            navigate("/dashboard");
            break;
        }
      } else {
        console.log("No role found, redirecting to general dashboard");
        navigate("/dashboard");
      }
    } else {
      // User is not authenticated, no redirection needed
      console.log("useRedirectAuthenticated: User is not authenticated, no redirect needed");
    }
  }, [user, navigate, getUserRole]);

  return { user };
};

export default useRedirectAuthenticated;
