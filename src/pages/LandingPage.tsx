
import { useState, useEffect } from "react";
import Navigation from "@/components/landing/Navigation";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import SocialProofSection from "@/components/landing/SocialProofSection";
import VideoSection from "@/components/landing/VideoSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      <Navigation />
      <HeroSection isVisible={isVisible} />
      <HowItWorksSection isVisible={isVisible} />
      <SocialProofSection />
      <VideoSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
