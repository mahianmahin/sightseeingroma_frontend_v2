import { FaRegClock } from "react-icons/fa";
import { HiOutlineTicket } from "react-icons/hi";

const Card = ({ title, subtitle, image, duration, ticketCount, price }) => {
    return (
        <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden mx-auto sm:w-11/12 md:w-full">
            <img 
                src={image} 
                alt="Rome Bus Tour" 
                className="w-full h-28 md:h-44 object-cover"
            />
            <div className="p-2 md:p-4">
                {/* Subtitle and Duration */}
                <div className="flex justify-between items-center mb-2">
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
                    <HiOutlineTicket className="w-4 h-4 sm:w-5 sm:h-5" /> #{ticketCount}
                </span>
                
                {/* Price */}
                <div className="flex items-center justify-between mt-3">
                    <p className="text-xs sm:text-sm md:text-lg font-semibold">
                        Start From €{price} <span className="text-xs sm:text-sm font-normal">(Per person)</span>
                    </p>
                </div>
                
                {/* Buttons */}
                <div className="flex justify-between gap-2 mt-2 md:mt-4">
                    <button className="h-8 sm:h-10 w-24 sm:w-28 bg-[#930B31] text-white py-1 rounded-lg text-xs sm:text-sm font-semibold hover:bg-red-700">
                        Buy Now
                    </button>
                    <button className="h-8 sm:h-10 w-24 sm:w-28 bg-gray-100 text-red-800 py-1 rounded-lg text-xs md:text-sm font-semibold hover:bg-gray-300">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card;
