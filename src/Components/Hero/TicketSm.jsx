import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const TicketSm = ({ isOpennnn }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [busService, setBusService] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const navigate = useNavigate();

    const handleSearchTickets = () => {
        if (!busService) {
            alert("Please select a bus service.");
            return;
        }
        if (minPrice && maxPrice && parseInt(minPrice) > parseInt(maxPrice)) {
            alert("Minimum price cannot be greater than maximum price.");
            return;
        }
        navigate(`/search?bus=${busService}&minPrice=${minPrice}&maxPrice=${maxPrice}`);
    };

    if (isOpennnn) {
        return null;
    }

    return (
        <div>
            <div className="w-full md:w-auto px-4 lg:px-0 my-5">
                <div className={`flex flex-col items-center justify-center ${isExpanded ? "p-6 bg-gray-200" : "p-3 bg-gray-100"} text-black gap-6 lg:gap-10 rounded-lg transition-all duration-300`}>
                    {!isExpanded && (
                        <div className="flex flex-col items-center justify-between w-full">
                            <button
                                className="w-full px-6 py-3 flex gap-2 items-center justify-center bg-[#930B31] text-white font-semibold rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                                onClick={handleSearchTickets}
                            >
                                <FaSearch /> Search Tickets
                            </button>
                            <button
                                className="mt-4 p-2 text-gray-800 bg-white rounded-full shadow hover:bg-gray-200 focus:outline-none"
                                onClick={() => setIsExpanded(true)}
                            >
                                <RiArrowDownSLine size={24} />
                            </button>
                        </div>
                    )}

                    {isExpanded && (
                        <>
                            <div className="flex flex-col w-full lg:w-auto">
                                <label className="text-base md:text-lg font-semibold mb-2">Select Bus Service</label>
                                <select
                                    className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-red-600"
                                    onChange={(e) => setBusService(e.target.value)}
                                    value={busService}
                                >
                                    <option disabled value="">
                                        Select Bus
                                    </option>
                                    <option>Big Bus</option>
                                    <option>Green Line</option>
                                    <option>I Love Rome Bus</option>
                                    <option>IO Bus</option>
                                    <option>CitySightseeing Bus</option>
                                </select>
                            </div>

                            <div className="flex flex-col w-full lg:w-auto">
                                <label className="text-base md:text-lg font-medium mb-1">Ticket Price Range</label>
                                <div className="flex items-center space-x-1 justify-between w-full">
                                    <input
                                        type="number"
                                        className="w-full md:w-36 px-3 py-2 border border-gray-300 rounded-md"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        placeholder="Min Price"
                                    />
                                    <span>—</span>
                                    <input
                                        type="number"
                                        className="w-full md:w-36 px-3 py-2 border border-gray-300 rounded-md"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        placeholder="Max Price"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col items-center w-full">
                                <button
                                    className="w-full px-6 py-3 flex gap-2 items-center justify-center bg-[#930B31] text-white font-semibold rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                                    onClick={handleSearchTickets}
                                >
                                    <FaSearch /> Search Tickets
                                </button>
                                <button
                                    className="mt-4 p-2 text-gray-800 bg-white rounded-full shadow hover:bg-gray-200 focus:outline-none"
                                    onClick={() => setIsExpanded(false)}
                                >
                                    <RiArrowUpSLine size={24} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketSm;
