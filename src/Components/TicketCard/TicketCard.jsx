import { FaRegClock } from "react-icons/fa6";
import { LuTicket } from "react-icons/lu";
import PropTypes from "prop-types";
import { baseUrl } from "../../utilities/Utilities";
import { useNavigate } from "react-router-dom";

const TicketCard = ({ title, subtitle, image, duration, ticketCount, price, id , status, price2 , id1}) => {
    const navigate = useNavigate();
    
    

    let calculatedStatus = null;
    if (duration) {
        calculatedStatus = "E9";
    } else {
        calculatedStatus = "E8";
    }

    const handleBuyNow = () => {
        navigate(`/manageBookings/${calculatedStatus}/${id}`); // Navigate to ManageBooking with the status and id as parameters
    };
    return (
        <div className="w-full mb-2 md:mb-14 mx-auto bg-3 rounded-xl shadow-md overflow-hidden border flex flex-col">
            {/* Image Section */}
            <img
                src={`${baseUrl}${image}`}
                alt={title}
                className="w-full h-[120px] md:h-[168px] object-cover"
            />

            {/* Card Content */}
            <div className="p-4 flex flex-col flex-grow">
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
                <h2 className=" text-sm md:text-lg font-semibold  text-gray-800">
                    {title}
                </h2>

                {/* Tickets and Price */}
                <div className="flex items-center justify-between mt-0 md:mt-2">
                    <div className="flex items-center text-xs md:text-sm text-gray-500">
                        <LuTicket className="mr-1" />
                        <span># {id1}</span>
                    </div>
                </div>

                {/* Pricing */}
                <div className="flex items-center mt-1 md:mt-2 gap-1 whitespace-nowrap">
    <h3 className="font-normal text-sm md:text-md">Start From</h3>
    <span className="text-xs md:text-lg font-bold text-gray-800">€ {price}</span>
    <span className="hidden text-xs text-gray-500 sm:inline md:text-sm">(Per person)</span>
</div>
<div className="block sm:hidden text-xs text-gray-500 mt-1">(Per person)</div>

            </div>

            {/* Button */}
           <div className="mb-4 mx-2">
           <button
                className="w-full py-2 px-5 mt-0 md:mt-3 text-white bg-2 md:rounded-lg rounded-3xl text-xs md:text-lg md:font-medium"
                onClick={handleBuyNow} // Call the passed onClick handler
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
    price: PropTypes.number.isRequired, // Change from string to number
    onClick: PropTypes.func.isRequired,
};

export default TicketCard;
