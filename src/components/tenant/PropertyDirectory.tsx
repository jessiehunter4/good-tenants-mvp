
import { useState } from "react";
import { Search, MapPin, DollarSign, Home, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Listing } from "@/types/listings";
import EmptyState from "./EmptyState";

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

  const formatPrice = (price: number) => `$${price.toLocaleString()}/month`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Properties</CardTitle>
        <CardDescription>
          Browse rental properties from verified landlords and agents
        </CardDescription>

        {/* Search and Filters */}
        <div className="space-y-4 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by address, city, or description..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Price Range</label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={10000}
                min={0}
                step={100}
                className="mb-2"
              />
              <div className="text-xs text-gray-500">
                ${priceRange[0]} - ${priceRange[1]}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Bedrooms</label>
              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="0">Studio</SelectItem>
                  <SelectItem value="1">1 Bedroom</SelectItem>
                  <SelectItem value="2">2 Bedrooms</SelectItem>
                  <SelectItem value="3">3 Bedrooms</SelectItem>
                  <SelectItem value="4">4+ Bedrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Property Type</label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Type</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="townhouse_condo">Townhouse/Condo</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">City</label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any City</SelectItem>
                  {cities.map(cityName => (
                    <SelectItem key={cityName} value={cityName}>{cityName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Showing {filteredListings.length} of {listings.length} properties</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setPriceRange([0, 10000]);
                setBedrooms("any");
                setPropertyType("any");
                setCity("any");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{listing.address}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {listing.city}, {listing.state} {listing.zip}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {listing.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                      )}
                      <Badge className="bg-green-100 text-green-800">Available</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <Home className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">
                        {listing.bedrooms} bed, {listing.bathrooms} bath
                      </span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm font-medium">
                        {listing.price ? formatPrice(listing.price) : 'Price on request'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">
                        Available: {listing.available_date ? formatDate(listing.available_date) : 'Now'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {listing.square_feet ? `${listing.square_feet.toLocaleString()} sq ft` : 'Size not specified'}
                    </div>
                  </div>

                  {listing.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {listing.description}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => onViewProperty(listing.id)}
                    >
                      View Details
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={() => onExpressInterest(listing.id)}
                    >
                      Express Interest
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Home className="h-8 w-8 text-gray-400" />}
            title="No properties found"
            description="No properties match your search criteria. Try adjusting your filters."
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyDirectory;
