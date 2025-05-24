
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

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
import { registerSchema, RegisterFormValues } from "./RegisterFormSchema";
import { AdminCodeField } from "./AdminCodeField";
import { RoleSelectionField } from "./RoleSelectionField";

interface RegisterFormProps {
  setActiveTab: (tab: string) => void;
}

export const RegisterForm = ({ setActiveTab }: RegisterFormProps) => {
  const { signUp } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "tenant",
      adminCode: "",
    },
  });

  // Single initialization effect to handle all pre-filled data and URL params
  useEffect(() => {
    // Get role from URL query params
    const queryParams = new URLSearchParams(location.search);
    const roleFromUrl = queryParams.get("role");
    
    // Check for pre-filled values from sessionStorage
    const storedData = sessionStorage.getItem("prefilled_registration");
    let prefilledData = null;
    
    if (storedData) {
      try {
        prefilledData = JSON.parse(storedData);
        // Remove the data after retrieving it
        sessionStorage.removeItem("prefilled_registration");
      } catch (error) {
        console.error("Error parsing prefilled registration data:", error);
      }
    }

    // Set form values once during initialization
    const updates: Partial<RegisterFormValues> = {};
    
    if (prefilledData?.email) {
      updates.email = prefilledData.email;
    }
    
    // Prioritize URL role over prefilled role
    if (roleFromUrl) {
      updates.role = roleFromUrl as "tenant" | "agent" | "landlord" | "admin";
    } else if (prefilledData?.role) {
      updates.role = prefilledData.role;
    }

    // Apply all updates at once
    if (Object.keys(updates).length > 0) {
      Object.entries(updates).forEach(([key, value]) => {
        form.setValue(key as keyof RegisterFormValues, value);
      });
    }

    // Set admin code visibility based on initial role
    const initialRole = updates.role || form.getValues('role');
    setShowAdminCode(initialRole === 'admin');

    // Store additional onboarding data if available
    if (prefilledData && (prefilledData.name || prefilledData.phone || prefilledData.moveInDate || prefilledData.city)) {
      sessionStorage.setItem("onboarding_data", JSON.stringify({
        name: prefilledData.name,
        phone: prefilledData.phone,
        moveInDate: prefilledData.moveInDate,
        city: prefilledData.city
      }));
    }
  }, [location.search]);

  // Watch for role changes to show/hide admin code field
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'role') {
        setShowAdminCode(value.role === 'admin');
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (values: RegisterFormValues) => {
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
        
        <RoleSelectionField control={form.control} />

        {showAdminCode && <AdminCodeField control={form.control} />}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
