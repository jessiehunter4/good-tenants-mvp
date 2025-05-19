
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useRedirectAuthenticated } from "@/hooks/useRedirectAuthenticated";
import AuthCard from "@/components/auth/AuthCard";

const Auth = () => {
  // This hook will handle all the redirect logic for authenticated users
  useRedirectAuthenticated();
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <AuthCard />
    </div>
  );
};

export default Auth;
