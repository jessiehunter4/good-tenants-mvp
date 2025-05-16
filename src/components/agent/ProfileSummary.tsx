
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { RealtorProfile } from "@/hooks/useAgentData";

interface ProfileSummaryProps {
  profile: RealtorProfile;
}

const ProfileSummary = ({ profile }: ProfileSummaryProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Welcome, Agent</CardTitle>
            <CardDescription>
              {profile.agency ? `${profile.agency}` : "Complete your profile details"}
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
            <h3 className="font-medium text-gray-700">License Number</h3>
            <p>{profile.license_number || 'Not specified'}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Agency/Brokerage</h3>
            <p>{profile.agency || 'Not specified'}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Years of Experience</h3>
            <p>{profile.years_experience !== null ? profile.years_experience : 'Not specified'}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => navigate("/onboard-agent")}>
          Update Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileSummary;
