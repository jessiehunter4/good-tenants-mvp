
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Building, User } from "lucide-react";

const CTASection = () => {
  const navigate = useNavigate();

  const trustItems = [
    { icon: Check, text: "Verified Profiles" },
    { icon: Building, text: "Quality Properties" },
    { icon: User, text: "Trusted Network" }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Become a Good Tenant</h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Join thousands of renters who get invited to quality properties instead of competing with hundreds of applications.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            onClick={() => navigate("/auth?tab=register")}
            className="rounded-full bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Start Your Profile - It's Free
          </Button>
        </div>

        {/* Trust Icons */}
        <div className="flex items-center justify-center space-x-8 opacity-75">
          {trustItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
