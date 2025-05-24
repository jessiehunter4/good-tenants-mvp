
import { Play } from "lucide-react";

const VideoSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">See Good Tenants in Action</h2>
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-12 shadow-lg">
            <div className="aspect-video bg-white rounded-xl shadow-inner flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <p className="text-lg text-gray-600">Interactive Demo Coming Soon</p>
                <p className="text-sm text-gray-500 mt-2">Watch how tenants and agents connect seamlessly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
