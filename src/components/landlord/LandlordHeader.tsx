
import { Button } from "@/components/ui/button";

interface LandlordHeaderProps {
  email: string | undefined;
  onSignOut: () => void;
}

const LandlordHeader = ({ email, onSignOut }: LandlordHeaderProps) => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-900">Good Tenants</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">{email}</span>
          <Button variant="outline" onClick={onSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default LandlordHeader;
