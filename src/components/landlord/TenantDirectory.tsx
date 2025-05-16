
import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TenantProfile } from "@/hooks/useLandlordData";

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
  
  const formattedIncome = (income: number | null) => {
    if (!income) return "Not specified";
    return `$${income.toLocaleString()}/month`;
  };
  
  const isVerified = profileStatus === "verified" || profileStatus === "premium";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenant Directory</CardTitle>
        <CardDescription>
          Browse through pre-screened, move-ready tenants.
        </CardDescription>

        <div className="mt-4 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by location, email, or description..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {isVerified ? (
          tenants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tenants.map((tenant) => (
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
                      <Badge className="bg-green-100 text-green-800">
                        Verified
                      </Badge>
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
                      Send Invitation
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No tenants found</h3>
              <p className="text-gray-500">
                No verified tenants match your search criteria.
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <User className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Verification Required</h3>
            <p className="text-gray-500 mb-4">
              You need to be verified to access the tenant directory.
            </p>
            <Button>
              Get Verified
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TenantDirectory;
