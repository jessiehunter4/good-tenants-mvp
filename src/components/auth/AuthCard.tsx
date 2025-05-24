
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthCard = () => {
  const [activeTab, setActiveTab] = useState("login");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for tab parameter in URL
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get("tab");
    
    // Only update the tab if it's different from current state and is a valid tab
    if (tabParam === "register" && activeTab !== "register") {
      setActiveTab("register");
    } else if (!tabParam && activeTab !== "login") {
      setActiveTab("login");
    }
  }, [location.search, activeTab]);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    
    // Update URL to reflect the current tab
    const searchParams = new URLSearchParams(location.search);
    if (newTab === "register") {
      searchParams.set("tab", "register");
    } else {
      searchParams.delete("tab");
    }
    
    // Update URL without causing a full page reload
    const newSearch = searchParams.toString();
    const newPath = newSearch ? `${location.pathname}?${newSearch}` : location.pathname;
    navigate(newPath, { replace: true });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <h1 className="text-2xl font-bold text-center text-blue-900">Good Tenants</h1>
        </div>
        <CardTitle className="text-center">Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm setActiveTab={handleTabChange} />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm setActiveTab={handleTabChange} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-center text-sm text-muted-foreground">
        By continuing, you agree to Good Tenants' Terms of Service and Privacy Policy.
      </CardFooter>
    </Card>
  );
};

export default AuthCard;
