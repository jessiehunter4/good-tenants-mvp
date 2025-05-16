
import DashboardHeader from "@/components/shared/DashboardHeader";

interface AgentHeaderProps {
  email: string | undefined;
  onSignOut: () => void;
}

const AgentHeader = ({ email, onSignOut }: AgentHeaderProps) => {
  return (
    <DashboardHeader 
      email={email}
      onSignOut={onSignOut}
      role="agent"
    />
  );
};

export default AgentHeader;
