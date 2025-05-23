
export interface Listing {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  price: number;
  available_date: string;
  is_active: boolean;
  // New enhanced fields
  property_type: string;
  listing_status: string;
  full_baths: number;
  three_quarter_baths: number;
  half_baths: number;
  total_baths: number;
  pets_allowed: boolean;
  featured: boolean;
  description: string | null;
  owner_id: string;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  image_url: string;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface PropertyShowing {
  id: string;
  listing_id: string;
  tenant_id: string;
  requested_date: string;
  requested_time: string;
  status: string;
  message: string | null;
  created_at: string;
  updated_at: string;
}
