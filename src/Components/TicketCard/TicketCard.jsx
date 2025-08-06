import { FaRegClock, FaStar } from "react-icons/fa6";
import { LuTicket } from "react-icons/lu";
import { FiMapPin } from "react-icons/fi";
import PropTypes from "prop-types";
import { baseUrl } from "../../utilities/Utilities";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const TicketCard = ({ title, subtitle, image, duration, offPrice, ticketCount, price, id , status, price2 , id1, thumbnail_small, thumbnail_large}) => {
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

    return (
        <div className="group w-full mb-4 md:mb-6 mx-auto bg-white rounded-2xl shadow-lg hover:shadow-xl overflow-hidden border border-gray-100 flex flex-col transition-all duration-300 transform hover:-translate-y-1">
            {/* Image Section with Enhanced Overlay */}
            <div className="relative overflow-hidden">
                <img
                    src={getImageSrc()}
                    alt={title}
                    className="w-full h-[140px] md:h-[180px] object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Duration Badge */}
                <div className="absolute top-3 right-3">
                    <div className="bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                        <FaRegClock className="w-3 h-3 text-[#930B31]" />
                        <span>{duration}</span>
                    </div>
                </div>

                {/* Premium Badge */}
                <div className="absolute top-3 left-3">
                    <span className="bg-[#930B31] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        POPULAR
                    </span>
                </div>
            </div>

            {/* Card Content */}
            <div className="p-4 md:p-5 flex flex-col flex-grow">
                {/* Category and Rating */}
                <div className="flex justify-between items-center mb-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#930B31] bg-red-50 px-3 py-1.5 rounded-full">
                        <FiMapPin className="w-3 h-3" />
                        {subtitle}
                    </span>
                    {/* <div className="flex items-center gap-1">
                        <FaStar className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600 font-medium">4.9</span>
                    </div> */}
                </div>

                {/* Title */}
                <h2 className="text-sm md:text-lg font-bold text-gray-800 leading-tight mb-3 line-clamp-2 group-hover:text-[#930B31] transition-colors duration-200">
                    {title}
                </h2>

                {/* Ticket Info */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5 text-xs md:text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <LuTicket className="w-4 h-4 text-[#930B31]" />
                        <span className="font-medium">#{id1}</span>
                    </div>
                </div>

                {/* Enhanced Pricing Section */}
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-baseline gap-2">
                            {offPrice && (
                                <span className="text-sm text-gray-400 line-through font-medium">
                                    €{offPrice}
                                </span>
                            )}
                            <span className="text-xl md:text-2xl font-bold text-[#930B31]">
                                €{price}
                            </span>
                        </div>
                        {offPrice && (
                            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                                -{Math.round(((offPrice - price) / offPrice) * 100)}%
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-500">
                        <span className="font-medium">Starting from</span> • Per person
                    </p>
                </div>

                {/* Enhanced Button */}
                <div className="mt-auto">
                    <button
                        className="w-full bg-gradient-to-r from-[#930B31] to-red-700 hover:from-red-700 hover:to-[#930B31] text-white font-bold py-3 md:py-3.5 px-6 rounded-xl text-sm md:text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        onClick={handleBuyNow}
                    >
                        Book Your Tickets
                    </button>
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
    offPrice: PropTypes.number,
};

export default TicketCard;
