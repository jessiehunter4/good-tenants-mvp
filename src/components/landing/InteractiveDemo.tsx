
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  Users, 
  Building, 
  UserCheck, 
  MessageCircle, 
  Send, 
  CheckCircle,
  ArrowRight,
  Home,
  DollarSign,
  Star
} from "lucide-react";

interface DemoStep {
  id: number;
  title: string;
  description: string;
  perspective: 'tenant' | 'landlord' | 'agent';
  content: React.ReactNode;
}

const InteractiveDemo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPerspective, setSelectedPerspective] = useState<'tenant' | 'landlord' | 'agent'>('tenant');

  const demoSteps: DemoStep[] = [
    {
      id: 1,
      title: "Tenant Creates Verified Profile",
      description: "Tenants complete their profile with income verification, preferences, and move-in timeline",
      perspective: 'tenant',
      content: (
        <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold">Sarah Johnson</h4>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Income:</span>
              <span className="font-medium">$8,500/month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Move-in:</span>
              <span className="font-medium">30 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bedrooms:</span>
              <span className="font-medium">3-4 BR</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Browse Pre-Screened Tenants",
      description: "Landlords and agents access the verified tenant directory to find qualified candidates",
      perspective: selectedPerspective === 'tenant' ? 'landlord' : selectedPerspective,
      content: (
        <div className="bg-white rounded-lg p-4 shadow-lg max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Tenant Directory</h4>
            <Badge variant="outline">15 Pre-Screened</Badge>
          </div>
          <div className="space-y-3">
            {[
              { name: "Sarah Johnson", income: "$8.5k", move: "30 days", verified: true },
              { name: "Mike Chen", income: "$9.2k", move: "45 days", verified: true },
              { name: "Lisa Rodriguez", income: "$7.8k", move: "60 days", verified: true }
            ].map((tenant, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{tenant.name}</p>
                    <p className="text-xs text-gray-500">{tenant.income} • {tenant.move}</p>
                  </div>
                </div>
                {tenant.verified && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Send Property Invitation",
      description: "Select qualified tenants and send them invitations to view specific properties",
      perspective: selectedPerspective === 'tenant' ? 'landlord' : selectedPerspective,
      content: (
        <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Home className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold">Modern 3BR Home</h4>
            </div>
            <p className="text-lg font-bold text-green-600">$3,200/month</p>
            <p className="text-sm text-gray-600">Irvine, CA • 3 bed • 2 bath</p>
          </div>
          <div className="border-t pt-3">
            <p className="text-sm font-medium mb-2">Invite Sarah Johnson?</p>
            <Button size="sm" className="w-full">
              <Send className="w-4 h-4 mr-2" />
              Send Invitation
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Tenant Receives Invitation",
      description: "Tenants get invited to quality properties instead of competing with hundreds of applications",
      perspective: 'tenant',
      content: (
        <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Building className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-sm">Property Invitation</p>
              <p className="text-xs text-gray-500">From Johnson Properties</p>
            </div>
          </div>
          <div className="mb-4">
            <h4 className="font-semibold">Modern 3BR Home</h4>
            <p className="text-lg font-bold text-green-600">$3,200/month</p>
            <p className="text-sm text-gray-600">Irvine, CA</p>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="flex-1">
              Decline
            </Button>
            <Button size="sm" className="flex-1">
              Accept & Message
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Direct Communication",
      description: "Both parties connect via secure messaging to coordinate showings and finalize details",
      perspective: 'tenant',
      content: (
        <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
          <div className="flex items-center space-x-2 mb-3">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-sm">Chat with Johnson Properties</h4>
          </div>
          <div className="space-y-2 mb-3">
            <div className="bg-gray-100 rounded-lg p-2">
              <p className="text-xs text-gray-600">Johnson Properties</p>
              <p className="text-sm">Hi Sarah! Thanks for your interest. When would you like to schedule a showing?</p>
            </div>
            <div className="bg-blue-100 rounded-lg p-2 ml-4">
              <p className="text-xs text-blue-600">You</p>
              <p className="text-sm">Great! I'm available this weekend. Saturday afternoon works best.</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input 
              className="flex-1 text-sm border rounded px-2 py-1" 
              placeholder="Type your message..."
              readOnly
            />
            <Button size="sm">
              <Send className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % demoSteps.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, demoSteps.length]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setIsPlaying(false);
  };

  const benefits = {
    tenant: [
      "Get invited instead of applying",
      "Access quality properties first",
      "Skip the competition"
    ],
    landlord: [
      "Find pre-screened tenants",
      "Reduce vacancy time",
      "Quality over quantity"
    ],
    agent: [
      "Close deals faster",
      "Access verified renters",
      "Build strong client relationships"
    ]
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Perspective Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-full p-1 shadow-lg">
          {(['tenant', 'landlord', 'agent'] as const).map((perspective) => (
            <Button
              key={perspective}
              variant={selectedPerspective === perspective ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedPerspective(perspective)}
              className="rounded-full mx-1 capitalize"
            >
              {perspective === 'tenant' && <Users className="w-4 h-4 mr-2" />}
              {perspective === 'landlord' && <Building className="w-4 h-4 mr-2" />}
              {perspective === 'agent' && <UserCheck className="w-4 h-4 mr-2" />}
              {perspective}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Demo Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Demo Visualization */}
        <div className="order-2 lg:order-1">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center space-x-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={togglePlay}
                    className="rounded-full"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  <span className="text-sm font-medium">
                    Step {currentStep + 1} of {demoSteps.length}
                  </span>
                </div>
              </div>

              {/* Demo Content */}
              <div className="min-h-[300px] flex items-center justify-center">
                {demoSteps[currentStep].content}
              </div>

              {/* Step Indicators */}
              <div className="flex justify-center space-x-2 mt-6">
                {demoSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToStep(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentStep 
                        ? 'bg-blue-600' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Step Description & Benefits */}
        <div className="order-1 lg:order-2">
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {currentStep + 1}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {demoSteps[currentStep].title}
              </h3>
            </div>
            <p className="text-lg text-gray-600 mb-6">
              {demoSteps[currentStep].description}
            </p>
          </div>

          {/* Benefits for Current Perspective */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h4 className="font-semibold text-gray-900 mb-4 capitalize">
              Benefits for {selectedPerspective}s:
            </h4>
            <ul className="space-y-3">
              {benefits[selectedPerspective].map((benefit, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Call to Action */}
          <div className="mt-6">
            <Button size="lg" className="w-full rounded-full">
              Get Started as {selectedPerspective === 'tenant' ? 'a Tenant' : selectedPerspective === 'landlord' ? 'a Landlord' : 'an Agent'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveDemo;
