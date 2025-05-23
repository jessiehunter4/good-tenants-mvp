
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, Shield } from "lucide-react";

interface ProfileVerificationBadgeProps {
  status: string;
  userRole: 'tenant' | 'landlord' | 'agent';
  isVerified?: boolean;
  licenseNumber?: string;
}

const ProfileVerificationBadge = ({ 
  status, 
  userRole, 
  isVerified = false, 
  licenseNumber 
}: ProfileVerificationBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'verified':
      case 'premium':
        return {
          icon: CheckCircle,
          text: userRole === 'agent' ? 'Licensed Agent' : 'Verified',
          className: 'bg-green-100 text-green-800',
        };
      case 'pending':
        return {
          icon: Clock,
          text: 'Verification Pending',
          className: 'bg-yellow-100 text-yellow-800',
        };
      case 'incomplete':
        return {
          icon: AlertCircle,
          text: 'Profile Incomplete',
          className: 'bg-gray-100 text-gray-800',
        };
      default:
        return {
          icon: AlertCircle,
          text: 'Basic Profile',
          className: 'bg-gray-100 text-gray-800',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="flex gap-2">
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
      
      {userRole === 'agent' && licenseNumber && (
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          <Shield className="h-3 w-3 mr-1" />
          License: {licenseNumber}
        </Badge>
      )}
      
      {isVerified && (
        <Badge className="bg-blue-100 text-blue-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Background Verified
        </Badge>
      )}
    </div>
  );
};

export default ProfileVerificationBadge;
