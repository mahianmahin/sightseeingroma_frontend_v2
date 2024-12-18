import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { RiArrowUpSLine, RiArrowDownSLine } from "react-icons/ri";

const Ticket = () => {
    const [isBusServiceOpen, setIsBusServiceOpen] = useState(false);
    const [isMinPriceFocused, setIsMinPriceFocused] = useState(false);
    const [isMaxPriceFocused, setIsMaxPriceFocused] = useState(false);

    const [busService, setBusService] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const handleBuyTickets = () => {
        console.log("Selected Bus Service:", busService);
        console.log("Min Price:", minPrice);
        console.log("Max Price:", maxPrice);
    };

    return (
        <div className="w-full md:w-auto px-4 lg:px-0 my-5">
            {/* Container */}
            <div className="flex flex-col lg:flex-row items-center justify-center p-6 bg-gray-200 text-black gap-6 lg:gap-10 rounded-lg shadow-md">
                {/* Select Bus Service */}
                <div className="flex flex-col w-full lg:w-auto">
                    <label className="text-base md:text-lg font-semibold mb-2 flex items-center">
                        Select Bus Service
                    </label>
                    <div className="relative">
                        <select
                            className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-md font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-red-600"
                            onFocus={() => setIsBusServiceOpen(true)}
                            onBlur={() => setIsBusServiceOpen(false)}
                            onChange={(e) => setBusService(e.target.value)}
                        >
                            <option disabled selected>Select Bus</option>
                            <option>Big Bus</option>
                            <option>Green Line</option>
                            <option>I love Rome Bus</option>
                            <option>IO Bus</option>
                            <option>CitySightseeing Bus</option>
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
                    <div className="flex items-center space-x-1 justify-between w-full">
                        {/* Min Price */}
                        <div className="relative flex items-center space-x-1">
                            <span className="pr-1">Min</span>
                            <div className="relative">
                                <input
                                    type="number"
                                    className="w-full md:w-36 px-7 md:px-5 py-2 font-semibold border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-red-600"
                                    value={minPrice}
                                    onFocus={() => setIsMinPriceFocused(true)}
                                    onBlur={() => setIsMinPriceFocused(false)}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    placeholder="50"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    {isMinPriceFocused ? (
                                        <RiArrowUpSLine size={20} color="#000000" />
                                    ) : (
                                        <RiArrowDownSLine size={20} color="#000000" />
                                    )}
                                </div>
                            </div>
                        </div>

                        <span>—</span>

                        {/* Max Price */}
                        <div className="relative flex items-center space-x-1">
                            <span>Max</span>
                            <div className="relative">
                                <input
                                    type="number"
                                    className="w-full md:w-36 px-7 md:px-5 py-2 font-semibold border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-red-600"
                                    value={maxPrice}
                                    onFocus={() => setIsMaxPriceFocused(true)}
                                    onBlur={() => setIsMaxPriceFocused(false)}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    placeholder="250"
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
                </div>

                {/* Buy Tickets Button */}
                <div className="flex text-end">
                    <button
                        className="w-full lg:w-auto px-6 py-3 flex gap-2 items-center justify-center bg-[#930B31] text-white font-semibold rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                        onClick={handleBuyTickets}
                    >
                        <FaSearch /> Buy Tickets
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Ticket;
