
import { User } from "lucide-react";
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
import { TenantProfile } from "@/types/profiles";

interface TenantCardProps {
  tenant: TenantProfile;
  onSendInvite: (tenantId: string) => void;
}

const TenantCard = ({ tenant, onSendInvite }: TenantCardProps) => {
  const formattedIncome = (income: number | null) => {
    if (!income) return "Not specified";
    return `$${income.toLocaleString()}/month`;
  };

  return (
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
  );
};

export default TenantCard;
