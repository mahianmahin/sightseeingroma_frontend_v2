import { FaRegClock, FaStar } from "react-icons/fa";
import { HiOutlineTicket } from "react-icons/hi";
import { FiMapPin } from "react-icons/fi";
import { baseUrl } from "../../utilities/Utilities";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Card = ({ title, subtitle, image, duration, offPrice, ticketCount, price, id, company, id1, thumbnail_small, thumbnail_large }) => {
    const navigate = useNavigate();
    const [isLargeScreen, setIsLargeScreen] = useState(false);

    // Check screen size on mount and resize
    useEffect(() => {
        const checkScreenSize = () => {
            setIsLargeScreen(window.innerWidth >= 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    let calculatedStatus = duration ? "E9" : "E8";

    const handleBuyNow = () => {
        if (id) {
            console.log('Navigating to:', `/manageBookings/${calculatedStatus}/${id}`);
            navigate(`/manageBookings/${calculatedStatus}/${id}`);
        } else {
            console.error("ID is missing, navigation failed.");
        }
    };

    const handleViewMore = () => {
        if (duration && company) {
            navigate(`/viewsimilar/${duration}/${company}`);
        } else {
            console.error("Missing parameters for View More.");
        }
    };

    // Determine which image to use based on screen size and availability
    const getImageSrc = () => {
        if (isLargeScreen && thumbnail_large) {
            return `${baseUrl}${thumbnail_large}`;
        } else if (!isLargeScreen && thumbnail_small) {
            return `${baseUrl}${thumbnail_small}`;
        } else if (thumbnail_large) {
            return `${baseUrl}${thumbnail_large}`;
        } else if (thumbnail_small) {
            return `${baseUrl}${thumbnail_small}`;
        } else {
            // Fallback to old image field if new fields are not available
            return `${baseUrl}${image}`;
        }
    };

    return (
        <div className="group w-full bg-white shadow-lg hover:shadow-xl rounded-2xl overflow-hidden mx-auto h-full flex flex-col transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            {/* Image Container with Overlay */}
            <div className="relative overflow-hidden">
                <img 
                    src={getImageSrc()}
                    alt={title}
                    className="w-full h-32 md:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Card Content */}
            <div className="p-3 md:p-5 flex flex-col flex-grow">
                <div className="flex-grow">
                    {/* Category and Rating */}
                    <div className="flex justify-between items-center mb-2">
                        <span className="inline-flex items-center gap-1 text-[10px] md:text-xs font-medium text-[#930B31] bg-red-50 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full">
                            <FiMapPin className="w-2 h-2 md:w-3 md:h-3" />
                            {subtitle}
                        </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xs md:text-lg font-bold text-gray-800 leading-tight mb-2 md:mb-3 line-clamp-2 group-hover:text-[#930B31] transition-colors duration-200">
                        {title}
                    </h2>

                    {/* Ticket Info */}
                    <div className="flex items-center gap-2 mb-2 md:mb-3">
                        <div className="flex items-center gap-1 text-[10px] md:text-sm text-gray-500 bg-gray-50 px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg">
                            <HiOutlineTicket className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="font-medium">#{id1}</span>
                        </div>
                    </div>

                    {/* Price Section */}
                    <div className="mb-3 md:mb-4">
                        <div className="flex items-baseline gap-1 md:gap-2 mb-1">
                            {offPrice && (
                                <span className="text-[10px] md:text-sm text-gray-400 line-through font-medium">
                                    €{offPrice}
                                </span>
                            )}
                            <span className="text-sm md:text-xl font-bold text-[#930B31]">
                                €{price}
                            </span>
                        </div>
                        <p className="text-[9px] md:text-xs text-gray-500">
                            <span className="font-medium">Starting from</span> • Per person
                        </p>
                        {offPrice && (
                            <div className="inline-flex items-center mt-1">
                                <span className="bg-green-100 text-green-800 text-[9px] md:text-xs font-bold px-1 py-0.5 md:px-2 rounded-full">
                                    SAVE €{offPrice - price}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Enhanced Buttons */}
                <div className="flex gap-1 md:gap-2 mt-auto">
                    <button 
                        onClick={handleBuyNow} 
                        className="flex-1 bg-[#930B31] hover:bg-red-700 text-white font-semibold py-1.5 md:py-3 px-2 md:px-4 rounded-lg md:rounded-xl text-[10px] md:text-sm transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        Book Now
                    </button>
                    <button 
                        onClick={handleViewMore} 
                        className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-[#930B31] font-semibold py-1.5 md:py-3 px-2 md:px-4 rounded-lg md:rounded-xl text-[10px] md:text-sm transition-all duration-200 border border-gray-200 hover:border-[#930B31]"
                    >
                        View More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card;
