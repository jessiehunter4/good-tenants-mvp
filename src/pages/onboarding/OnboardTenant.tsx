
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import ProfileForm from "@/components/shared/form/ProfileForm";
import { useDataOperation } from "@/hooks/useDataOperation";
import { z } from "zod";

const OnboardTenant = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { executeOperation, isLoading } = useDataOperation();
  
  const tenantSchema = z.object({
    // Basic household info
    household_size: z.number()
      .int()
      .min(1, { message: "Household must have at least 1 person" })
      .max(20, { message: "Please enter a reasonable household size" }),
    household_income: z.number()
      .min(0, { message: "Income cannot be negative" })
      .max(1000000, { message: "Please enter a reasonable monthly income" }),
    pets: z.boolean(),
    bio: z.string()
      .max(1000, { message: "Bio is too long (max 1000 characters)" })
      .optional()
      .transform(val => val || ""),
    
    // Current move date (existing field)
    move_in_date: z.date()
      .min(new Date(), { message: "Move-in date must be in the future" }),
    
    // New rental preferences
    desired_move_date: z.date()
      .min(new Date(), { message: "Desired move date must be in the future" }),
    move_date_flexibility: z.enum(['exact_date', 'earliest_move', 'anytime_30_days']),
    max_monthly_rent: z.number()
      .min(500, { message: "Please enter a realistic rent amount" })
      .max(50000, { message: "Please enter a reasonable rent amount" }),
    desired_cities: z.string()
      .min(1, { message: "Please enter at least one city" }),
    desired_state: z.string()
      .min(2, { message: "Please enter a state" }),
    desired_zip_code: z.string()
      .optional(),
    desired_property_types: z.array(z.enum(['house', 'townhouse_condo', 'apartment']))
      .min(1, { message: "Please select at least one property type" }),
    min_bedrooms: z.number()
      .int()
      .min(0, { message: "Bedrooms cannot be negative" })
      .max(10, { message: "Please enter a reasonable number of bedrooms" }),
    min_bathrooms: z.number()
      .min(0.5, { message: "Must be at least 0.5 bathrooms" })
      .max(10, { message: "Please enter a reasonable number of bathrooms" }),
    pets_allowed: z.boolean(),
    preferred_locations: z.string()
      .optional()
  });
  
  const form = useForm({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      household_size: 1,
      household_income: 0,
      pets: false,
      bio: "",
      move_in_date: new Date(),
      desired_move_date: new Date(),
      move_date_flexibility: 'anytime_30_days' as const,
      max_monthly_rent: 2000,
      desired_cities: "",
      desired_state: "",
      desired_zip_code: "",
      desired_property_types: [],
      min_bedrooms: 1,
      min_bathrooms: 1,
      pets_allowed: false,
      preferred_locations: ""
    },
  });

  const onSubmit = async (values: z.infer<typeof tenantSchema>) => {
    if (!user) return;

    // Convert cities string to array
    const citiesArray = values.desired_cities
      .split(",")
      .map(city => city.trim())
      .filter(city => city.length > 0);

    // Convert preferred locations string to array (legacy field)
    const locationsArray = values.preferred_locations
      ? values.preferred_locations
          .split(",")
          .map(location => location.trim())
          .filter(location => location.length > 0)
      : [];

    // Format dates to strings for Supabase
    const moveInDate = format(values.move_in_date, 'yyyy-MM-dd');
    const desiredMoveDate = format(values.desired_move_date, 'yyyy-MM-dd');

    await executeOperation(
      async () => {
        const result = await supabase
          .from("tenant_profiles")
          .update({
            // Basic info
            move_in_date: moveInDate,
            household_size: values.household_size,
            household_income: values.household_income,
            pets: values.pets,
            preferred_locations: locationsArray,
            bio: values.bio,
            status: "basic",
            
            // New rental preferences
            desired_move_date: desiredMoveDate,
            move_date_flexibility: values.move_date_flexibility,
            max_monthly_rent: values.max_monthly_rent,
            desired_cities: citiesArray,
            desired_state: values.desired_state,
            desired_zip_code: values.desired_zip_code || null,
            desired_property_types: values.desired_property_types,
            min_bedrooms: values.min_bedrooms,
            min_bathrooms: values.min_bathrooms,
            pets_allowed: values.pets_allowed,
          })
          .eq("id", user.id);
        return result;
      },
      {
        successMessage: "Your rental preferences have been saved successfully.",
        errorMessage: "There was a problem saving your preferences. Please try again.",
        onSuccess: () => navigate("/dashboard-tenant"),
      }
    );
  };

  const formFields = [
    // Basic household information
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
      placeholder: "5000",
    },
    {
      name: "pets",
      label: "I have pets",
      description: "Check this box if you have pets that will be living with you.",
      component: "custom" as const,
      customComponent: <ProfileForm.Checkbox 
        label="I have pets" 
        field={{}}
      />,
    },
    
    // Move-in timeline
    {
      name: "desired_move_date",
      label: "Desired Move-In Date",
      description: "When would you like to move in?",
      component: "custom" as const,
      customComponent: <ProfileForm.DatePicker 
        description="When would you like to move in?"
        minDate={new Date()}
        maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
        field={{}}
      />,
    },
    {
      name: "move_date_flexibility",
      label: "Move Date Flexibility",
      description: "How flexible are you with your move-in date?",
      component: "custom" as const,
      customComponent: (
        <div className="flex flex-col space-y-3">
          <ProfileForm.RadioOption value="exact_date" label="Exact date only" />
          <ProfileForm.RadioOption value="earliest_move" label="This is my earliest move date" />
          <ProfileForm.RadioOption value="anytime_30_days" label="Anytime with 30 days notice" />
        </div>
      ),
    },
    
    // Budget and location preferences
    {
      name: "max_monthly_rent",
      label: "Maximum Monthly Rent ($)",
      description: "What's the maximum rent you can afford?",
      type: "number",
      placeholder: "2500",
    },
    {
      name: "desired_cities",
      label: "Desired Cities",
      description: "Enter cities you'd like to live in (comma-separated).",
      placeholder: "Irvine, Orange, Tustin",
    },
    {
      name: "desired_state",
      label: "State",
      description: "Which state are you looking in?",
      placeholder: "California",
    },
    {
      name: "desired_zip_code",
      label: "Specific Zip Code (Optional)",
      description: "If you specify a zip code, you'll only see properties in that area.",
      placeholder: "92602",
    },
    
    // Property preferences
    {
      name: "desired_property_types",
      label: "Property Types",
      description: "What types of properties are you interested in?",
      component: "custom" as const,
      customComponent: (
        <div className="flex flex-col space-y-3">
          <ProfileForm.Checkbox label="House" value="house" field={{}} />
          <ProfileForm.Checkbox label="Townhouse/Condo" value="townhouse_condo" field={{}} />
          <ProfileForm.Checkbox label="Apartment" value="apartment" field={{}} />
        </div>
      ),
    },
    {
      name: "min_bedrooms",
      label: "Minimum Bedrooms",
      description: "Minimum number of bedrooms needed.",
      type: "number",
      placeholder: "2",
    },
    {
      name: "min_bathrooms",
      label: "Minimum Bathrooms",
      description: "Minimum number of bathrooms needed (can be 0.5, 1, 1.5, etc.).",
      type: "number",
      placeholder: "1.5",
    },
    {
      name: "pets_allowed",
      label: "Pet-friendly properties only",
      description: "Only show properties that allow pets.",
      component: "custom" as const,
      customComponent: <ProfileForm.Checkbox 
        label="Pet-friendly properties only" 
        field={{}}
      />,
    },
    
    // Legacy fields
    {
      name: "move_in_date",
      label: "Flexible Move-In Date (Legacy)",
      description: "Alternative move-in date for compatibility.",
      component: "custom" as const,
      customComponent: <ProfileForm.DatePicker 
        description="Alternative move-in date"
        minDate={new Date()}
        field={{}}
      />,
    },
    {
      name: "preferred_locations",
      label: "Additional Preferred Locations",
      description: "Any other areas you'd consider (comma-separated).",
      placeholder: "Newport Beach, Costa Mesa",
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
      title="Complete Your Rental Preferences"
      description="Please provide detailed information about your housing needs and preferences."
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
