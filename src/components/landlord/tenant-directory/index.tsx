
import { useState } from "react";
import { TenantProfile } from "@/types/profiles";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import AdvancedFilters from "./AdvancedFilters";
import TenantGrid from "./TenantGrid";
import VerificationRequired from "./VerificationRequired";
import { useTenantFilters } from "./useTenantFilters";

interface TenantDirectoryProps {
  tenants: TenantProfile[];
  profileStatus: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSendInvite: (tenantId: string) => void;
}

const TenantDirectory = ({ 
  tenants, 
  profileStatus, 
  searchQuery, 
  onSearchChange, 
  onSendInvite 
}: TenantDirectoryProps) => {
  const isVerified = profileStatus === "verified" || profileStatus === "premium";
  
  const {
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
  } = useTenantFilters(tenants, searchQuery);

  const clearAllFilters = () => {
    onSearchChange(""); // Clear main search query
    clearFilters(); // Clear all other filters
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenant Directory</CardTitle>
        <CardDescription>
          Browse through pre-screened, move-ready tenants. Use the search and filters below to find the perfect match.
        </CardDescription>

        <div className="mt-4 space-y-4">
          <SearchBar 
            searchQuery={searchQuery} 
            onSearchChange={onSearchChange} 
          />
          
          <AdvancedFilters
            locationQuery={locationQuery}
            setLocationQuery={setLocationQuery}
            householdSize={householdSize}
            setHouseholdSize={setHouseholdSize}
            petsFilter={petsFilter}
            setPetsFilter={setPetsFilter}
            clearAllFilters={clearAllFilters}
          />
          
          <FilterBar
            incomeRange={incomeRange}
            setIncomeRange={setIncomeRange}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            isFilteringByDate={isFilteringByDate}
            setIsFilteringByDate={setIsFilteringByDate}
            clearFilters={clearFilters}
          />

          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Showing {filteredTenants.length} of {tenants.length} tenants</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isVerified ? (
          <TenantGrid 
            tenants={filteredTenants}
            onSendInvite={onSendInvite}
          />
        ) : (
          <VerificationRequired />
        )}
      </CardContent>
    </Card>
  );
};

export default TenantDirectory;
