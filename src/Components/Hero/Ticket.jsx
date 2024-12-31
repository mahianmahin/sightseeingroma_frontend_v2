import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { RiArrowUpSLine, RiArrowDownSLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom"; // Ensure this import is correct for your routing setup

const Ticket = () => {
    const navigate = useNavigate(); // Add navigation hook
    const [isBusServiceOpen, setIsBusServiceOpen] = useState(false);
    const [isMinPriceFocused, setIsMinPriceFocused] = useState(false);
    const [isMaxPriceFocused, setIsMaxPriceFocused] = useState(false);

    const [busService, setBusService] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const handleSearchTickets = () => {
        if (!busService) {
            alert("Please select a bus service.");
            return;
        }
        if (minPrice && maxPrice && parseInt(minPrice) > parseInt(maxPrice)) {
            alert("Minimum price cannot be greater than maximum price.");
            return;
        }
        // Navigate with query parameters
        navigate(`/search?bus=${busService}&minPrice=${minPrice}&maxPrice=${maxPrice}`);
    };

    return (
        <div className="w-full md:w-auto px-4 lg:px-0 my-5">
            {/* Container */}
            <div className="flex flex-col lg:flex-row items-center justify-center p-6 bg-gray-200 text-black gap-6 lg:gap-10 rounded-lg shadow-md">
                {/* Select Bus Service */}
                <div className="flex flex-col w-full lg:w-auto">
                    <label className="text-base md:text-lg font-semibold mb-2">
                        Select Bus Service
                    </label>
                    <div className="relative">
                        <select
                            className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-md font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-red-600"
                            value={busService}
                            onChange={(e) => setBusService(e.target.value)}
                            onFocus={() => setIsBusServiceOpen(true)}
                            onBlur={() => setIsBusServiceOpen(false)}
                        >
                            <option value="" disabled>Select Bus</option>
                            <option value="Big Bus">Big Bus</option>
                            <option value="Green Line">Green Line</option>
                            <option value="I love Rome Bus">I love Rome Bus</option>
                            <option value="IO Bus">IO Bus</option>
                            <option value="CitySightseeing Bus">CitySightseeing Bus</option>
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            {isBusServiceOpen ? (
                                <RiArrowUpSLine size={20} color="#000000" />
                            ) : (
                                <RiArrowDownSLine size={20} color="#000000" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Ticket Price Range */}
                <div className="flex flex-col w-full lg:w-auto">
                    <label className="text-base md:text-lg font-medium mb-1">Ticket Price Range</label>
                    <div className="flex items-center space-x-3">
                        {/* Min Price */}
                        <div className="relative">
                            <input
                                type="number"
                                className="w-full md:w-36 px-4 py-2 font-semibold border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-red-600"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                onFocus={() => setIsMinPriceFocused(true)}
                                onBlur={() => setIsMinPriceFocused(false)}
                                placeholder="Min Price"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                {isMinPriceFocused ? (
                                    <RiArrowUpSLine size={20} color="#000000" />
                                ) : (
                                    <RiArrowDownSLine size={20} color="#000000" />
                                )}
                            </div>
                        </div>

                        <span>—</span>

                        {/* Max Price */}
                        <div className="relative">
                            <input
                                type="number"
                                className="w-full md:w-36 px-4 py-2 font-semibold border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-red-600"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                onFocus={() => setIsMaxPriceFocused(true)}
                                onBlur={() => setIsMaxPriceFocused(false)}
                                placeholder="Max Price"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                {isMaxPriceFocused ? (
                                    <RiArrowUpSLine size={20} color="#000000" />
                                ) : (
                                    <RiArrowDownSLine size={20} color="#000000" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Tickets Button */}
                <div>
                    <button
                        className="w-full lg:w-auto px-6 py-3 flex items-center gap-2 justify-center bg-[#930B31] text-white font-semibold rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                        onClick={handleSearchTickets}
                    >
                        <FaSearch /> Search Tickets
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Ticket;
