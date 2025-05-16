
import { TenantProfile } from "@/types/profiles";

/**
 * Filter tenants based on search query
 */
export const filterTenantsByQuery = (tenants: TenantProfile[], searchQuery: string): TenantProfile[] => {
  if (!searchQuery) return tenants;
  
  const query = searchQuery.toLowerCase();
  return tenants.filter(tenant => (
    tenant.user_email?.toLowerCase().includes(query) ||
    tenant.preferred_locations?.some(location => location.toLowerCase().includes(query)) ||
    (tenant.bio && tenant.bio.toLowerCase().includes(query))
  ));
};

/**
 * Filter tenants based on income range
 */
export const filterTenantsByIncome = (
  tenants: TenantProfile[], 
  incomeRange: [number, number]
): TenantProfile[] => {
  return tenants.filter(tenant => {
    if (!tenant.household_income) return true;
    return tenant.household_income >= incomeRange[0] && tenant.household_income <= incomeRange[1];
  });
};

/**
 * Filter tenants based on move-in date
 */
export const filterTenantsByMoveInDate = (
  tenants: TenantProfile[],
  selectedDate: Date | undefined,
  isFilteringByDate: boolean
): TenantProfile[] => {
  if (!isFilteringByDate || !selectedDate) return tenants;
  
  const filterDate = new Date(selectedDate.setHours(0, 0, 0, 0));
  return tenants.filter(tenant => {
    if (!tenant.move_in_date) return false;
    const tenantDate = new Date(tenant.move_in_date);
    return tenantDate >= filterDate;
  });
};
