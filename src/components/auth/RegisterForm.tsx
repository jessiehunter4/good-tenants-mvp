
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LockIcon } from "lucide-react";
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
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";

// Schema for registration form validation
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

export type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  setActiveTab: (tab: string) => void;
}

export const RegisterForm = ({ setActiveTab }: RegisterFormProps) => {
  const { signUp } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);

  // Get role from URL query params
  const queryParams = new URLSearchParams(location.search);
  const roleFromUrl = queryParams.get("role");
  
  // Check for pre-filled values from sessionStorage
  const [prefilledData, setPrefilledData] = useState<any>(null);
  
  useEffect(() => {
    const storedData = sessionStorage.getItem("prefilled_registration");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setPrefilledData(parsedData);
        // Remove the data after retrieving it to prevent it from being used multiple times
        sessionStorage.removeItem("prefilled_registration");
      } catch (error) {
        console.error("Error parsing prefilled registration data:", error);
      }
    }
  }, []);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: prefilledData?.email || "",
      password: "",
      role: roleFromUrl as "tenant" | "agent" | "landlord" | "admin" || prefilledData?.role || "tenant",
      adminCode: "",
    },
  });

  // Update the form values when prefilledData is loaded
  useEffect(() => {
    if (prefilledData?.email) {
      form.setValue('email', prefilledData.email);
    }
    if (prefilledData?.role) {
      form.setValue('role', prefilledData.role);
    }
  }, [prefilledData, form]);

  // Update the role field in the form when the URL role parameter changes
  useEffect(() => {
    if (roleFromUrl) {
      form.setValue('role', roleFromUrl as "tenant" | "agent" | "landlord");
    }
  }, [roleFromUrl, form]);

  // Watch for role changes to show/hide admin code field
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'role' || name === undefined) {
        setShowAdminCode(value.role === 'admin');
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setIsLoading(true);
      await signUp(values.email, values.password, values.role, values.adminCode);
      toast({
        title: "Registration successful!",
        description: "Please check your email to verify your account.",
      });
      setActiveTab("login");
      
      // Store additional user data for onboarding
      if (prefilledData) {
        sessionStorage.setItem("onboarding_data", JSON.stringify({
          name: prefilledData.name,
          phone: prefilledData.phone,
          moveInDate: prefilledData.moveInDate,
          city: prefilledData.city
        }));
      }
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
        <FormField
          control={form.control}
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
            control={form.control}
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
  );
};

export default RegisterForm;
