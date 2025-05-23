

export interface LandlordProfile {
  id: string;
  status: string;
  bio: string | null;
  property_count: number | null;
  years_experience: number | null;
  is_verified: boolean | null;
  management_type: string | null;
  preferred_tenant_criteria: string | null;
}

export interface TenantProfile {
  id: string;
  user_email: string;
  status: string;
  move_in_date: string | null;
  household_size: number | null;
  household_income: number | null;
  pets: boolean | null;
  preferred_locations: string[] | null;
  bio: string | null;
  is_pre_screened: boolean | null;
  profile_image_url: string | null;
  screening_status: string | null;
  last_activity: string | null;
  contact_preferences: any | null;
  // New rental preference fields
  desired_move_date: string | null;
  move_date_flexibility: string | null;
  max_monthly_rent: number | null;
  desired_cities: string[] | null;
  desired_state: string | null;
  desired_zip_code: string | null;
  desired_property_types: string[] | null;
  min_bedrooms: number | null;
  min_bathrooms: number | null;
  pets_allowed: boolean | null;
}

