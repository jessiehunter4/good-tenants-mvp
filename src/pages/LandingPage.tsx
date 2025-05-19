
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { User, Briefcase, Building } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    navigate(`/auth?role=${role}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-6">
              Good Tenants
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The best way to connect pre-screened tenants with quality housing
            </p>
            
            {/* Summer campaign banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex flex-col md:flex-row items-center justify-between max-w-3xl mx-auto">
              <div className="text-left mb-4 md:mb-0">
                <h3 className="text-lg font-bold text-blue-900">Moving this summer?</h3>
                <p className="text-blue-700">Find your next rental faster with our new summer program</p>
              </div>
              <Button 
                onClick={() => navigate('/summer')} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                Learn More
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div 
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedRole === "tenant" 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
                onClick={() => handleRoleSelect("tenant")}
              >
                <div className="flex flex-col items-center gap-4">
                  <User size={48} className="text-blue-600" />
                  <h3 className="text-xl font-semibold">I'm a Tenant</h3>
                  <p className="text-gray-500 text-center">Looking for a quality home to rent</p>
                </div>
              </div>
              
              <div 
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedRole === "agent" 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
                onClick={() => handleRoleSelect("agent")}
              >
                <div className="flex flex-col items-center gap-4">
                  <Briefcase size={48} className="text-blue-600" />
                  <h3 className="text-xl font-semibold">I'm a Realtor</h3>
                  <p className="text-gray-500 text-center">Looking to place qualified tenants</p>
                </div>
              </div>
              
              <div 
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedRole === "landlord" 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
                onClick={() => handleRoleSelect("landlord")}
              >
                <div className="flex flex-col items-center gap-4">
                  <Building size={48} className="text-blue-600" />
                  <h3 className="text-xl font-semibold">I'm a Landlord</h3>
                  <p className="text-gray-500 text-center">Looking for reliable tenants</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/auth")}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-12 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Tenants */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-4">For Tenants</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Get pre-screened with minimal information</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Receive invitations from agents and landlords</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Match faster with properties that fit your needs</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" onClick={() => handleRoleSelect("tenant")}>
                Sign Up as Tenant
              </Button>
            </div>

            {/* For Agents */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-4">For Agents</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Browse pre-screened tenant profiles</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Send invitations to qualified tenants</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Lease your MLS listings faster</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" onClick={() => handleRoleSelect("agent")}>
                Sign Up as Agent
              </Button>
            </div>

            {/* For Landlords */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-4">For Landlords</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Find pre-screened tenants easily</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>List your properties with minimal effort</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Reduce vacancy times with qualified tenants</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" onClick={() => handleRoleSelect("landlord")}>
                Sign Up as Landlord
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join Good Tenants today and find your perfect match.
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
            Sign Up Now
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} Good Tenants Services, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
