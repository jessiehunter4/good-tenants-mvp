
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
    clearFilters
  } = useTenantFilters(tenants, searchQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenant Directory</CardTitle>
        <CardDescription>
          Browse through pre-screened, move-ready tenants.
        </CardDescription>

        <div className="mt-4 space-y-4">
          <SearchBar 
            searchQuery={searchQuery} 
            onSearchChange={onSearchChange} 
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
