import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../utilities/Utilities";

// Emoji mapping for each ticket type
const TICKET_TYPE_EMOJIS = {
    "24 hours": "⏰",
    "48 hours": "🌞",
    "72 hours": "🌟",
    "1 day": "📅",
    "daily tour": "🎯",
    "half day": "🌓",
    "one run": "🚌",
    "3 pass": "🎫",
};

// Custom order for ticket types (add or reorder as needed)
const TICKET_TYPE_ORDER = [
    "half day",
    "1 day",
    "24 hours",
    "48 hours",
    "72 hours",
    "daily tour",
    "one run",
    "3 pass"
];

// Skeleton array for loading state
const SKELETON_COUNT = 8;

const TicketTypeSearch = () => {
    const navigate = useNavigate();
    const [ticketType, setTicketType] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [busData, setBusData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [showEmojis, setShowEmojis] = useState(true); // Main state for showing/hiding emojis

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
                setTimeout(() => setLoading(false), 1000); // Add a small delay to show loading state
            }
        };
        fetchData();
    }, []);

    // Get unique ticket types and sort them according to custom order
    const uniqueTicketTypes = [...new Set(busData.map((bus) => bus.ticket_type))]
        .sort((a, b) => {
            const indexA = TICKET_TYPE_ORDER.indexOf(a.toLowerCase());
            const indexB = TICKET_TYPE_ORDER.indexOf(b.toLowerCase());
            
            // If both types are in the order array, sort by their index
            if (indexA !== -1 && indexB !== -1) {
                return indexA - indexB;
            }
            
            // If only one type is in the order array, prioritize it
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            
            // If neither type is in the order array, maintain their original order
            return 0;
        });

    const handleSearchTickets = () => {
        if (!ticketType) {
            setErrorMessage("Please select a ticket type.");
            return;
        }
        navigate(`/search?ticketType=${ticketType}`);
    };

    const clearErrorMessage = () => {
        setErrorMessage("");
    }

    // Skeleton Loading Component
    const SkeletonRadio = () => (
        <div className="relative flex items-center justify-between p-4 rounded-lg bg-white animate-pulse">
            <div className="flex items-center space-x-3">
                <div className="flex flex-col space-y-2">
                    <div className="h-4 w-24 bg-gray-300 rounded"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
            </div>
            <div className="w-5 h-5 rounded-full bg-gray-300"></div>
        </div>
    );

    // Desktop Component
    const DesktopSearch = () => (
        <div className="w-[100%] uppercase mx-auto mt-8 z-30">
            <div className="bg-gray-200/90 backdrop-blur-sm text-black rounded-lg shadow-md p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
                    {loading ? (
                        // Skeleton loading
                        [...Array(SKELETON_COUNT)].map((_, index) => (
                            <SkeletonRadio key={index} />
                        ))
                    ) : (
                        // Actual radio buttons
                        uniqueTicketTypes.map((type, index) => (
                            <label
                                key={index}
                                className={`relative flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                    ticketType === type
                                        ? 'bg-[#930B31] text-white'
                                        : 'bg-white hover:bg-gray-100'
                                }`}
                            >
                                <div className="flex items-center" onClick={clearErrorMessage}>
                                    <input
                                        type="radio"
                                        name="ticketType"
                                        value={type}
                                        checked={ticketType === type}
                                        onChange={(e) => setTicketType(e.target.value)}
                                        className="hidden"
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">
                                            {showEmojis && TICKET_TYPE_EMOJIS[type]} {type}
                                        </span>
                                        <span className="text-xs opacity-75">
                                            {type.includes('HOUR') ? 'Unlimited Access' : 'Single Day'}
                                        </span>
                                    </div>
                                </div>
                                <div 
                                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                        ticketType === type 
                                            ? 'border-white bg-white' 
                                            : 'border-gray-400'
                                    }`}
                                >
                                    {ticketType === type && (
                                        <div className="w-2 h-2 rounded-full bg-[#930B31]"></div>
                                    )}
                                </div>
                            </label>
                        ))
                    )}
                </div>
                <div className="flex justify-center flex-col items-center">
                    <button
                        className={`px-6 py-2 bg-[#930B31] text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm shadow-lg ${
                            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-800'
                        }`}
                        onClick={handleSearchTickets}
                        disabled={loading}
                    >
                        <FaSearch className="text-sm" /> Search Available Tickets
                    </button>
                    {errorMessage && (<>
                        <br></br>
                        <p className="text-red-500 text-sm mt-2">{errorMessage}</p></>
                    )}
                </div>
            </div>
        </div>
    );

    // Mobile Component
    const MobileSearch = () => (
        <div>
            <div className="absolute top-3 right-24 z-50">
                <div className="block md:hidden">
                    <button 
                        className="p-2 h-10 w-10 rounded-md flex items-center justify-center"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <FiSearch size={20} className="text-white" />
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="w-full px-4 my-5">
                    <div className="bg-gray-200 text-black rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-center mb-4">Select Your Ticket Duration</h2>
                        <div className="grid grid-cols-1 gap-3 mb-6">
                            {loading ? (
                                // Skeleton loading for mobile
                                [...Array(SKELETON_COUNT)].map((_, index) => (
                                    <SkeletonRadio key={index} />
                                ))
                            ) : (
                                // Actual radio buttons for mobile
                                uniqueTicketTypes.map((type, index) => (
                                    <label
                                        key={index}
                                        className={`relative flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                            ticketType === type
                                                ? 'bg-[#930B31] text-white'
                                                : 'bg-white hover:bg-gray-100'
                                        }`}
                                    >
                                        <div className="flex items-center" onClick={clearErrorMessage}>
                                            <input
                                                type="radio"
                                                name="ticketType"
                                                value={type}
                                                checked={ticketType === type}
                                                onChange={(e) => setTicketType(e.target.value)}
                                                className="hidden"
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-semibold">
                                                    {showEmojis && TICKET_TYPE_EMOJIS[type]} {type}
                                                </span>
                                                <span className="text-xs opacity-75">
                                                    {type.includes('HOUR') ? 'Unlimited Access' : 'Single Day'}
                                                </span>
                                            </div>
                                        </div>
                                        <div 
                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                ticketType === type 
                                                    ? 'border-white bg-white' 
                                                    : 'border-gray-400'
                                            }`}
                                        >
                                            {ticketType === type && (
                                                <div className="w-3 h-3 rounded-full bg-[#930B31]"></div>
                                            )}
                                        </div>
                                    </label>
                                ))
                            )}
                        </div>
                        <div className="flex justify-center flex-col items-center">
                            <button
                                className={`w-full px-6 py-3 bg-[#930B31] text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg ${
                                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-800'
                                }`}
                                onClick={handleSearchTickets}
                                disabled={loading}
                            >
                                <FaSearch /> Search Tickets
                            </button>
                            {errorMessage && (
                                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Desktop View */}
            <div className="hidden md:block">
                <DesktopSearch />
            </div>

            {/* Mobile View */}
            <div className="block md:hidden">
                <MobileSearch />
            </div>
        </>
    );
};

export default TicketTypeSearch; 