import React from 'react';
import { useNavigate } from 'react-router-dom';

const PromoBanner = ({ 
    title = "Looking for a BIG deal? Save 20% now!", 
    subtitle = "Adult tickets from €21.00", 
    buttonText = "BUY NOW", 
    link = "/compare-tickets",
    images = [
        "/CitySightseeeing/sh-1.png",
        "/CitySightseeeing/sh-2.png",
        "/CitySightseeeing/sh-3.png"
    ]
}) => {
    const navigate = useNavigate();

    return (
        <div className="w-full max-w-6xl mx-auto px-0 md:px-4 my-4 md:my-20">
            <div className="relative bg-[#930B31] md:rounded-xl md:shadow-2xl">
                <div className="flex flex-col md:flex-row items-center justify-between min-h-[100px] md:min-h-[140px] px-3 py-3 md:py-4 md:px-12 overflow-hidden md:overflow-visible md:rounded-xl">
                    
                    {/* Mobile Layout */}
                    <div className="md:hidden w-full flex items-center justify-between relative">
                        {/* Images Group - Left Side */}
                        <div className="flex -space-x-6 absolute -left-2 top-1/2 -translate-y-1/2 z-10">
                            {images.slice(0, 2).map((img, index) => (
                                <div 
                                    key={index} 
                                    className={`relative w-16 h-16 transform ${index === 0 ? '-rotate-12' : 'rotate-6 translate-y-1'} z-${10-index} rounded-sm`}
                                >
                                    <img src={img} alt="Promo" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        
                        {/* Content - Right Side */}
                        <div className="flex flex-col items-end text-right w-full pl-16">
                            <div className="mb-1">
                                <p className="text-[#FAD502] text-[10px] font-bold uppercase tracking-wider mb-0.5">Limited Offer</p>
                                <h3 className="text-white font-bold text-sm leading-tight max-w-[200px]">
                                    {title}
                                </h3>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-white/90 text-[10px] font-medium">{subtitle}</p>
                                <button 
                                    onClick={() => navigate(link)}
                                    className="bg-[#FAD502] text-[#930B31] px-3 py-1 rounded font-bold text-xs hover:bg-white transition-all shadow-lg active:scale-95 whitespace-nowrap"
                                >
                                    {buttonText}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:flex w-full items-center justify-between relative">
                        {/* Left: Title & Tagline */}
                        <div className="flex-1 pr-8 z-10">
                            <div className="inline-block bg-[#800020] rounded px-2 py-1 mb-2">
                                <span className="text-[#FAD502] text-xs font-bold uppercase tracking-wider">Special Promotion</span>
                            </div>
                            <h2 className="text-white font-bold text-3xl lg:text-4xl leading-tight drop-shadow-md">
                                {title}
                            </h2>
                        </div>

                        {/* Center: Button & Price */}
                        <div className="flex flex-col items-center justify-center px-8 z-10 border-l border-white/10 border-r mx-4">
                            <button 
                                onClick={() => navigate(link)}
                                className="bg-[#FAD502] text-[#930B31] px-8 py-3 rounded-lg font-bold text-xl hover:bg-white hover:scale-105 transition-all shadow-[0_4px_14px_0_rgba(250,213,2,0.39)] uppercase"
                            >
                                {buttonText}
                            </button>
                            <p className="text-white/90 text-sm mt-3 font-medium bg-[#800020]/50 px-3 py-1 rounded-full border border-white/10">
                                {subtitle}
                            </p>
                        </div>

                        {/* Right: Images overlapping edge */}
                        <div className="flex-1 flex justify-end relative h-full min-h-[140px]">
                            <div className="flex -space-x-12 absolute -right-12 top-1/2 -translate-y-1/2 perspective-1000">
                                {images.map((img, index) => (
                                    <div 
                                        key={index} 
                                        className={`
                                            relative w-32 h-32 lg:w-40 lg:h-40 bg-white p-2 shadow-2xl 
                                            transform transition-all duration-300 hover:scale-110 hover:z-50 hover:-rotate-0
                                            ${index === 0 ? '-rotate-12 translate-y-2 z-10' : ''}
                                            ${index === 1 ? 'rotate-6 -translate-y-2 z-20' : ''}
                                            ${index === 2 ? '-rotate-3 translate-y-4 z-30' : ''}
                                            rounded-sm border border-gray-100
                                        `}
                                    >
                                        <img src={img} alt="Promo" className="w-full h-full object-cover" />
                                        {/* Tape effect */}
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-white/30 backdrop-blur-sm rotate-2 shadow-sm"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PromoBanner;
