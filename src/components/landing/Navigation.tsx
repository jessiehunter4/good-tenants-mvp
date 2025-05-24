
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building } from "lucide-react";

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <Building className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900">Good Tenants</span>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button 
          variant="outline" 
          onClick={() => navigate("/auth")}
          className="rounded-full border-2 hover:shadow-lg transition-all duration-300"
        >
          Sign In
        </Button>
        <Button 
          onClick={() => navigate("/summer")}
          className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Join Now
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;
