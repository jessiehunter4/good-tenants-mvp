
import { useState, useCallback } from "react";
import { TenantProfile } from "@/types/profiles";
import { 
  filterTenantsByQuery, 
  filterTenantsByIncome, 
  filterTenantsByMoveInDate 
} from "@/utils/filters/tenantFilters";
import {
  filterTenantsByLocation,
  filterTenantsByHouseholdSize,
  filterTenantsByPets
} from "@/utils/filters/locationFilters";

export const useTenantFilters = (initialTenants: TenantProfile[], searchQuery: string) => {
  const [incomeRange, setIncomeRange] = useState<[number, number]>([0, 20000]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isFilteringByDate, setIsFilteringByDate] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [householdSize, setHouseholdSize] = useState<number | null>(null);
  const [petsFilter, setPetsFilter] = useState<'any' | 'yes' | 'no'>('any');
  
  const clearFilters = useCallback(() => {
    setIncomeRange([0, 20000]);
    setSelectedDate(undefined);
    setIsFilteringByDate(false);
    setLocationQuery("");
    setHouseholdSize(null);
    setPetsFilter('any');
  }, []);
  
  // Apply filters sequentially
  const tenantsByQuery = filterTenantsByQuery(initialTenants, searchQuery);
  const tenantsByLocation = filterTenantsByLocation(tenantsByQuery, locationQuery);
  const tenantsByIncome = filterTenantsByIncome(tenantsByLocation, incomeRange);
  const tenantsByDate = filterTenantsByMoveInDate(tenantsByIncome, selectedDate, isFilteringByDate);
  const tenantsByHousehold = filterTenantsByHouseholdSize(tenantsByDate, householdSize);
  const filteredTenants = filterTenantsByPets(tenantsByHousehold, petsFilter);

  return {
    filteredTenants,
    incomeRange,
    setIncomeRange,
    selectedDate,
    setSelectedDate,
    isFilteringByDate,
    setIsFilteringByDate,
    locationQuery,
    setLocationQuery,
    householdSize,
    setHouseholdSize,
    petsFilter,
    setPetsFilter,
    clearFilters
  };
};
