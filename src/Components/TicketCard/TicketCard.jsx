import { FaRegClock, FaStar } from "react-icons/fa6";
import { LuTicket } from "react-icons/lu";
import { FiMapPin } from "react-icons/fi";
import { FaTag } from "react-icons/fa";
import PropTypes from "prop-types";
import { baseUrl } from "../../utilities/Utilities";
import { useNavigate } from "react-router-dom";
import { useActiveOffers, getOfferForPackage } from "../../hooks/useActiveOffers";
import OptimizedImage from "../OptimizedImage/OptimizedImage";

const TicketCard = ({ title, subtitle, image, duration, offPrice, ticketCount, price, id , status, price2 , id1, thumbnail_small, thumbnail_large, thumbnail_small_alt, thumbnail_large_alt, thumbnail_small_webp, thumbnail_large_webp}) => {
    const navigate = useNavigate();
    const { activeOffers } = useActiveOffers();
    
    // Check if this package has an active offer
    const activeOffer = getOfferForPackage(activeOffers, id);
    
    let calculatedStatus = null;
    if (duration) {
        calculatedStatus = "E9";
    } else {
        calculatedStatus = "E8";
    }

    const handleBuyNow = () => {
        // If there's an active offer, include offer_id in the URL
        const baseUrl = `/manageBookings/${calculatedStatus}/${id}`;
        if (activeOffer) {
            navigate(`${baseUrl}?offer_id=${activeOffer.offer_id}`);
        } else {
            navigate(baseUrl);
        }
    };

    // Build image URLs
    const imgSmall = thumbnail_small ? `${baseUrl}${thumbnail_small}` : null;
    const imgLarge = thumbnail_large ? `${baseUrl}${thumbnail_large}` : null;
    const imgFallback = image ? `${baseUrl}${image}` : null;
    const imgSmallWebp = thumbnail_small_webp ? `${baseUrl}${thumbnail_small_webp}` : null;
    const imgLargeWebp = thumbnail_large_webp ? `${baseUrl}${thumbnail_large_webp}` : null;

    return (
        <div className={`group w-full mb-4 md:mb-6 mx-auto bg-white rounded-2xl shadow-lg hover:shadow-xl overflow-hidden border ${activeOffer ? 'border-red-400 ring-2 ring-red-300 ring-opacity-50' : 'border-gray-100'} flex flex-col transition-all duration-300 transform hover:-translate-y-1`}>
            {/* Image Section with Enhanced Overlay */}
            <div onClick={handleBuyNow} className="relative overflow-hidden">
                <OptimizedImage
                    src={imgFallback}
                    srcSmall={imgSmall}
                    srcLarge={imgLarge}
                    srcSmallWebp={imgSmallWebp}
                    srcLargeWebp={imgLargeWebp}
                    alt={title}
                    altSmall={thumbnail_small_alt}
                    altLarge={thumbnail_large_alt}
                    className="w-full h-[140px] md:h-[180px] object-cover transition-transform duration-500 group-hover:scale-110"
                    wrapperClassName="w-full h-[140px] md:h-[180px]"
                    sizes="(max-width: 768px) 50vw, 25vw"
                />
                
                {/* Offer Badge - Shows when there's an active offer - Enhanced Glow Effect */}
                {activeOffer && (
                    <div className="absolute top-2 left-2 z-10">
                        <div className="relative">
                            {/* Glowing background */}
                            <div className="absolute inset-0 bg-red-500 rounded-full blur-md opacity-75 animate-pulse"></div>
                            {/* Badge content */}
                            <div className="relative bg-gradient-to-r from-[#930B31] to-red-600 text-white text-[9px] md:text-xs font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full shadow-lg flex items-center gap-1">
                                <FaTag className="w-2 h-2 md:w-3 md:h-3 animate-bounce" />
                                <span>{activeOffer.badge_text}</span>
                            </div>
                        </div>
                    </div>
                )}
                
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
    thumbnail_small_webp: PropTypes.string,
    thumbnail_large_webp: PropTypes.string,
    offPrice: PropTypes.number,
};

export default TicketCard;
