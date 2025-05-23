
import { useState } from "react";
import { TenantProfile } from "@/types/profiles";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import AdvancedFilters from "./AdvancedFilters";
import TenantGrid from "./TenantGrid";
import PropertySelectionModal from "./PropertySelectionModal";
import VerificationRequired from "./VerificationRequired";
import { useTenantFilters } from "./useTenantFilters";

interface TenantDirectoryProps {
  tenants: TenantProfile[];
  profileStatus: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSendInvite: (tenantId: string, propertyId: string, message: string) => void;
  properties: any[]; // Array of properties from landlord/agent
}

const TenantDirectory = ({ 
  tenants, 
  profileStatus, 
  searchQuery, 
  onSearchChange, 
  onSendInvite,
  properties = []
}: TenantDirectoryProps) => {
  const isVerified = profileStatus === "verified" || profileStatus === "premium";
  const { toast } = useToast();
  
  const [invitingTenant, setInvitingTenant] = useState<string | null>(null);
  
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
  
  const handleSendInvite = (tenantId: string) => {
    if (properties.length === 0) {
      toast({
        title: "No Properties Available",
        description: "You need to add properties before inviting tenants.",
        variant: "destructive"
      });
      return;
    }
    
    setInvitingTenant(tenantId);
  };
  
  const handleConfirmInvite = (propertyId: string, message: string) => {
    if (invitingTenant) {
      onSendInvite(invitingTenant, propertyId, message);
      setInvitingTenant(null);
      
      toast({
        title: "Invitation Sent",
        description: "The tenant has been invited to view your property.",
      });
    }
  };
  
  // Find the tenant email for the invitation modal
  const invitedTenant = tenants.find(t => t.id === invitingTenant);

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
            onSendInvite={handleSendInvite}
          />
        ) : (
          <VerificationRequired />
        )}
        
        {invitingTenant && (
          <PropertySelectionModal
            isOpen={!!invitingTenant}
            onClose={() => setInvitingTenant(null)}
            onSendInvite={handleConfirmInvite}
            properties={properties}
            tenantName={invitedTenant?.user_email || "tenant"}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TenantDirectory;
