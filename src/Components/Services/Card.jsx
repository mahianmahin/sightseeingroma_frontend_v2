import { FaRegClock } from "react-icons/fa";
import { HiOutlineTicket } from "react-icons/hi";
import { baseUrl } from "../../utilities/Utilities";
import { useNavigate } from "react-router-dom";

const Card = ({ title, subtitle, image, duration, ticketCount, price, id, company, id1 }) => {
    const navigate = useNavigate();

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

    return (
        <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden mx-auto sm:w-11/12 md:w-full h-full flex flex-col">
            {/* Image */}
            <img 
                src={`${baseUrl}${image}`}
                alt={title}
                className="w-full h-28 md:h-44 object-cover"
            />

            {/* Card Content */}
            <div className="p-2 md:p-4 flex flex-col flex-grow">
                <div className="flex-grow">
                    {/* Subtitle & Duration */}
                    <div className="flex justify-between items-start md:items-center flex-col md:flex-row mb-2">
                        <p className="text-xs sm:text-sm text-gray-500">{subtitle}</p>
                        <span className="flex items-center text-gray-500">
                            <FaRegClock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="ml-1 text-xs sm:text-sm">{duration}</span>
                        </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xs sm:text-sm md:text-lg font-bold text-gray-800 leading-snug">
                        {title}
                    </h2>

                    {/* Ticket Info */}
                    <span className="text-gray-500 flex items-center gap-2 mt-2 text-xs sm:text-sm">
                        <HiOutlineTicket className="w-4 h-4 sm:w-5 sm:h-5" /> #{id1}
                    </span>

                    {/* Price */}
                    <div className="mt-3">
                        <p className="text-xs sm:text-sm md:text-lg font-semibold">
                            Start From €{price} <span className="text-xs sm:text-sm font-normal">(Per person)</span>
                        </p>
                    </div>
                </div>

                {/* Buttons (Always at the bottom) */}
                <div className="flex justify-between gap-2 mt-4">
                    <button 
                        onClick={handleBuyNow} 
                        className="pointer-events-auto z-50 h-8 sm:h-10 w-24 sm:w-28 bg-[#930B31] text-white py-1 rounded-3xl md:rounded-lg text-xs sm:text-sm font-semibold hover:bg-red-700"
                    >
                        Buy Now
                    </button>
                    <button 
                        onClick={handleViewMore} 
                        className="pointer-events-auto z-50 h-8 sm:h-10 w-24 sm:w-28 bg-gray-100 text-red-800 py-1 rounded-3xl md:rounded-lg text-xs sm:text-sm font-semibold hover:bg-gray-300"
                    >
                        View More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card;
