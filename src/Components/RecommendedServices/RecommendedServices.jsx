import React from 'react';

const RecommendedServices = () => {
  const serviceCards = [
    {
      id: 1,
      title: "Big Bus Rome",
      subtitle: "Premium Sightseeing",
      description: "Explore Rome's iconic landmarks with our premium double-decker buses featuring live commentary and unlimited hop-on hop-off access.",
      image: "https://sightseeingroma.com/assets/Big-Bus-Page-Hero-Image-a01d28e0.jpg", // You can replace with actual bus images
      isRecommended: false,
      features: ["Live Commentary", "Free WiFi", "Multilingual Audio"]
    },
    {
      id: 2,
      title: "Green Line Tours",
      subtitle: "Eco-Friendly Adventure",
      description: "Discover Rome sustainably with our eco-friendly buses covering all major attractions with flexible timing and routes.",
      image: "https://sightseeingroma.com/assets/GreenLine-Bus-Hero-Image-8b913ddc.jpg",
      isRecommended: true,
      badge: "Recommended",
      features: ["Eco-Friendly", "Flexible Routes", "All Major Sites"]
    },
    {
      id: 3,
      title: "City Sightseeing",
      subtitle: "Classic Rome Experience",
      description: "The traditional way to see Rome with our classic red buses, professional guides, and comprehensive city coverage.",
      image: "https://sightseeingroma.com/assets/CitySightSeeing-Bus-Hero-Image-4adc37a7.jpg",
      isRecommended: false,
      features: ["Professional Guides", "Comprehensive Coverage", "Classic Experience"]
    },
    {
      id: 4,
      title: "I Love Rome",
      subtitle: "Authentic Local Tours",
      description: "Experience Rome like a local with intimate group tours, hidden gems, and authentic Italian hospitality.",
      image: "https://sightseeingroma.com/assets/I-Love-Rome-Bus-Hero-Image-1f39291f.jpg",
      isRecommended: false,
      features: ["Local Experience", "Hidden Gems", "Small Groups"]
    }
  ];

  return (
    <div className="py-12 mb-5 rounded-2xl bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-2 sm:px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Perfect 
            <span className="text-[#930B31]"> Rome Experience</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the Eternal City with our premium bus services, each offering unique perspectives and unforgettable memories.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-8">
          {serviceCards.map((card) => (
            <div
              key={card.id}
              className={`group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 transform hover:scale-105 hover:shadow-2xl ${
                card.isRecommended 
                  ? 'ring-4 ring-yellow-400 scale-105 mb-1 ring-opacity-75 shadow-yellow-400/25' 
                  : 'hover:shadow-xl'
              }`}
              style={{ aspectRatio: '9/16' }}
            >
              {/* Recommended Badge */}
              {card.isRecommended && (
                <div className="absolute top-3 left-2 sm:top-4 sm:left-4 z-20">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm shadow-lg animate-pulse">
                    <div className="flex items-center gap-2">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {card.badge}
                    </div>
                  </div>
                </div>
              )}

              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/80"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-end py-6 px-3 sm:p-6 text-white">
                {/* Features Pills */}
                <div className="hidden sm:block mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex flex-wrap gap-2">
                    {card.features.map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full border border-white/30"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Main Content */}
                <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                  <h3 className="text-base sm:text-2xl font-bold mb-2 text-shadow-lg">
                    {card.title}
                  </h3>
                  <p className=" text-sm sm:text-lg text-yellow-300 font-semibold mb-3 text-shadow">
                    {card.subtitle}
                  </p>
                  <p className="hidden sm:block text-sm text-gray-200 leading-relaxed opacity-90 text-shadow">
                    {card.description}
                  </p>
                </div>

                {/* CTA Button */}
                <div className="mt-4 hidden sm:block opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <button className="w-full bg-[#930B31] hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Explore Tours
                  </button>
                </div>
              </div>

              {/* Glowing Border Animation for Recommended */}
              {card.isRecommended && (
                <div className="absolute inset-0 rounded-2xl">
                  <div className="absolute inset-0 rounded-2xl border-4 border-yellow-400 opacity-75 animate-pulse"></div>
                  <div className="absolute inset-0 rounded-2xl border-2 border-yellow-300 opacity-50 animate-ping"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .text-shadow {
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
        }
        .text-shadow-lg {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
        }
      `}</style>
    </div>
  );
};

export default RecommendedServices;