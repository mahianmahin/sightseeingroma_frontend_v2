import { FaRegClock, FaStar } from "react-icons/fa6";
import { LuTicket } from "react-icons/lu";
import { FiMapPin } from "react-icons/fi";
import PropTypes from "prop-types";
import { baseUrl } from "../../utilities/Utilities";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const TicketCard = ({ title, subtitle, image, duration, offPrice, ticketCount, price, id , status, price2 , id1, thumbnail_small, thumbnail_large, thumbnail_small_alt, thumbnail_large_alt}) => {
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
    
    let calculatedStatus = null;
    if (duration) {
        calculatedStatus = "E9";
    } else {
        calculatedStatus = "E8";
    }

    const handleBuyNow = () => {
        navigate(`/manageBookings/${calculatedStatus}/${id}`); // Navigate to ManageBooking with the status and id as parameters
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

    // Determine which alt text to use based on screen size and availability
    const getImageAlt = () => {
        if (isLargeScreen && thumbnail_large_alt) {
            return thumbnail_large_alt;
        } else if (!isLargeScreen && thumbnail_small_alt) {
            return thumbnail_small_alt;
        } else if (thumbnail_large_alt) {
            return thumbnail_large_alt;
        } else if (thumbnail_small_alt) {
            return thumbnail_small_alt;
        } else {
            // Fallback to title
            return title;
        }
    };

    return (
        <div className="group w-full mb-4 md:mb-6 mx-auto bg-white rounded-2xl shadow-lg hover:shadow-xl overflow-hidden border border-gray-100 flex flex-col transition-all duration-300 transform hover:-translate-y-1">
            {/* Image Section with Enhanced Overlay */}
            <div onClick={handleBuyNow} className="relative overflow-hidden">
                <img
                    src={getImageSrc()}
                    alt={getImageAlt()}
                    className="w-full h-[140px] md:h-[180px] object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Card Content */}
            <div className="p-3 md:p-5 flex flex-col flex-grow">
                {/* Category and Rating */}
                <div onClick={handleBuyNow} className="flex justify-between items-center mb-2 md:mb-3">
                    <span className="inline-flex items-center gap-1 text-[10px] md:text-xs font-medium text-[#930B31] bg-red-50 px-2 py-1 md:px-3 md:py-1.5 rounded-full">
                        <FiMapPin className="w-2 h-2 md:w-3 md:h-3" />
                        {subtitle}
                    </span>
                </div>

                {/* Title */}
                <h2 onClick={handleBuyNow} className="text-xs md:text-lg font-bold text-gray-800 leading-tight mb-2 md:mb-3 line-clamp-2 group-hover:text-[#930B31] transition-colors duration-200">
                    {title}
                </h2>

                {/* Ticket Info */}
                <div onClick={handleBuyNow} className="flex items-center justify-between mb-3 md:mb-4">
                    <div className="flex items-center gap-1 text-[10px] md:text-sm text-gray-500 bg-gray-50 px-2 py-1 md:px-3 md:py-1.5 rounded-lg">
                        <LuTicket className="w-3 h-3 md:w-4 md:h-4 text-[#930B31]" />
                        <span className="font-medium">#{id1}</span>
                    </div>
                </div>

                {/* Enhanced Pricing Section */}
                <div onClick={handleBuyNow} className="mb-3 md:mb-4">
                    <p className="text-[9px] md:text-xs text-gray-500">
                        <span className="font-medium">Starting from</span>
                    </p>

                    <div className="flex items-center justify-between mb-1 md:mb-2">
                        <div className="flex items-baseline gap-1 md:gap-2">
                            {offPrice && (
                                <span className="text-[10px] md:text-sm text-gray-400 line-through font-medium">
                                    €{offPrice}
                                </span>
                            )}
                            <span className="text-lg md:text-2xl font-bold text-[#930B31]">
                                €{price2}
                            </span>
                        </div>
                        {offPrice && (
                            <span className="bg-yellow-300 text-red-800 text-[10px] md:text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-full">
                                SAVE {Math.round(((offPrice - price) / offPrice) * 100)}%
                            </span>
                        )}
                    </div>
                </div>

                {/* Enhanced Button */}
                <div className="mt-auto">
                    <button className="w-full bg-gradient-to-r from-[#930B31] to-red-700 hover:from-red-700 hover:to-[#930B31] text-white font-bold py-2 md:py-3.5 px-4 md:px-6 rounded-lg md:rounded-xl text-[10px] md:text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl" onClick={handleBuyNow} >Buy Your Tickets</button>
                </div>
            </div>
        </div>
    );
};

TicketCard.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    ticketCount: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    status: PropTypes.string,
    price2: PropTypes.number,
    id1: PropTypes.number.isRequired,
    thumbnail_small: PropTypes.string,
    thumbnail_large: PropTypes.string,
    thumbnail_small_alt: PropTypes.string,
    thumbnail_large_alt: PropTypes.string,
    offPrice: PropTypes.number,
};

export default TicketCard;
