
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Listing } from "@/types/listings";
import PropertyFilters from "./PropertyFilters";
import PropertyGrid from "./PropertyGrid";

interface PropertyDirectoryProps {
  listings: Listing[];
  onExpressInterest: (listingId: string) => void;
  onViewProperty: (listingId: string) => void;
}

const PropertyDirectory = ({ listings, onExpressInterest, onViewProperty }: PropertyDirectoryProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [bedrooms, setBedrooms] = useState<string>("any");
  const [propertyType, setPropertyType] = useState<string>("any");
  const [city, setCity] = useState<string>("any");

  // Get unique cities for filter
  const cities = Array.from(new Set(listings.map(l => l.city).filter(Boolean)));

  // Filter listings based on search criteria
  const filteredListings = listings.filter(listing => {
    const matchesSearch = !searchQuery || 
      listing.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPrice = listing.price && listing.price >= priceRange[0] && listing.price <= priceRange[1];
    const matchesBedrooms = bedrooms === "any" || listing.bedrooms === parseInt(bedrooms);
    const matchesType = propertyType === "any" || listing.property_type === propertyType;
    const matchesCity = city === "any" || listing.city === city;

    return matchesSearch && matchesPrice && matchesBedrooms && matchesType && matchesCity && listing.is_active;
  });

  const handleClearFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 10000]);
    setBedrooms("any");
    setPropertyType("any");
    setCity("any");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Properties</CardTitle>
        <CardDescription>
          Browse rental properties from verified landlords and agents
        </CardDescription>

        <PropertyFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          bedrooms={bedrooms}
          setBedrooms={setBedrooms}
          propertyType={propertyType}
          setPropertyType={setPropertyType}
          city={city}
          setCity={setCity}
          cities={cities}
          filteredCount={filteredListings.length}
          totalCount={listings.length}
          onClearFilters={handleClearFilters}
        />
      </CardHeader>
      <CardContent>
        <PropertyGrid
          listings={filteredListings}
          onExpressInterest={onExpressInterest}
          onViewProperty={onViewProperty}
        />
      </CardContent>
    </Card>
  );
};

export default PropertyDirectory;
