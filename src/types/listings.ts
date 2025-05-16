
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
}
