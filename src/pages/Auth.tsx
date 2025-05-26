
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthCard from "@/components/auth/AuthCard";

const Auth = () => {
  const { user, getUserRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Process query parameters for pre-filled form data
  const queryParams = new URLSearchParams(location.search);

  // Extract values that might be passed from the summer landing page
  const name = queryParams.get("name");
  const email = queryParams.get("email");
  const phone = queryParams.get("phone");
  const moveInDate = queryParams.get("moveInDate");
  const city = queryParams.get("city");
  const role = queryParams.get("role");

  // Store the pre-filled values in sessionStorage to be used by the registration form
  useEffect(() => {
    if (name || email || phone || moveInDate || city || role) {
      sessionStorage.setItem(
        "prefilled_registration", 
        JSON.stringify({
          name,
          email,
          phone,
          moveInDate,
          city,
          role: role || "tenant"
        })
      );
    }
  }, [name, email, phone, moveInDate, city, role]);

  // Handle authenticated users who access /auth directly
  useEffect(() => {
    if (user) {
      console.log("Auth page: User is already authenticated, redirecting");
      const userRole = getUserRole();
      
      if (userRole) {
        switch (userRole) {
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
        navigate("/dashboard");
      }
    }
  }, [user, getUserRole, navigate]);

  // Don't show auth card if user is already authenticated
  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <AuthCard />
    </div>
  );
};

export default Auth;
