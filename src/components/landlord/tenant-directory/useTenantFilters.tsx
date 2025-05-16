
import { useState, useCallback } from "react";
import { TenantProfile } from "@/types/profiles";

export const useTenantFilters = (initialTenants: TenantProfile[], searchQuery: string) => {
  const [incomeRange, setIncomeRange] = useState<[number, number]>([0, 20000]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isFilteringByDate, setIsFilteringByDate] = useState(false);
  
  const clearFilters = useCallback(() => {
    setIncomeRange([0, 20000]);
    setSelectedDate(undefined);
    setIsFilteringByDate(false);
  }, []);
  
  // Filter tenants based on search query, income range, and move-in date
  const filteredTenants = initialTenants.filter(tenant => {
    let matchesFilters = true;
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      matchesFilters = matchesFilters && (
        tenant.user_email?.toLowerCase().includes(query) ||
        tenant.preferred_locations?.some(location => location.toLowerCase().includes(query)) ||
        (tenant.bio && tenant.bio.toLowerCase().includes(query))
      );
    }
    
    // Apply income range filter
    if (tenant.household_income) {
      matchesFilters = matchesFilters && 
        tenant.household_income >= incomeRange[0] && 
        tenant.household_income <= incomeRange[1];
    }
    
    // Apply move-in date filter
    if (isFilteringByDate && selectedDate && tenant.move_in_date) {
      const tenantDate = new Date(tenant.move_in_date);
      const filterDate = selectedDate;
      
      // Match if the tenant's move-in date is on or after the selected date
      matchesFilters = matchesFilters && 
        tenantDate >= new Date(filterDate.setHours(0, 0, 0, 0));
    }
    
    return matchesFilters;
  });

  return {
    filteredTenants,
    incomeRange,
    setIncomeRange,
    selectedDate,
    setSelectedDate,
    isFilteringByDate,
    setIsFilteringByDate,
    clearFilters
  };
};
