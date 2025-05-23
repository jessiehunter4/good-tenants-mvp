
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
  const [screeningStatusFilter, setScreeningStatusFilter] = useState<string | null>(null);
  
  const clearFilters = useCallback(() => {
    setIncomeRange([0, 20000]);
    setSelectedDate(undefined);
    setIsFilteringByDate(false);
    setLocationQuery("");
    setHouseholdSize(null);
    setPetsFilter('any');
    setScreeningStatusFilter(null);
  }, []);
  
  // Apply filters sequentially
  const tenantsByQuery = filterTenantsByQuery(initialTenants, searchQuery);
  const tenantsByLocation = filterTenantsByLocation(tenantsByQuery, locationQuery);
  const tenantsByIncome = filterTenantsByIncome(tenantsByLocation, incomeRange);
  const tenantsByDate = filterTenantsByMoveInDate(tenantsByIncome, selectedDate, isFilteringByDate);
  const tenantsByHousehold = filterTenantsByHouseholdSize(tenantsByDate, householdSize);
  
  // Filter by screening status if needed
  const tenantsByScreeningStatus = screeningStatusFilter 
    ? tenantsByHousehold.filter(tenant => tenant.screening_status === screeningStatusFilter)
    : tenantsByHousehold;
    
  const filteredTenants = filterTenantsByPets(tenantsByScreeningStatus, petsFilter);

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
    screeningStatusFilter,
    setScreeningStatusFilter,
    clearFilters
  };
};
