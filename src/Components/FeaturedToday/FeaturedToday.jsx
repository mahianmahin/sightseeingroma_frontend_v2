import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTag, FaArrowRight } from 'react-icons/fa';
import { baseUrl, baseUrlHashless } from '../../utilities/Utilities';

const FeaturedToday = () => {
    const navigate = useNavigate();
    const [featuredData, setFeaturedData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${baseUrl}featured-today/`)
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('No featured offer active');
            })
            .then(data => {
                setFeaturedData(data);
                setLoading(false);
            })
            .catch(err => {
                console.log("No featured offer found or error fetching:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return null; // Or a skeleton loader if preferred
    if (!featuredData) return null;

    const { 
        title, 
        subtitle, 
        description, 
        button_text, 
        button_link, 
        badge_text, 
        discount_text, 
        desktop_image, 
        mobile_image 
    } = featuredData;

    const handleGetTickets = () => {
        // Navigate to the featured offers page
        navigate('/featured-offers');
    };

    return (
        <section id="featured-today" className="py-10 md:py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-yellow-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-red-200/20 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Widget 1: Heading (H2) */}
                <div className="text-center mb-8 md:mb-12">
                    <div className="inline-block relative">
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-3 relative z-10">
                            {title}
                        </h2>
                        <div className="absolute bottom-1 md:bottom-2 left-0 w-full h-2 md:h-3 bg-[#FAD502]/40 -skew-x-12 -z-0 rounded-sm"></div>
                    </div>
                </div>

                {/* Widget 2: Main Feature Card */}
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl overflow-hidden border-2 border-[#FAD502] ring-4 ring-[#FAD502]/20 flex flex-col md:flex-row transform transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] hover:ring-[#FAD502]/40 group">
                        
                        {/* LEFT: IMAGE */}
                        <div className="w-full md:w-[45%] relative aspect-[4/3] md:aspect-auto md:min-h-[450px] overflow-hidden">
                            {/* Desktop Image */}
                            <img 
                                src={`${baseUrlHashless}${desktop_image}`} 
                                alt={title} 
                                className="hidden md:block w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Mobile Image */}
                            <img 
                                src={`${baseUrlHashless}${mobile_image || desktop_image}`} 
                                alt={title} 
                                className="block md:hidden w-full h-full object-cover"
                            />

                            {/* BADGES - Top Left Corner */}
                            <div className="absolute top-0 left-0 flex flex-col items-start z-20">
                                {/* Featured Today Ribbon */}
                                {badge_text && (
                                    <div className="bg-[#930B31] text-white text-xs md:text-sm font-bold py-1.5 md:py-2 pl-3 md:pl-4 pr-4 md:pr-6 uppercase tracking-wide shadow-lg">
                                        {badge_text}
                                    </div>
                                )}
                                
                                {/* Discount Tag */}
                                {discount_text && (
                                    <div className="bg-[#FAD502] text-gray-900 font-bold px-3 md:px-4 py-2 md:py-3 mt-2 ml-2 md:ml-3 rounded shadow-lg flex flex-col items-center justify-center">
                                        <span className="text-lg md:text-xl font-black leading-none">{discount_text}</span>
                                        <span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-wider mt-0.5">OFF</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT: CONTENT */}
                        <div className="w-full md:w-[55%] p-5 md:p-10 lg:p-12 flex flex-col justify-center relative bg-white">
                            {/* Decorative Icon Background - Hidden on mobile */}
                            <div className="absolute top-6 right-6 opacity-[0.03] pointer-events-none hidden md:block">
                                <FaTag className="text-9xl" />
                            </div>

                            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 md:mb-5 leading-tight">
                                {subtitle}
                            </h3>
                            
                            <div className="text-gray-600 text-base md:text-lg mb-5 md:mb-8 leading-relaxed whitespace-pre-line">
                                {description}
                            </div>

                            <div className="mt-auto">
                                <button 
                                    onClick={handleGetTickets}
                                    className="w-full bg-[#930B31] hover:bg-[#7a0929] text-white text-base md:text-lg font-bold py-3.5 md:py-4 px-8 md:px-10 rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 group/btn"
                                >
                                    {button_text || "Get Offer"}
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
