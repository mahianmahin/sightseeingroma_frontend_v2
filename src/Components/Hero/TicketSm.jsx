import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { baseUrl } from "../../utilities/Utilities";

const TicketSm = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [busService, setBusService] = useState("");
    const [ticketType, setTicketType] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [busData, setBusData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${baseUrl}packages/`);
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                setBusData(data.bus_data || []);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const capitalizeWords = (str) => 
        str.replace(/\b\w/g, (char) => char.toUpperCase());

    // Get unique bus company names
    const uniqueCompanies = [...new Set(busData.map((bus) => bus.company.toLowerCase()))]
        .map((company) => capitalizeWords(company));

    // Get unique ticket types
    const uniqueTicketTypes = [...new Set(busData.map((bus) => bus.duration))];

    const handleSearchTickets = () => {
        if (!busService) {
            alert("Please select a bus service.");
            return;
        }
        if (!ticketType) {
            alert("Please select a ticket type.");
            return;
        }
        navigate(`/search?bus=${busService}&ticketType=${ticketType}`);
    };

    const handleToggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <div className="absolute top-3 right-24 z-50">
                <div className="block md:hidden">
                    <button className="p-2 h-10 w-10 rounded-md flex items-center justify-center"
                        onClick={handleToggleDropdown}>
                        <FiSearch size={20} className="text-white" />
                    </button>
                </div>
            </div>

            {isOpen && (
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
                                {/* Select Bus Service */}
                                <div className="flex flex-col w-full lg:w-auto">
                                    <label className="text-base md:text-lg font-semibold mb-2">
                                        Select Bus Service
                                    </label>
                                    <select
                                        className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-red-600"
                                        onChange={(e) => setBusService(e.target.value)}
                                        value={busService}
                                    >
                                        <option disabled value="">
                                            Select Bus
                                        </option>
                                        {uniqueCompanies.map((company, index) => (
                                            <option key={index} value={company}>{company}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Select Ticket Type */}
                                <div className="flex flex-col w-full lg:w-auto">
                                    <label className="text-base md:text-lg font-semibold mb-2">
                                        Select Ticket Type
                                    </label>
                                    <select
                                        className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-red-600"
                                        onChange={(e) => setTicketType(e.target.value)}
                                        value={ticketType}
                                    >
                                        <option disabled value="">
                                            Select Ticket Type
                                        </option>
                                        {uniqueTicketTypes.map((type, index) => (
                                            <option key={index} value={type}>{type}</option>
                                        ))}
                                    </select>
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
            )}
        </div>
    );
};

export default TicketSm;
