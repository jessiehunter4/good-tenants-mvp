
import { Star } from "lucide-react";

const SocialProofSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Real Estate Agent",
      content: "Good Tenants has revolutionized how I find qualified renters. I've placed 15+ tenants in the last 6 months!",
      rating: 5
    },
    {
      name: "Mike Chen", 
      role: "Property Manager",
      content: "The pre-screening process saves me hours. I only see tenants who are actually qualified and ready to move.",
      rating: 5
    },
    {
      name: "Lisa Rodriguez",
      role: "Landlord",
      content: "Finally, a platform that brings quality tenants to me instead of me having to search through endless applications.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Professionals</h2>
          <p className="text-lg text-gray-600">Real estate agents and property managers across Southern California</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
