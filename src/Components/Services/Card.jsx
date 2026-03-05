import { FaRegClock, FaStar, FaTag } from "react-icons/fa";
import { HiOutlineTicket } from "react-icons/hi";
import { FiMapPin } from "react-icons/fi";
import { baseUrlHashless } from "../../utilities/Utilities";
import { useNavigate } from "react-router-dom";
import { useActiveOffers, getOfferForPackage } from "../../hooks/useActiveOffers";
import OptimizedImage from "../OptimizedImage/OptimizedImage";

const Card = ({ title, subtitle, image, duration, offPrice, ticketCount, price, price2, id, company, id1, thumbnail_small, thumbnail_large, thumbnail_small_alt, thumbnail_large_alt, thumbnail_small_webp, thumbnail_large_webp }) => {
    const navigate = useNavigate();
    const { activeOffers } = useActiveOffers();
    
    // Check if this package has an active offer
    const activeOffer = getOfferForPackage(activeOffers, id);

    let calculatedStatus = duration ? "E9" : "E8";

    const handleBuyNow = () => {
        if (id) {
            // If there's an active offer, include offer_id in the URL
            const url = `/manageBookings/${calculatedStatus}/${id}`;
            if (activeOffer) {
                navigate(`${url}?offer_id=${activeOffer.offer_id}`);
            } else {
                navigate(url);
            }
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

    // Build image URLs
    const imgSmall = thumbnail_small ? `${baseUrlHashless}${thumbnail_small}` : null;
    const imgLarge = thumbnail_large ? `${baseUrlHashless}${thumbnail_large}` : null;
    const imgFallback = image ? `${baseUrlHashless}${image}` : null;
    const imgSmallWebp = thumbnail_small_webp ? `${baseUrlHashless}${thumbnail_small_webp}` : null;
    const imgLargeWebp = thumbnail_large_webp ? `${baseUrlHashless}${thumbnail_large_webp}` : null;

    return (
        <div className={`group w-full bg-white shadow-lg hover:shadow-xl rounded-2xl overflow-hidden mx-auto h-full flex flex-col transition-all duration-300 transform hover:-translate-y-1 border ${activeOffer ? 'border-red-400 ring-2 ring-red-300 ring-opacity-50' : 'border-gray-100'}`}>
            {/* Image Container with Overlay */}
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
                    className="w-full h-32 md:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    wrapperClassName="w-full h-32 md:h-48"
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Card Content */}
            <div className="p-3 md:p-5 flex flex-col flex-grow">
                <div onClick={handleBuyNow} className="flex-grow">
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
                        <p className="text-[9px] md:text-xs text-gray-500">
                            <span className="font-medium">Starting from</span>
                        </p>

                        <div className="flex items-baseline gap-1 md:gap-2 mb-1">
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
                            <div className="inline-flex items-center mt-1">
                                <span className="bg-yellow-300 text-red-800 text-[9px] md:text-xs font-bold px-1 py-0.5 md:px-2 rounded-full">
                                    SAVE {Math.round(((offPrice - price) / offPrice) * 100)}%
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Enhanced Buttons */}
                <div className="flex gap-1 md:gap-2 mt-auto">
                    <button onClick={handleBuyNow} className="flex-1 bg-[#930B31] hover:bg-red-700 text-white font-semibold py-1.5 md:py-3 px-2 md:px-4 rounded-lg md:rounded-xl text-[10px] md:text-sm transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">Buy Now</button>
                    {/* <button onClick={handleViewMore} className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-[#930B31] font-semibold py-1.5 md:py-3 px-2 md:px-4 rounded-lg md:rounded-xl text-[10px] md:text-sm transition-all duration-200 border border-gray-200 hover:border-[#930B31]">View More</button> */}
                </div>
            </div>
        </div>
    );
};

export default Card;
