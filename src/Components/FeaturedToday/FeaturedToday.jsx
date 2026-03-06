import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTag, FaArrowRight, FaClock } from 'react-icons/fa';
import { baseUrlHashless } from '../../utilities/Utilities';
import OptimizedImage from '../OptimizedImage/OptimizedImage';

const FeaturedToday = ({ offersData }) => {
    const navigate = useNavigate();

    const bestOffer = useMemo(() => {
        if (!offersData || !offersData.length) return null;
        const withDiscount = offersData
            .filter(o => o.original_adult_price && o.offer_adult_price && parseFloat(o.original_adult_price) > parseFloat(o.offer_adult_price))
            .map(o => ({
                ...o,
                discountPct: Math.round(((parseFloat(o.original_adult_price) - parseFloat(o.offer_adult_price)) / parseFloat(o.original_adult_price)) * 100)
            }));
        if (!withDiscount.length) return null;
        withDiscount.sort((a, b) => b.discountPct - a.discountPct);
        return withDiscount[0];
    }, [offersData]);

    // offersData === null means still loading; [] means loaded but empty
    if (offersData === null) return null;
    if (!bestOffer) return null;

    const {
        id,
        offer_title,
        offer_description,
        badge_text,
        offer_adult_price,
        original_adult_price,
        offer_image_url,
        offer_image_webp_url,
        company_name,
        time_remaining,
        discountPct,
    } = bestOffer;

    // Format countdown timer
    const formatTimeRemaining = (seconds) => {
        if (!seconds || seconds <= 0) return null;
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    const timeLabel = formatTimeRemaining(time_remaining);

    const handleGetTickets = () => {
        navigate(`/featured-offers?highlight=${id}`);
    };

    const imageUrl = offer_image_url
        ? (offer_image_url.startsWith('http') ? offer_image_url : `${baseUrlHashless}${offer_image_url}`)
        : '/placeholder.jpg';
    const imageWebpUrl = offer_image_webp_url
        ? (offer_image_webp_url.startsWith('http') ? offer_image_webp_url : `${baseUrlHashless}${offer_image_webp_url}`)
        : undefined;

    return (
        <section id="featured-today" className="py-10 md:py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-yellow-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-red-200/20 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Heading */}
                <div className="text-center mb-8 md:mb-12">
                    <div className="inline-block relative">
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-3 relative z-10">
                            Featured Today: Best Deal Right Now
                        </h2>
                        <div className="absolute bottom-1 md:bottom-2 left-0 w-full h-2 md:h-3 bg-[#FAD502]/40 -skew-x-12 -z-0 rounded-sm"></div>
                    </div>
                </div>

                {/* Main Feature Card */}
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl overflow-hidden border-2 border-[#FAD502] ring-4 ring-[#FAD502]/20 flex flex-col md:flex-row transform transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] hover:ring-[#FAD502]/40 group">
                        
                        {/* LEFT: IMAGE */}
                        <div className="w-full md:w-[45%] relative aspect-[4/3] md:aspect-auto md:min-h-[450px] overflow-hidden">
                            <OptimizedImage
                                src={imageUrl}
                                srcWebp={imageWebpUrl}
                                alt={offer_title || 'Featured offer'}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                wrapperClassName="w-full h-full"
                                sizes="(max-width: 768px) 100vw, 45vw"
                            />

                            {/* BADGES */}
                            <div className="absolute top-0 left-0 flex flex-col items-start z-20">
                                {/* Featured Today Ribbon */}
                                <div className="bg-[#930B31] text-white text-xs md:text-sm font-bold py-1.5 md:py-2 pl-3 md:pl-4 pr-4 md:pr-6 uppercase tracking-wide shadow-lg">
                                    {badge_text || 'Featured Today'}
                                </div>
                                
                                {/* Discount Tag */}
                                {discountPct > 0 && (
                                    <div className="bg-[#FAD502] text-gray-900 font-bold px-3 md:px-4 py-2 md:py-3 mt-2 ml-2 md:ml-3 rounded shadow-lg flex flex-col items-center justify-center">
                                        <span className="text-lg md:text-xl font-black leading-none">{discountPct}%</span>
                                        <span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-wider mt-0.5">OFF</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT: CONTENT */}
                        <div className="w-full md:w-[55%] p-5 md:p-10 lg:p-12 flex flex-col justify-center relative bg-white">
                            {/* Decorative Icon Background */}
                            <div className="absolute top-6 right-6 opacity-[0.03] pointer-events-none hidden md:block">
                                <FaTag className="text-9xl" />
                            </div>

                            {/* Timer */}
                            {timeLabel && (
                                <div className="flex items-center gap-2 mb-3 md:mb-4">
                                    <FaClock className="text-[#930B31] text-sm" />
                                    <span className="text-sm text-gray-600">Ends in:</span>
                                    <span className="text-sm font-bold text-[#930B31]">{timeLabel}</span>
                                </div>
                            )}

                            {/* Company */}
                            {company_name && (
                                <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wide mb-1">{company_name}</p>
                            )}

                            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 md:mb-5 leading-tight">
                                {offer_title}
                            </h3>
                            
                            <div className="text-gray-600 text-base md:text-lg mb-4 md:mb-6 leading-relaxed line-clamp-3">
                                {offer_description}
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-3 mb-5 md:mb-8">
                                <span className="text-3xl md:text-4xl font-black text-[#930B31]">
                                    €{offer_adult_price}
                                </span>
                                {original_adult_price && parseFloat(original_adult_price) > parseFloat(offer_adult_price) && (
                                    <span className="text-lg md:text-xl text-gray-400 line-through">
                                        €{original_adult_price}
                                    </span>
                                )}
                                <span className="text-sm text-gray-500">per person</span>
                            </div>

                            <div className="mt-auto">
                                <button 
                                    onClick={handleGetTickets}
                                    className="w-full bg-[#930B31] hover:bg-[#7a0929] text-white text-base md:text-lg font-bold py-3.5 md:py-4 px-8 md:px-10 rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 group/btn"
                                >
                                    View Offer
                                    <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedToday;
