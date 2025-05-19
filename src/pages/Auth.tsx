
import { useRedirectAuthenticated } from "@/hooks/useRedirectAuthenticated";
import AuthCard from "@/components/auth/AuthCard";

const Auth = () => {
  // This hook will handle all the redirect logic for authenticated users
  useRedirectAuthenticated();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <AuthCard />
    </div>
  );
};

export default Auth;
