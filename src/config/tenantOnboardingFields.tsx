
import React from "react";
import ProfileForm from "@/components/shared/form/ProfileForm";

export const getTenantOnboardingFields = () => [
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
      <ProfileForm.RadioGroup 
        options={[
          { value: "exact_date", label: "Exact date only" },
          { value: "earliest_move", label: "This is my earliest move date" },
          { value: "anytime_30_days", label: "Anytime with 30 days notice" }
        ]}
        field={{}}
      />
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
      <ProfileForm.CheckboxGroup 
        options={[
          { value: "house", label: "House" },
          { value: "townhouse_condo", label: "Townhouse/Condo" },
          { value: "apartment", label: "Apartment" }
        ]}
        field={{}}
      />
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
