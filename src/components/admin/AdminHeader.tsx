
import DashboardHeader from "@/components/shared/DashboardHeader";

interface AdminHeaderProps {
  email: string | undefined;
  onSignOut: () => void;
}

const AdminHeader = ({ email, onSignOut }: AdminHeaderProps) => {
  return (
    <DashboardHeader 
      title="Admin Dashboard"
      subtitle="Manage users, properties, and system settings"
      email={email}
      onSignOut={onSignOut}
      role="admin"
    />
  );
};

export default AdminHeader;
