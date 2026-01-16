import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaArrowRight, FaShieldAlt, FaCheckCircle, FaCreditCard, FaTag, FaTicketAlt, FaStar, FaClock, FaPercent } from 'react-icons/fa';
import GlobalSEO from '../Components/GlobalSEO';
import CountdownTimer from '../Components/CountdownTimer/CountdownTimer';
import { baseUrl, baseUrlHashless } from '../utilities/Utilities';
import useEditorCheck from '../hooks/useEditorCheck';

const FeaturedOffersPage = () => {
    const navigate = useNavigate();
    const { isEditor } = useEditorCheck();
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            const response = await fetch(`${baseUrl}featured-offers/`);
            const data = await response.json();
            if (data.status === 200) {
                setOffers(data.data);
            } else {
                setError('No offers available');
            }
        } catch (err) {
            console.error('Error fetching offers:', err);
            setError('Failed to load offers');
        } finally {
            setLoading(false);
        }
    };

    const handleBookNow = (offer) => {
        navigate(offer.package_url);
    };

    // JSON-LD Schema for SEO
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "OfferCatalog",
        "name": "Limited-Time Rome Sightseeing Offers",
        "description": "Discover exclusive discounts on hop-on hop-off buses, city passes, and top Rome attractions.",
        "url": "https://www.sightseeingroma.com/featured-offers",
        "itemListElement": offers.map((offer, index) => ({
            "@type": "Offer",
            "position": index + 1,
            "name": offer.offer_title,
            "description": offer.offer_description,
            "price": offer.offer_adult_price,
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "validFrom": offer.offer_start,
            "validThrough": offer.offer_end
        }))
    };

    return (
        <>
            <Helmet>
                <title>Limited-Time Rome Sightseeing Offers | Exclusive Deals & Discounts</title>
                <meta name="description" content="Discover exclusive discounts on hop-on hop-off buses, city passes, and top Rome attractions. Limited-time offers on Rome sightseeing tours. Book now and save!" />
                <meta name="keywords" content="Rome sightseeing deals, Rome sightseeing offers, Rome ticket discounts, hop-on hop-off Rome discount, Rome bus ticket deals, Rome attraction offers, Rome tour discounts, limited-time Rome tickets" />
                <link rel="canonical" href="https://www.sightseeingroma.com/featured-offers" />
                
                {/* Open Graph */}
                <meta property="og:title" content="Limited-Time Rome Sightseeing Offers" />
                <meta property="og:description" content="Exclusive discounts on Rome hop-on hop-off buses, city passes, and attractions. Book now!" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.sightseeingroma.com/featured-offers" />
                
                {/* Schema.org */}
                <script type="application/ld+json">
                    {JSON.stringify(schemaData)}
                </script>
            </Helmet>
            <GlobalSEO />

            {/* SECTION 1: HERO */}
            <section className="relative bg-gradient-to-br from-[#930B31] via-[#7a0929] to-[#5a0620] py-16 md:py-24 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-white/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#FAD502]/10 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                            Limited-Time Rome Sightseeing Offers
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
                            Discover exclusive discounts on hop-on hop-off buses, city passes, and top Rome attractions. These offers change frequently — don't miss out.
                        </p>
                        
                        {/* Trust indicators */}
                        <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-white/80 text-sm md:text-base">
                            <div className="flex items-center gap-2">
                                <FaStar className="text-[#FAD502]" />
                                <span>Trusted Rome sightseeing tickets</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaCheckCircle className="text-[#FAD502]" />
                                <span>Verified operators</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaShieldAlt className="text-[#FAD502]" />
                                <span>Secure booking</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: ACTIVE OFFERS GRID */}
            <section className="py-12 md:py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10 md:mb-14">
                        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                            Current Rome Sightseeing Deals
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Grab these limited-time offers before they expire. Each deal has been hand-picked for maximum value.
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                                    <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            ))}
                        </div>
                    ) : error || offers.length === 0 ? (
                        <div className="text-center py-16">
                            <FaTag className="text-6xl text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Active Offers Right Now</h3>
                            <p className="text-gray-500 mb-6">Check back soon for new exclusive Rome sightseeing deals!</p>
                            <button 
                                onClick={() => navigate('/')}
                                className="bg-[#930B31] text-white font-bold py-3 px-8 rounded-full hover:bg-[#7a0929] transition-colors"
                            >
                                Browse All Tickets
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                            {offers.map((offer) => (
                                <div 
                                    key={offer.id} 
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                                >
                                    {/* Image Section */}
                                    <div className="relative aspect-[16/9] overflow-hidden">
                                        <img 
                                            src={offer.offer_image_url ? `${baseUrlHashless}${offer.offer_image_url}` : '/placeholder-offer.jpg'}
                                            alt={offer.offer_title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        
                                        {/* Badge */}
                                        <div className="absolute top-0 left-0 flex flex-col items-start">
                                            <div className="bg-[#930B31] text-white text-xs font-bold py-1.5 px-4 uppercase tracking-wide">
                                                {offer.badge_text}
                                            </div>
                                            {offer.discount_percentage > 0 && (
                                                <div className="bg-[#FAD502] text-gray-900 font-bold px-3 py-2 mt-2 ml-2 rounded shadow-md flex items-center gap-1">
                                                    <FaPercent className="text-xs" />
                                                    <span className="text-lg font-black">{offer.discount_percentage}</span>
                                                    <span className="text-[10px] uppercase">OFF</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Countdown Timer Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-white text-xs uppercase tracking-wider">Ends in:</span>
                                                <CountdownTimer endTime={offer.offer_end} compact />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-5 md:p-6">
                                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                                            {offer.offer_title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {offer.offer_description}
                                        </p>

                                        {/* Pricing */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-black text-[#930B31]">
                                                    ${parseFloat(offer.offer_adult_price).toFixed(0)}
                                                </span>
                                                {offer.original_adult_price > offer.offer_adult_price && (
                                                    <span className="text-gray-400 line-through text-sm">
                                                        ${offer.original_adult_price}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-500">per adult</span>
                                        </div>

                                        {/* Offer validity note */}
                                        <p className="text-xs text-gray-400 mb-4 flex items-center gap-1">
                                            <FaClock className="flex-shrink-0" />
                                            Valid for a limited time • Subject to availability
                                        </p>

                                        {/* CTA Button */}
                                        <button 
                                            onClick={() => handleBookNow(offer)}
                                            className="w-full bg-[#930B31] hover:bg-[#7a0929] text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group/btn"
                                        >
                                            <FaTicketAlt />
                                            Book Now & Save
                                            <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Admin Link */}
                    {isEditor && (
                        <div className="text-center mt-8">
                            <button 
                                onClick={() => navigate('/admin/featured-offers')}
                                className="text-[#930B31] hover:underline font-medium"
                            >
                                Manage Featured Offers →
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* SECTION 3: WHY THESE OFFERS ARE TRUSTWORTHY */}
            <section className="py-12 md:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
                            Why Trust Our Rome Sightseeing Deals?
                        </h2>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center p-4">
                                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FaCheckCircle className="text-2xl text-green-600" />
                                </div>
                                <h4 className="font-semibold text-gray-800 mb-1">Official Operators</h4>
                                <p className="text-xs text-gray-500">Partnered with verified Rome sightseeing companies</p>
                            </div>
                            
                            <div className="text-center p-4">
                                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FaTag className="text-2xl text-blue-600" />
                                </div>
                                <h4 className="font-semibold text-gray-800 mb-1">Transparent Pricing</h4>
                                <p className="text-xs text-gray-500">What you see is what you pay</p>
                            </div>
                            
                            <div className="text-center p-4">
                                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FaShieldAlt className="text-2xl text-purple-600" />
                                </div>
                                <h4 className="font-semibold text-gray-800 mb-1">No Hidden Fees</h4>
                                <p className="text-xs text-gray-500">Total price shown upfront</p>
                            </div>
                            
                            <div className="text-center p-4">
                                <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FaCreditCard className="text-2xl text-yellow-600" />
                                </div>
                                <h4 className="font-semibold text-gray-800 mb-1">Secure Payments</h4>
                                <p className="text-xs text-gray-500">SSL encrypted checkout</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: HOW OFTEN OFFERS CHANGE */}
            <section className="py-10 md:py-14 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                            ⏰ How Often Do Offers Change?
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Our featured sightseeing offers change every few days based on availability and seasonal demand. 
                            We recommend <strong>booking early</strong> to secure discounted prices. Once an offer expires, 
                            the special pricing is no longer available.
                        </p>
                    </div>
                </div>
            </section>

            {/* SECTION 5: FINAL CTA */}
            <section className="py-14 md:py-20 bg-gradient-to-r from-[#930B31] to-[#7A092B] relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-50%] right-[-20%] w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>
                </div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                            Explore Rome for Less — While Offers Last
                        </h2>
                        <p className="text-white/80 mb-8 text-lg">
                            Don't wait! These limited-time deals won't last forever.
                        </p>
                        <button 
                            onClick={() => navigate('/#tickets')}
                            className="bg-[#FAD502] text-[#930B31] font-bold py-4 px-10 rounded-full text-lg hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-3"
                        >
                            View All Rome Tickets
                            <FaArrowRight />
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default FeaturedOffersPage;
