
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ProfileForm from "@/components/shared/ProfileForm";
import { useDataOperation } from "@/hooks/useDataOperation";
import { createProfileSchema } from "@/lib/form-validation";

const OnboardLandlord = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { executeOperation, isLoading } = useDataOperation();
  
  // Use the shared validation schema from form-validation.ts
  const landlordSchema = createProfileSchema("landlord");
  
  const form = useForm({
    resolver: zodResolver(landlordSchema),
    defaultValues: {
      property_count: 1,
      years_experience: 0,
      management_type: "self",
      preferred_tenant_criteria: "",
      bio: "",
    },
  });

  const onSubmit = async (values) => {
    if (!user) return;

    // Use the executeOperation function from useDataOperation for consistent error handling
    await executeOperation(
      () => supabase
        .from("landlord_profiles")
        .update({
          property_count: values.property_count,
          years_experience: values.years_experience,
          management_type: values.management_type,
          preferred_tenant_criteria: values.preferred_tenant_criteria || "",
          bio: values.bio || "",
          status: "basic", // Update status to basic after completing onboarding
        })
        .eq("id", user.id)
        .then(result => result), // Add .then() to properly return a Promise
      {
        successMessage: "Your landlord profile has been created successfully.",
        errorMessage: "There was a problem updating your profile. Please try again.",
        onSuccess: () => navigate("/dashboard-landlord"),
      }
    );
  };

  // Define form fields for ProfileForm
  const formFields = [
    {
      name: "property_count",
      label: "Number of Properties",
      description: "How many rental properties do you own or manage?",
      type: "number",
      placeholder: "1",
    },
    {
      name: "years_experience",
      label: "Years of Experience",
      description: "How many years have you been a landlord or property owner?",
      type: "number",
    },
    {
      name: "management_type",
      label: "Property Management",
      description: "How do you manage your properties?",
      component: "custom",
      customComponent: (
        <div className="flex flex-col space-y-3">
          <ProfileForm.RadioOption
            value="self"
            label="Self-managed properties"
          />
          <ProfileForm.RadioOption
            value="company"
            label="I use a property management company"
          />
          <ProfileForm.RadioOption
            value="hybrid"
            label="Hybrid approach (some self-managed, some with a company)"
          />
        </div>
      ),
    },
    {
      name: "preferred_tenant_criteria",
      label: "Preferred Tenant Criteria",
      description: "What are you looking for in an ideal tenant?",
      component: "textarea",
      placeholder: "e.g. No smoking, minimum credit score, income requirements...",
    },
    {
      name: "bio",
      label: "About You",
      description: "Brief description about your property management philosophy.",
      component: "textarea",
      placeholder: "Tell us about yourself as a property owner...",
    },
  ];

  const handleCancel = () => navigate("/");

  return (
    <ProfileForm
      title="Complete Your Landlord Profile"
      description="Please provide information about your property management experience."
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

export default OnboardLandlord;
