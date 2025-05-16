
import { Building, Plus } from "lucide-react";
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
import { Listing } from "@/hooks/useLandlordData";

interface ListingsSectionProps {
  listings: Listing[];
}

const ListingsSection = ({ listings }: ListingsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Properties</CardTitle>
        <CardDescription>
          Manage your property listings here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listings.map((listing) => (
              <Card key={listing.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{listing.address}</CardTitle>
                      <CardDescription>
                        {listing.city}, {listing.state} {listing.zip}
                      </CardDescription>
                    </div>
                    <Badge className={listing.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100'}>
                      {listing.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <p className="text-sm text-gray-500">Bedrooms</p>
                      <p className="font-medium">{listing.bedrooms}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bathrooms</p>
                      <p className="font-medium">{listing.bathrooms}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Square Feet</p>
                      <p className="font-medium">{listing.square_feet.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium">${listing.price.toLocaleString()}/month</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Available</p>
                      <p className="font-medium">{new Date(listing.available_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t">
                  <div className="flex w-full gap-2">
                    <Button variant="outline" className="flex-1">
                      Edit
                    </Button>
                    <Button variant="default" className="flex-1">
                      Find Tenants
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Building className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No properties yet</h3>
            <p className="text-gray-500 mb-4">
              Add your first property listing to start finding tenants.
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ListingsSection;
