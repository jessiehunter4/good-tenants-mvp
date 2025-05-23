
import DashboardHeader from "@/components/shared/DashboardHeader";

interface LandlordHeaderProps {
  email: string | undefined;
  onSignOut: () => void;
}

const LandlordHeader = ({ email, onSignOut }: LandlordHeaderProps) => {
  return (
    <DashboardHeader 
      title="Landlord Dashboard"
      subtitle="Find quality tenants and manage your properties"
      email={email}
      onSignOut={onSignOut}
      role="landlord"
    />
  );
};

export default LandlordHeader;
