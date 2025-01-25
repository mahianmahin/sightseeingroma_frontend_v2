import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { RiArrowUpSLine, RiArrowDownSLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../utilities/Utilities";

const Ticket = () => {
    const navigate = useNavigate();
    const [isBusServiceOpen, setIsBusServiceOpen] = useState(false);
    const [isTicketTypeOpen, setIsTicketTypeOpen] = useState(false);

    const [busService, setBusService] = useState("");
    const [ticketType, setTicketType] = useState("");
    const [busData, setBusData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    // Get unique company names and format them properly
    const uniqueCompanies = [...new Set(busData.map((bus) => bus.company.toLowerCase()))]
        .map((company) => capitalizeWords(company));

    // Get unique ticket types from busData
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

    return (
        <div className="w-full md:w-auto px-4 lg:px-0 my-5">
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
                            {uniqueCompanies.map((company, index) => (
                                <option key={index} value={company}>
                                    {company}
                                </option>
                            ))}
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

                {/* Select Ticket Type */}
                <div className="flex flex-col w-full lg:w-auto">
                    <label className="text-base md:text-lg font-semibold mb-2">
                        Select Ticket Type
                    </label>
                    <div className="relative">
                        <select
                            className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-md font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-red-600"
                            value={ticketType}
                            onChange={(e) => setTicketType(e.target.value)}
                            onFocus={() => setIsTicketTypeOpen(true)}
                            onBlur={() => setIsTicketTypeOpen(false)}
                        >
                            <option value="" disabled>Select Ticket Type</option>
                            {uniqueTicketTypes.map((type, index) => (
                                <option key={index} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            {isTicketTypeOpen ? (
                                <RiArrowUpSLine size={20} color="#000000" />
                            ) : (
                                <RiArrowDownSLine size={20} color="#000000" />
                            )}
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
