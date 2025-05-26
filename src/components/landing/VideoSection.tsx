
import InteractiveDemo from "./InteractiveDemo";

const VideoSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            See How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Watch how tenants, landlords, and agents connect seamlessly on our platform. 
            Skip the endless searching and application competition - experience direct, quality connections.
          </p>
        </div>
        
        <InteractiveDemo />
      </div>
    </section>
  );
};

export default VideoSection;
