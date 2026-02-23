import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaCheckCircle, FaShieldAlt, FaCreditCard, FaTag, FaClock, FaBus, FaTicketAlt } from 'react-icons/fa';
import GlobalSEO from '../Components/GlobalSEO';
import FeaturedOffersManager from '../Components/EditPanel/FeaturedOffersManager';
import useEditorCheck from '../hooks/useEditorCheck';
import useStaticContent from '../hooks/useStaticContent';
import SEO from '../Components/SEO/SEO';
import EditPanelSheet from '../Components/EditPanel/EditPanelSheet';
import { baseUrl, baseUrlHashless } from '../utilities/Utilities';
import OptimizedImage from '../Components/OptimizedImage/OptimizedImage';

const FeaturedOffer = () => {
  const navigate = useNavigate();
  const { isEditor } = useEditorCheck();
  const staticContentData = useStaticContent('featured-offers');
  const { refreshContent } = staticContentData;
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch(`${baseUrl}featured-offers/`);
      const data = await response.json();
      if (data.status === 200) {
        setOffers(data.data);
      } else {
        setError('Failed to load offers');
      }
    } catch (err) {
      setError('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (offer) => {
    // Navigate to ticket details page with offer info
    // Status is E9 for bus packages, E8 for museum packages
    const status = offer.package_type === 'bus' ? 'E9' : 'E8';
    const url = `/manageBookings/${status}/${offer.package_tag}?offer_id=${offer.id}`;
    navigate(url);
  };

  const getDiscountPercentage = (original, discounted) => {
    if (!original || !discounted) return 0;
    return Math.round(((original - discounted) / original) * 100);
  };

  // Format countdown timer
  const formatTimeRemaining = (seconds) => {
    if (!seconds || seconds <= 0) return null;
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // Schema.org structured data for offers
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Limited-Time Rome Sightseeing Offers",
    "description": "Discover exclusive discounts on hop-on hop-off buses, city passes, and top Rome attractions.",
    "itemListElement": offers.map((offer, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Offer",
        "name": offer.offer_title || offer.package_title,
        "description": offer.offer_description,
        "price": offer.offer_adult_price,
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "validThrough": offer.offer_end,
        "seller": {
          "@type": "Organization",
          "name": "SightseeingRoma"
        }
      }
    }))
  };

  return (
    <>
      {/* Dynamic SEO from server */}
      <SEO 
        staticContentData={staticContentData} 
        defaultTitle="Limited-Time Rome Sightseeing Offers | Exclusive Deals - SightseeingRoma"
        defaultDescription="Discover exclusive discounts on hop-on hop-off buses, city passes, and top Rome attractions. Limited-time Rome sightseeing deals with verified operators and secure booking."
      />
      
      {/* Schema.org structured data for offers */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>
      
      {/* Editor Panel */}
      <EditPanelSheet 
        isEditor={isEditor} 
        page="featured-offers" 
        refreshContent={refreshContent} 
        metaInfo={staticContentData?.pageData} 
      />

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-[#930B31] via-[#7a0926] to-[#5a071c] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FAD502] rounded-full translate-x-1/4 translate-y-1/4"></div>
        </div>
        
        <div className="container mx-auto px-4 pt-24 pb-8 md:pt-32 md:pb-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Limited-Time Rome Sightseeing Offers
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover exclusive discounts on hop-on hop-off buses, city passes, and top Rome attractions. These offers change frequently — don't miss out.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-row flex-wrap sm:flex-row items-center justify-center gap-4 sm:gap-8 text-white/90">
              <div className="flex items-center gap-2">
                <div className="flex text-[#FAD502]">
                  {[...Array(5)].map((_, i) => <FaStar key={i} className="text-sm" />)}
                </div>
                <span className="text-sm">Trusted Rome Tickets</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-400" />
                <span className="text-sm">Verified Operators</span>
              </div>
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-green-400" />
                <span className="text-sm">Secure Booking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVE OFFERS GRID */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Current Rome Sightseeing Deals
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Grab these exclusive offers before they expire. New deals added regularly.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                  <div className="h-32 md:h-48 bg-gray-200"></div>
                  <div className="p-4 md:p-6">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">{error}</p>
            </div>
          ) : offers.length === 0 ? (
            <div className="text-center py-12">
              <FaTicketAlt className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No active offers at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
              {offers.map((offer) => (
                <div 
                  key={offer.id} 
                  className="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
                  onClick={() => handleBookNow(offer)}
                >
                  {/* Image Section */}
                  <div className="relative h-28 sm:h-36 md:h-48 overflow-hidden">
                    <OptimizedImage 
                      src={offer.offer_image_url ? `${baseUrlHashless}${offer.offer_image_url}` : (offer.package_thumbnail ? `${baseUrlHashless}${offer.package_thumbnail}` : '/placeholder.jpg')}
                      alt={offer.offer_title || offer.package_title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      wrapperClassName="w-full h-full"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    {/* Badge */}
                    <div className="absolute top-2 md:top-4 left-2 md:left-4">
                      <span className="bg-[#FAD502] text-[#930B31] font-bold text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full shadow-md">
                        {offer.badge_text || 'Limited-Time Offer'}
                      </span>
                    </div>
                    {/* Discount Badge */}
                    {offer.original_adult_price && offer.offer_adult_price && parseFloat(offer.original_adult_price) > parseFloat(offer.offer_adult_price) && (
                      <div className="absolute top-2 md:top-4 right-2 md:right-4">
                        <span className="bg-[#930B31] text-white font-bold text-[10px] md:text-sm px-2 md:px-3 py-1 md:py-1.5 rounded-full shadow-md">
                          {getDiscountPercentage(offer.original_adult_price, offer.offer_adult_price)}% OFF
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-3 md:p-5">
                    {/* Timer */}
                    {offer.time_remaining > 0 && (
                      <div className="flex items-center gap-1.5 mb-2 text-xs md:text-sm">
                        <FaClock className="text-[#930B31]" />
                        <span className="text-gray-600">Ends in:</span>
                        <span className="font-bold text-[#930B31]">{formatTimeRemaining(offer.time_remaining)}</span>
                      </div>
                    )}

                    {/* Company */}
                    {offer.company_name && (
                      <p className="text-[10px] md:text-xs text-gray-500 mb-1">{offer.company_name}</p>
                    )}

                    {/* Title */}
                    <h3 className="text-sm md:text-lg font-bold text-gray-800 mb-1 md:mb-2 group-hover:text-[#930B31] transition-colors line-clamp-2">
                      {offer.offer_title || offer.package_title}
                    </h3>

                    {/* Description - hidden on mobile */}
                    <p className="hidden md:block text-gray-600 text-sm mb-3 line-clamp-2">
                      {offer.offer_description}
                    </p>

                    {/* Price Section */}
                    <div className="flex items-center justify-between mb-2 md:mb-4">
                      <div className="flex items-baseline gap-1 md:gap-2">
                        <span className="text-lg md:text-2xl font-bold text-[#930B31]">
                          €{offer.offer_adult_price}
                        </span>
                        {offer.original_adult_price && parseFloat(offer.original_adult_price) > parseFloat(offer.offer_adult_price) && (
                          <span className="text-xs md:text-sm text-gray-400 line-through">
                            €{offer.original_adult_price}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] md:text-xs text-gray-500">
                        per person
                      </span>
                    </div>

                    {/* Offer Details - hidden on mobile */}
                    <div className="hidden md:flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <FaCheckCircle className="text-green-500" />
                        <span>Valid for limited time</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      className="w-full bg-[#930B31] hover:bg-[#7a0926] text-white font-bold py-2 md:py-3 px-3 md:px-6 rounded-full transition-colors duration-300 flex items-center justify-center gap-1 md:gap-2 text-xs md:text-base"
                    >
                      <FaTag className="text-xs md:text-base" />
                      <span className="hidden sm:inline">Book Now & Save</span>
                      <span className="sm:hidden">Book Now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHY THESE OFFERS ARE TRUSTWORTHY */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Why Book With Us?
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-14 h-14 bg-[#930B31]/10 rounded-full flex items-center justify-center mb-3">
                <FaBus className="text-2xl text-[#930B31]" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">Official Operators</h3>
              <p className="text-xs text-gray-600">Direct partnerships with Rome's top sightseeing companies</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-14 h-14 bg-[#930B31]/10 rounded-full flex items-center justify-center mb-3">
                <FaTag className="text-2xl text-[#930B31]" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">Transparent Pricing</h3>
              <p className="text-xs text-gray-600">What you see is what you pay</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-14 h-14 bg-[#930B31]/10 rounded-full flex items-center justify-center mb-3">
                <FaCheckCircle className="text-2xl text-[#930B31]" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">No Hidden Fees</h3>
              <p className="text-xs text-gray-600">Zero surprise charges at checkout</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-14 h-14 bg-[#930B31]/10 rounded-full flex items-center justify-center mb-3">
                <FaCreditCard className="text-2xl text-[#930B31]" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">Secure Payments</h3>
              <p className="text-xs text-gray-600">SSL encrypted transactions</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW OFTEN OFFERS CHANGE (URGENCY) */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <FaClock className="text-4xl text-[#930B31] mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Offers Change Frequently
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our featured sightseeing offers change every few days based on availability and seasonal demand. 
              We recommend booking early to secure discounted prices. Once an offer expires, it may not return 
              at the same price.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-[#930B31] to-[#7a0926]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Explore Rome for Less — While Offers Last
            </h2>
            <p className="text-white/90 mb-8 text-lg">
              Don't miss out on exclusive Rome sightseeing deals. Book now and save!
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 bg-[#FAD502] hover:bg-white text-[#930B31] font-bold py-4 px-8 rounded-full transition-colors duration-300 text-lg shadow-lg"
            >
              <FaTicketAlt />
              View All Rome Tickets
            </button>
          </div>
        </div>
      </section>

      {/* Editor Controls */}
      <FeaturedOffersManager isEditor={isEditor} />
    </>
  );
};

export default FeaturedOffer;
