
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
  // Initialize state based on URL params to avoid useEffect on first render
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") === "register" ? "register" : "login";
  
  const [activeTab, setActiveTab] = useState(initialTab);

  // Only listen to URL changes, not activeTab changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get("tab");
    
    // Update tab based on URL without causing a loop
    const newTab = tabParam === "register" ? "register" : "login";
    setActiveTab(newTab);
  }, [location.search]); // Remove activeTab from dependencies

  // Simple tab change handler - no URL manipulation
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
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
