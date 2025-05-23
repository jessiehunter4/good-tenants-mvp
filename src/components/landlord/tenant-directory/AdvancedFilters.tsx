
import { useState } from "react";
import { MapPin, Users, Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface AdvancedFiltersProps {
  locationQuery: string;
  setLocationQuery: (query: string) => void;
  householdSize: number | null;
  setHouseholdSize: (size: number | null) => void;
  petsFilter: 'any' | 'yes' | 'no';
  setPetsFilter: (filter: 'any' | 'yes' | 'no') => void;
  clearAllFilters: () => void;
}

const AdvancedFilters = ({
  locationQuery,
  setLocationQuery,
  householdSize,
  setHouseholdSize,
  petsFilter,
  setPetsFilter,
  clearAllFilters,
}: AdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeFiltersCount = [
    locationQuery,
    householdSize,
    petsFilter !== 'any'
  ].filter(Boolean).length;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Location Search */}
      <div className="relative flex-1 min-w-[200px]">
        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by city, state, or zip..."
          className="pl-10"
          value={locationQuery}
          onChange={(e) => setLocationQuery(e.target.value)}
        />
      </div>

      {/* Advanced Filters Popover */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="relative">
            <Search className="h-4 w-4 mr-2" />
            Advanced Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Household Size</Label>
              <Select
                value={householdSize?.toString() || ""}
                onValueChange={(value) => setHouseholdSize(value ? parseInt(value) : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any size</SelectItem>
                  <SelectItem value="1">1 person</SelectItem>
                  <SelectItem value="2">2 people</SelectItem>
                  <SelectItem value="3">3 people</SelectItem>
                  <SelectItem value="4">4 people</SelectItem>
                  <SelectItem value="5">5+ people</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Pets</Label>
              <Select
                value={petsFilter}
                onValueChange={(value: 'any' | 'yes' | 'no') => setPetsFilter(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="yes">Has pets</SelectItem>
                  <SelectItem value="no">No pets</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                onClick={clearAllFilters}
                className="flex-1"
              >
                Clear All
              </Button>
              <Button 
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AdvancedFilters;
