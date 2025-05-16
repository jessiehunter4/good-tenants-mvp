
import { User, Search, Calendar, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TenantProfile } from "@/hooks/useLandlordData";
import EmptyState from "@/components/tenant/EmptyState";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

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
  // Filter states
  const [incomeRange, setIncomeRange] = useState<[number, number]>([0, 20000]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isFilteringByDate, setIsFilteringByDate] = useState(false);
  
  const formattedIncome = (income: number | null) => {
    if (!income) return "Not specified";
    return `$${income.toLocaleString()}/month`;
  };
  
  const isVerified = profileStatus === "verified" || profileStatus === "premium";

  // Filter tenants based on search query, income range, and move-in date
  const filteredTenants = tenants.filter(tenant => {
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

  const clearFilters = () => {
    setIncomeRange([0, 20000]);
    setSelectedDate(undefined);
    setIsFilteringByDate(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenant Directory</CardTitle>
        <CardDescription>
          Browse through pre-screened, move-ready tenants.
        </CardDescription>

        <div className="mt-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by location, email, or description..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* Income Range Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Income: ${incomeRange[0].toLocaleString()} - ${incomeRange[1].toLocaleString()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Household Income Range</h4>
                  <Slider
                    defaultValue={incomeRange}
                    min={0}
                    max={20000}
                    step={500}
                    value={incomeRange}
                    onValueChange={(value) => setIncomeRange(value as [number, number])}
                  />
                  <div className="flex justify-between">
                    <span>${incomeRange[0].toLocaleString()}</span>
                    <span>${incomeRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Date Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={`flex items-center gap-2 ${isFilteringByDate ? 'bg-blue-100' : ''}`}>
                  <Calendar className="h-4 w-4" />
                  {selectedDate && isFilteringByDate 
                    ? `Moves after: ${format(selectedDate, 'PP')}` 
                    : 'Move-in Date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setIsFilteringByDate(!!date);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Clear Filters Button */}
            <Button variant="ghost" onClick={clearFilters} size="sm">
              Clear Filters
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isVerified ? (
          filteredTenants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTenants.map((tenant) => (
                <Card key={tenant.id} className="overflow-hidden">
                  <CardHeader className="bg-blue-50 pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{tenant.user_email}</p>
                          <p className="text-sm text-gray-500">
                            Moving: {tenant.move_in_date ? new Date(tenant.move_in_date).toLocaleDateString() : 'Flexible'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {tenant.is_pre_screened && (
                          <Badge className="bg-green-100 text-green-800">
                            Pre-Screened
                          </Badge>
                        )}
                        <Badge className="bg-green-100 text-green-800">
                          Verified
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3">
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-gray-500">Household</p>
                          <p className="font-medium">{tenant.household_size || 'Not specified'} {tenant.household_size === 1 ? 'person' : 'people'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Income</p>
                          <p className="font-medium">{formattedIncome(tenant.household_income)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Pets</p>
                          <p className="font-medium">{tenant.pets ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Preferred Locations</p>
                          <p className="font-medium truncate">{tenant.preferred_locations?.join(', ') || 'Not specified'}</p>
                        </div>
                      </div>
                      {tenant.bio && (
                        <div>
                          <p className="text-sm text-gray-500">Bio</p>
                          <p className="text-sm line-clamp-2">{tenant.bio}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-gray-50">
                    <Button 
                      className="w-full" 
                      onClick={() => onSendInvite(tenant.id)}
                    >
                      Invite to Property
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<User className="h-6 w-6 text-gray-400" />}
              title="No tenants found"
              description="No tenants match your search criteria."
            />
          )
        ) : (
          <EmptyState
            icon={<User className="h-6 w-6 text-gray-400" />}
            title="Verification Required"
            description="You need to be verified to access the tenant directory."
            action={<Button>Get Verified</Button>}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TenantDirectory;
