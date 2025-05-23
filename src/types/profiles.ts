
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
}
