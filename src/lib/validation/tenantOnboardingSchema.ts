
import { z } from "zod";

export const tenantOnboardingSchema = z.object({
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

export type TenantOnboardingFormData = z.infer<typeof tenantOnboardingSchema>;
