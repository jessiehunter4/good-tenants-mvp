
import DashboardHeader from "@/components/shared/DashboardHeader";

interface LandlordHeaderProps {
  email: string | undefined;
  onSignOut: () => void;
}

const LandlordHeader = ({ email, onSignOut }: LandlordHeaderProps) => {
  return (
    <DashboardHeader 
      email={email}
      onSignOut={onSignOut}
      role="landlord"
    />
  );
};

export default LandlordHeader;
