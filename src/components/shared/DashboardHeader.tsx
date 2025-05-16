
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  email: string | undefined;
  onSignOut: () => void;
  role?: 'admin' | 'agent' | 'landlord' | 'tenant';
  className?: string;
}

const DashboardHeader = ({ 
  email, 
  onSignOut, 
  role,
  className 
}: DashboardHeaderProps) => {
  const getTitleSuffix = () => {
    if (role === 'admin') return ' Admin';
    return '';
  };

  return (
    <header className={cn("bg-white shadow", className)}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-900">
          Good Tenants{getTitleSuffix()}
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">
            {email}{role === 'admin' ? ' (Admin)' : ''}
          </span>
          <Button variant="outline" onClick={onSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
