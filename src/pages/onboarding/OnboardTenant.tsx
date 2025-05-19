
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import ProfileForm from "@/components/shared/form/ProfileForm";
import { useDataOperation } from "@/hooks/useDataOperation";
import { createProfileSchema } from "@/lib/form-validation";
import { z } from "zod";

const OnboardTenant = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { executeOperation, isLoading } = useDataOperation();
  
  // Enhance the tenant schema with stronger validation
  const tenantSchema = z.object({
    household_size: z.number()
      .int()
      .min(1, { message: "Household must have at least 1 person" })
      .max(20, { message: "Please enter a reasonable household size" }),
    household_income: z.number()
      .min(0, { message: "Income cannot be negative" })
      .max(1000000, { message: "Please enter a reasonable monthly income" }),
    pets: z.boolean(),
    preferred_locations: z.string()
      .max(500, { message: "Location list is too long" })
      .refine(val => !val.includes("<script>"), { 
        message: "Invalid characters detected" 
      }),
    bio: z.string()
      .max(1000, { message: "Bio is too long (max 1000 characters)" })
      .refine(val => !val.includes("<script>"), { 
        message: "Invalid characters detected" 
      })
      .optional()
      .transform(val => val || ""),
    move_in_date: z.date()
      .min(new Date(), { message: "Move-in date must be in the future" })
  });
  
  const form = useForm({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      household_size: 1,
      household_income: 0,
      pets: false,
      preferred_locations: "",
      bio: "",
      move_in_date: new Date(), 
    },
  });

  const onSubmit = async (values: z.infer<typeof tenantSchema>) => {
    if (!user) return;

    // Sanitize inputs to prevent XSS
    const sanitizeInput = (input: string): string => {
      return input
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    // Convert preferred locations string to array and sanitize
    const locationsArray = values.preferred_locations
      ? values.preferred_locations
          .split(",")
          .map(location => sanitizeInput(location.trim()))
          .filter(location => location.length > 0)
      : [];

    // Format date to string for Supabase
    const formattedDate = format(values.move_in_date, 'yyyy-MM-dd');

    // Sanitize bio text
    const sanitizedBio = sanitizeInput(values.bio);

    await executeOperation(
      async () => {
        const result = await supabase
          .from("tenant_profiles")
          .update({
            move_in_date: formattedDate,
            household_size: values.household_size,
            household_income: values.household_income,
            pets: values.pets,
            preferred_locations: locationsArray,
            bio: sanitizedBio,
            status: "basic", // Update status after completing onboarding
          })
          .eq("id", user.id)
          .then(result => result);
        return result;
      },
      {
        successMessage: "Your tenant profile has been created successfully.",
        errorMessage: "There was a problem updating your profile. Please try again.",
        onSuccess: () => navigate("/dashboard-tenant"),
      }
    );
  };

  // Define form fields for ProfileForm with proper literal type values
  const formFields = [
    {
      name: "move_in_date",
      label: "Expected Move-In Date",
      description: "When are you looking to move in?",
      component: "custom" as const,
      customComponent: <ProfileForm.DatePicker 
        description="When are you looking to move in?"
        minDate={new Date()}
        maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
        field={{}} // This empty object will be replaced by the actual field from FormField
      />,
    },
    {
      name: "household_size",
      label: "Household Size",
      description: "Number of people who will be living in the home.",
      type: "number",
      placeholder: "1",
    },
    {
      name: "household_income",
      label: "Monthly Household Income ($)",
      description: "Approximate monthly income before taxes.",
      type: "number",
      placeholder: "0",
    },
    {
      name: "pets",
      label: "I have pets",
      description: "Check this box if you have pets that will be living with you.",
      component: "custom" as const,
      customComponent: <ProfileForm.Checkbox 
        label="I have pets" 
        field={{}} // This empty object will be replaced by the actual field from FormField
      />,
    },
    {
      name: "preferred_locations",
      label: "Preferred Locations",
      description: "Enter comma-separated list of areas you're interested in.",
      placeholder: "e.g. Irvine, West Riverside, Orange County",
    },
    {
      name: "bio",
      label: "About You",
      description: "Brief description about yourself (occupation, lifestyle, etc.)",
      component: "textarea" as const,
      placeholder: "Tell us a bit about yourself and what you're looking for...",
    },
  ];

  const handleCancel = () => navigate("/");

  return (
    <ProfileForm
      title="Complete Your Tenant Profile"
      description="Please provide details about your housing preferences and requirements."
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isLoading}
      onCancel={handleCancel}
      fields={formFields}
      submitButtonText="Save and Continue"
      cancelButtonText="Back to Home"
    />
  );
};

export default OnboardTenant;
