
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Schema for login form validation
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  setActiveTab: (tab: string) => void;
}

export const LoginForm = ({ setActiveTab }: LoginFormProps) => {
  const { signIn, getUserRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      console.log('Starting login process...');
      
      // signIn now returns the user directly from the session
      const loggedInUser = await signIn(values.email, values.password);
      
      console.log('Login successful, user received:', loggedInUser.id);
      toast({
        title: "Login successful",
        description: "Welcome back! Redirecting you now...",
      });
      
      // Use the returned user to get role immediately
      try {
        const role = await getUserRole(loggedInUser.id);
        console.log('User role retrieved:', role);
        
        if (role === 'admin') {
          console.log('Redirecting admin to dashboard');
          navigate("/admin-dashboard");
        } else if (role) {
          console.log(`Redirecting ${role} to dashboard`);
          navigate(`/dashboard-${role}`);
        } else {
          console.log('No role found, redirecting to default dashboard');
          navigate("/dashboard");
        }
      } catch (roleError) {
        console.error("Error getting user role:", roleError);
        console.log('Falling back to default dashboard');
        navigate("/dashboard");
      }
      
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
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
          control={form.control}
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
  );
};

export default LoginForm;
