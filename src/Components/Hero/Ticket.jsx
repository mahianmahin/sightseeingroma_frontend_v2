import { FaSearch } from "react-icons/fa";

const Ticket = () => {
    return (
        <div className="w-full px-4 lg:px-0 lg:w-2/3">
            <div className="flex flex-col lg:flex-row items-center justify-center p-6 bg-gray-200 text-black gap-6 lg:gap-10 rounded-lg shadow-md">
                
                {/* Select Bus Service */}
                <div className="flex flex-col w-full lg:w-auto">
                    <label className="text-base md:text-lg font-medium mb-1">Select Bus Service</label>
                    <select className="w-full md:w-60 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600">
                        <option disabled selected>Pick one</option>
                        <option>Big Bus</option>
                        <option>Small Bus</option>
                        <option>Lord of the Rings</option>
                        <option>Planet of the Apes</option>
                        <option>Star Trek</option>
                    </select>
                </div>

                {/* Ticket Price Range */}
                <div className="flex flex-col w-full lg:w-auto">
                    <label className="text-base md:text-lg font-medium mb-1">Ticket Price Range</label>
                    <div className="flex items-center space-x-2">
                        
                        {/* Min Price */}
                        <div className="flex items-center space-x-1">
                            <span className="text-gray-500">Min</span>
                            <select className="w-full md:w-28 lg:w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600">
                                <option disabled selected>€50</option>
                                <option>€50</option>
                                <option>€100</option>
                                <option>€150</option>
                                <option>€200</option>
                            </select>
                        </div>

                        <span className="text-gray-500">—</span>

                        {/* Max Price */}
                        <div className="flex items-center space-x-1">
                            <span className="text-gray-500">Max</span>
                            <select className="w-full md:w-28 lg:w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600">
                                <option disabled selected>€250</option>
                                <option>€250</option>
                                <option>€300</option>
                                <option>€350</option>
                                <option>€400</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Buy Tickets Button */}
               <div className="flex text-end"> <button className="w-full lg:w-auto  lg:mt-0 px-6 py-3 flex gap-2 items-center justify-center bg-[#930B31] text-white font-semibold rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-600">
                    <FaSearch /> Buy Tickets
                </button></div>
            </div>
        </div>
    );
};

export default Ticket;
