import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl, baseUrlHashless } from '../../utilities/Utilities.jsx';

const RecommendedServices = ({ recommendedPosition = 2 }) => {
  const [serviceCards, setServiceCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchCards = async () => {
      try {
        const res = await fetch(`${baseUrl}api/cards/`);
        if (!res.ok) throw new Error('Failed to fetch cards');
        const data = await res.json();
        if (!mounted) return;
        let parsed = (data.cards || [])
          .filter(c => c.card_active)
          .map(c => ({
            id: c.id,
            title: c.card_title,
            subtitle: c.card_subtitle,
            description: c.card_description,
            image: c.image,
            features: c.card_features ? c.card_features.split(',').map(f => f.trim()) : [],
            badge: c.card_badge,
            isRecommended: !!c.card_recommended,
            companySlug: c.company_slug
          }));

  // Positioning: `recommendedPosition` (1-based) controls where the recommended card should appear.
  // You can pass a prop to this component to change it, e.g. <RecommendedServices recommendedPosition={1} />
  const recIndex = parsed.findIndex(p => p.isRecommended);
        if (recIndex !== -1) {
          const [recCard] = parsed.splice(recIndex, 1);
          // compute desired index in the array after removal
          let desiredIndex = Math.max(0, Math.min(parsed.length, recommendedPosition - 1));
          // if the removed index was before the desired index, adjust desiredIndex
          if (recIndex < desiredIndex) desiredIndex = Math.max(0, desiredIndex - 1);
          parsed.splice(desiredIndex, 0, recCard);
        }

        setServiceCards(parsed);
      } catch (err) {
        console.error(err);
        if (mounted) setError(err.message || 'Failed to load cards');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCards();
    return () => { mounted = false };
  }, []);

  const handleCardClick = (companySlug) => {
    navigate(`/company-packages/${companySlug}`);
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#930B31] mb-4"></div>
          <p className="text-gray-600">Loading recommended services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

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
          <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-8">
            {serviceCards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.companySlug)}
                className={`group relative overflow-hidden rounded-lg lg:rounded-2xl shadow-lg transition-all duration-500 transform hover:xl:scale-105 hover:shadow-2xl cursor-pointer aspect-[1/2.75] md:aspect-[9/16] ${
            card.isRecommended 
              ? 'ring-4 ring-yellow-400 xl:scale-105 mb-1 ring-opacity-75 shadow-yellow-400/25' 
              : 'hover:shadow-xl'
                }`}
              >
                {/* Recommended Badge */}
              {card.isRecommended && (
                <div className="absolute top-1 left-1 sm:top-4 sm:left-4 z-20">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm shadow-lg animate-pulse">
                    <div className="flex items-center gap-2">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className='hidden lg:block'>{card.badge || 'Recommended'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={`${baseUrlHashless}${card.image}`}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/80"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-end py-6 px-3 sm:p-6 text-white">
                {/* Features Pills */}
                <div className="hidden xl:block mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                  <h3 className="text-base sm:text-2xl font-bold mb-2 text-shadow-lg inline-block leading-tight [writing-mode:sideways-lr] [text-orientation:upright] sm:[writing-mode:horizontal-tb]">
                  {card.title}
                  </h3>

                  <div className="">
                  <p className=" text-sm hidden xl:block sm:text-lg text-yellow-300 font-semibold mb-3 text-shadow">
                    {card.subtitle}
                  </p>
                  <p className="hidden xl:block text-sm text-gray-200 leading-relaxed opacity-90 text-shadow">
                    {card.description}
                  </p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-4 hidden xl:block opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <button className="w-full bg-[#930B31] hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                    View All Tickets
                  </button>
                </div>
              </div>

              {/* Glowing Border Animation for Recommended */}
              {card.isRecommended && (
                <div className="absolute inset-0 rounded-2xl">
                  <div className="absolute inset-0 rounded-lg xl:rounded-2xl border-4 border-yellow-400 opacity-75 animate-pulse"></div>
                  <div className="absolute inset-0 rounded-lg xl:rounded-2xl border-2 border-yellow-300 opacity-50 animate-ping"></div>
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