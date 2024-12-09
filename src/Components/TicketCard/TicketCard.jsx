import { FaRegClock } from "react-icons/fa6";
import { LuTicket } from "react-icons/lu";
import PropTypes from "prop-types";

const TicketCard = ({ title, subtitle, image, duration, ticketCount, price, onClick }) => {
    return (
        <div className="w-full mb-2 md:mb-14 mx-auto bg-3 rounded-xl shadow-md overflow-hidden border">
            {/* Image Section */}
            <img
                src={image}
                alt={title}
                className="w-full h-[120px] md:h-[168px] object-cover"
            />

            {/* Card Content */}
            <div className="p-4">
                {/* Tour Type and Duration */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-xs md:text-sm mb-2 whitespace-nowrap">
                    <span className="flex items-center gap-1">
                        {subtitle}
                        <span className="mx-1 block md:hidden">|</span>
                    </span>
                    <span className="flex items-center gap-1 mt-2 md:mt-0">
                        <FaRegClock className="text-gray-500" /> {duration}
                    </span>
                </div>

                {/* Title */}
                <h2 className="md:text-md font-bold text-gray-800">
                    {title}
                </h2>

                {/* Tickets and Price */}
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center text-xs md:text-sm text-gray-500">
                        <LuTicket className="mr-1" />
                        <span># {ticketCount}</span>
                    </div>
                </div>

                {/* Pricing */}
                <div className="flex items-center mt-2 gap-1 whitespace-nowrap">
                    <h3 className="font-normal text-sm md:text-md">Start From</h3>
                    <span className="text-lg font-bold text-gray-800">€ {price}</span>
                    <span className="text-xs md:text-sm text-gray-500">(Per person)</span>
                </div>

                {/* Button */}
                <button
                    className="w-full py-2 px-5 mt-3 text-white bg-2 md:rounded-lg rounded-3xl font-medium"
                    onClick={onClick} // Call the passed onClick handler
                >
                    Buy Tickets
                </button>
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
    price: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired, // Add onClick as a required prop
};

export default TicketCard;
