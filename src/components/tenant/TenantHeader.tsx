
import DashboardHeader from "@/components/shared/DashboardHeader";

interface TenantHeaderProps {
  email: string | undefined;
  onSignOut: () => void;
}

const TenantHeader = ({ email, onSignOut }: TenantHeaderProps) => {
  return (
    <DashboardHeader 
      title="Tenant Dashboard"
      subtitle="Manage your rental search and applications"
      email={email}
      onSignOut={onSignOut}
      role="tenant"
    />
  );
};

export default TenantHeader;
