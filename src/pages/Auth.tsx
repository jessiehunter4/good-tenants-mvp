
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LockIcon } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const registerSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["tenant", "agent", "landlord", "admin"], {
    required_error: "Please select a role.",
  }),
  adminCode: z.string().optional(),
}).refine((data) => {
  // If role is admin, adminCode is required
  if (data.role === "admin") {
    return !!data.adminCode;
  }
  return true;
}, {
  message: "Admin registration code is required",
  path: ["adminCode"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const Auth = () => {
  const { user, session, signIn, signUp, getUserRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [showAdminCode, setShowAdminCode] = useState(false);

  // Get role from URL query params
  const queryParams = new URLSearchParams(location.search);
  const roleFromUrl = queryParams.get("role");

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

  // Redirect if already logged in
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
  }, [user, navigate, getUserRole]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      role: roleFromUrl as "tenant" | "agent" | "landlord" | "admin" || "tenant",
      adminCode: "",
    },
  });

  // Update the role field in the form when the URL role parameter changes
  useEffect(() => {
    if (roleFromUrl) {
      registerForm.setValue('role', roleFromUrl as "tenant" | "agent" | "landlord");
    }
  }, [roleFromUrl, registerForm]);

  // Watch for role changes to show/hide admin code field
  useEffect(() => {
    const subscription = registerForm.watch((value, { name }) => {
      if (name === 'role' || name === undefined) {
        setShowAdminCode(value.role === 'admin');
      }
    });
    
    return () => subscription.unsubscribe();
  }, [registerForm.watch]);

  const onLoginSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      await signIn(values.email, values.password);
      // Redirection handled in the useEffect
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (values: RegisterFormValues) => {
    try {
      setIsLoading(true);
      await signUp(values.email, values.password, values.role, values.adminCode);
      toast({
        title: "Registration successful!",
        description: "Please check your email to verify your account.",
      });
      setActiveTab("login");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "Please check your information and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <h1 className="text-2xl font-bold text-center text-blue-900">Good Tenants</h1>
          </div>
          <CardTitle className="text-center">Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>I am a:</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="tenant" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Tenant (I'm looking for a home)
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="agent" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Real Estate Agent
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="landlord" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Landlord/Property Owner
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="admin" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Administrator
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {showAdminCode && (
                    <FormField
                      control={registerForm.control}
                      name="adminCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Admin Registration Code</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type="password" {...field} />
                              <LockIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? "Creating account..." : "Create account"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          By continuing, you agree to Good Tenants' Terms of Service and Privacy Policy.
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
