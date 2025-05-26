
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  isVisible: boolean;
}

const HeroSection = ({ isVisible }: HeroSectionProps) => {
  const navigate = useNavigate();

  return (
    <section className="relative px-6 py-16 max-w-7xl mx-auto">
      <div className={`text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Find Your Perfect
          <span className="block bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Rental Match
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Connect pre-screened tenants with quality housing. 
          Skip the endless searching and get invited to your next home.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Join Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate("/summer")}
            className="rounded-full border-2 px-8 py-4 text-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            <Play className="mr-2 w-5 h-5" />
            See How It Works
          </Button>
        </div>

        {/* Floating Animation Elements */}
        <div className="relative">
          <div className={`absolute -top-20 -left-20 w-32 h-32 bg-blue-100 rounded-full opacity-50 transition-all duration-2000 ${isVisible ? 'animate-bounce' : ''}`} style={{animationDelay: '0.5s'}}></div>
          <div className={`absolute -top-10 -right-32 w-24 h-24 bg-indigo-100 rounded-full opacity-40 transition-all duration-2000 ${isVisible ? 'animate-bounce' : ''}`} style={{animationDelay: '1s'}}></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
