
import { User } from "lucide-react";
import { TenantProfile } from "@/types/profiles";
import EmptyState from "@/components/tenant/EmptyState";
import TenantCard from "./TenantCard";

interface TenantGridProps {
  tenants: TenantProfile[];
  onSendInvite: (tenantId: string) => void;
}

const TenantGrid = ({ tenants, onSendInvite }: TenantGridProps) => {
  if (tenants.length === 0) {
    return (
      <EmptyState
        icon={<User className="h-6 w-6 text-gray-400" />}
        title="No tenants found"
        description="No tenants match your search criteria."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tenants.map((tenant) => (
        <TenantCard 
          key={tenant.id}
          tenant={tenant} 
          onSendInvite={onSendInvite} 
        />
      ))}
    </div>
  );
};

export default TenantGrid;
