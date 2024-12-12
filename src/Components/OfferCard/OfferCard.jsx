import { FaRegClock } from "react-icons/fa";
import { HiOutlineTicket } from "react-icons/hi";

const OfferCard = ({ title, subtitle, image, duration, ticketCount, price }) => {
    return (
        <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden mx-auto sm:w-11/12 md:w-full mb-2 md:mb-7">
            <div className="relative">
                <img
                    src={image}
                    alt="Rome Bus Tour"
                    className="w-full rounded-lg h-28 md:h-44 object-cover"
                />
                <img
                    src="./Offer/ooo.png"
                    className="absolute top-0 left-0 rounded-t-xl w-10 md:w-14"
                    alt=""
                />
                <span
                    className="absolute top-1 left-1  text-white  text-sm md:text-lg font-bold py-1 px-1 md:px-2  "
                >
                    15%
                </span>
                <span className="absolute top-5 md:top-7 left-1 md:left-2  text-white  text-xs py-1 px-1 md:px-2  ">Off</span>
            </div>

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
                        Start From € <span className=" text-gray-400 font-semibold pr-2 line-through">28</span>
                        {price}
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-between gap-2 mt-2 md:mt-4">
                    <button className="h-8 sm:h-10 w-24 sm:w-28 bg-[#930B31] text-white py-1 rounded-3xl md:rounded-lg text-xs sm:text-sm font-semibold hover:bg-red-700">
                        Buy Now
                    </button>
                    <button className="h-8 sm:h-10 w-24 sm:w-28 bg-gray-100 text-red-800 py-1 rounded-3xl md:rounded-lg text-xs md:text-sm font-semibold hover:bg-gray-300">
                        View More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OfferCard;
