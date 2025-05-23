
import { TenantProfile } from "@/types/profiles";

/**
 * Filter tenants based on location (city, state, zip)
 */
export const filterTenantsByLocation = (
  tenants: TenantProfile[],
  locationQuery: string
): TenantProfile[] => {
  if (!locationQuery) return tenants;
  
  const query = locationQuery.toLowerCase();
  return tenants.filter(tenant => (
    tenant.preferred_locations?.some(location => 
      location.toLowerCase().includes(query)
    )
  ));
};

/**
 * Filter tenants based on household size
 */
export const filterTenantsByHouseholdSize = (
  tenants: TenantProfile[],
  householdSize: number | null
): TenantProfile[] => {
  if (!householdSize) return tenants;
  
  return tenants.filter(tenant => 
    tenant.household_size === householdSize
  );
};

/**
 * Filter tenants based on pet preferences
 */
export const filterTenantsByPets = (
  tenants: TenantProfile[],
  petsFilter: 'any' | 'yes' | 'no'
): TenantProfile[] => {
  if (petsFilter === 'any') return tenants;
  
  const hasPets = petsFilter === 'yes';
  return tenants.filter(tenant => 
    tenant.pets === hasPets
  );
};
