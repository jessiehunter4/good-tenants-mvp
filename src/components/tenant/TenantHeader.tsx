
import DashboardHeader from "@/components/shared/DashboardHeader";

interface TenantHeaderProps {
  email: string | undefined;
  onSignOut: () => void;
}

const TenantHeader = ({ email, onSignOut }: TenantHeaderProps) => {
  return (
    <DashboardHeader 
      email={email}
      onSignOut={onSignOut}
      role="tenant"
    />
  );
};

export default TenantHeader;
