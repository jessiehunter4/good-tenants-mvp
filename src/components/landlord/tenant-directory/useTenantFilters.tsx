
import { useState, useCallback } from "react";
import { TenantProfile } from "@/types/profiles";
import { 
  filterTenantsByQuery, 
  filterTenantsByIncome, 
  filterTenantsByMoveInDate 
} from "@/utils/filters/tenantFilters";

export const useTenantFilters = (initialTenants: TenantProfile[], searchQuery: string) => {
  const [incomeRange, setIncomeRange] = useState<[number, number]>([0, 20000]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isFilteringByDate, setIsFilteringByDate] = useState(false);
  
  const clearFilters = useCallback(() => {
    setIncomeRange([0, 20000]);
    setSelectedDate(undefined);
    setIsFilteringByDate(false);
  }, []);
  
  // Apply filters sequentially
  const tenantsByQuery = filterTenantsByQuery(initialTenants, searchQuery);
  const tenantsByIncome = filterTenantsByIncome(tenantsByQuery, incomeRange);
  const filteredTenants = filterTenantsByMoveInDate(tenantsByIncome, selectedDate, isFilteringByDate);

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
