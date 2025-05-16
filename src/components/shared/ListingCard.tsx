
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export interface ListingCardProps {
  id: string;
  address: string;
  city: string | null;
  state: string | null;
  zip: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: number;
  price: number;
  available_date: string;
  is_active: boolean;
  onEdit?: () => void;
  onFindTenants?: () => void;
  actionText?: string;
}

const ListingCard = ({
  id,
  address,
  city,
  state,
  zip,
  bedrooms,
  bathrooms,
  square_feet,
  price,
  available_date,
  is_active,
  onEdit,
  onFindTenants,
  actionText = "Find Tenants",
}: ListingCardProps) => {
  return (
    <Card key={id}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{address}</CardTitle>
            <CardDescription>
              {city}, {state} {zip}
            </CardDescription>
          </div>
          <Badge className={is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100'}>
            {is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-sm text-gray-500">Bedrooms</p>
            <p className="font-medium">{bedrooms}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Bathrooms</p>
            <p className="font-medium">{bathrooms}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Square Feet</p>
            <p className="font-medium">{square_feet.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Price</p>
            <p className="font-medium">${price.toLocaleString()}/month</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Available</p>
            <p className="font-medium">{new Date(available_date).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t">
        <div className="flex w-full gap-2">
          {onEdit && (
            <Button variant="outline" className="flex-1" onClick={onEdit}>
              Edit
            </Button>
          )}
          {onFindTenants && (
            <Button variant="default" className="flex-1" onClick={onFindTenants}>
              {actionText}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;
