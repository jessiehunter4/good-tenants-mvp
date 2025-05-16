
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LandlordProfile } from "@/hooks/useLandlordData";

interface ProfileSummaryProps {
  profile: LandlordProfile;
}

const ProfileSummary = ({ profile }: ProfileSummaryProps) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Welcome, Landlord</CardTitle>
            <CardDescription>
              {profile.property_count ? `Managing ${profile.property_count} properties` : "Complete your profile details"}
            </CardDescription>
          </div>
          <Badge className={
            profile.status === 'verified' || profile.status === 'premium' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }>
            {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-700">Properties Owned</h3>
            <p>{profile.property_count || 'Not specified'}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Management Type</h3>
            <p>{profile.management_type === 'self_managed' ? 'Self-managed' : profile.management_type === 'property_manager' ? 'Property Manager' : 'Not specified'}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Years of Experience</h3>
            <p>{profile.years_experience !== null ? profile.years_experience : 'Not specified'}</p>
          </div>
          {profile.preferred_tenant_criteria && (
            <div className="col-span-2">
              <h3 className="font-medium text-gray-700">Preferred Tenant Criteria</h3>
              <p className="text-sm">{profile.preferred_tenant_criteria}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => navigate("/onboard-landlord")}>
          Update Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileSummary;
