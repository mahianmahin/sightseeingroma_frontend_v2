import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes, FaWifi, FaUsers, FaClock, FaMapMarkedAlt } from 'react-icons/fa';
import { baseUrl } from '../utilities/Utilities';
import Loader from '../Components/Loader/Loader';

const TicketComparison = () => {
    const navigate = useNavigate();
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState('all');

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}packages/`);
            if (!response.ok) throw new Error('Failed to fetch packages');
            
            const data = await response.json();
            if (data.status === 200) {
                setPackages(data.bus_data || []);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Get unique durations for filter
    const durations = ['all', ...new Set(packages.map(pkg => pkg.ticket_type))];

    // Filter packages by duration
    const filteredPackages = selectedDuration === 'all' 
        ? packages 
        : packages.filter(pkg => pkg.ticket_type === selectedDuration);

    // Get featured/recommended packages
    const recommendedPackages = packages.filter(pkg => pkg.is_featured).slice(0, 4);

    const handleViewTicket = (packageTag) => {
        navigate(`/manageBookings/E9/${packageTag}`);
    };

    if (loading) return <Loader />;
    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-red-600">Error: {error}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-[#930B31] text-white py-32 pb-16 md:py-24">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl md:text-5xl font-bold text-center mb-4">
                        Compare Bus Tour Tickets
                    </h1>
                    <p className="text-center text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
                        Find the perfect ticket for your Rome adventure. Compare features, prices, and durations.
                    </p>
                </div>
            </div>

            {/* Filter Section */}
            <div className="container mx-auto px-4 -mt-8">
                <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {durations.map((duration) => (
                            <button
                                key={duration}
                                onClick={() => setSelectedDuration(duration)}
                                className={`px-4 md:px-6 py-2 rounded-full font-semibold text-sm md:text-base transition-all duration-200 ${
                                    selectedDuration === duration
                                        ? 'bg-[#930B31] text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {duration === 'all' ? 'All Tickets' : duration.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Comparison Table Section */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">
                    Ticket Comparison
                </h2>

                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto bg-white rounded-lg shadow-lg">
                    <table className="w-full">
                        <thead className="bg-[#930B31] text-white">
                            <tr>
                                <th className="px-6 py-4 text-left font-semibold">Ticket Name</th>
                                <th className="px-6 py-4 text-center font-semibold">Company</th>
                                <th className="px-6 py-4 text-center font-semibold">Duration</th>
                                <th className="px-6 py-4 text-center font-semibold">Adult Price</th>
                                <th className="px-6 py-4 text-center font-semibold">Youth Price</th>
                                <th className="px-6 py-4 text-center font-semibold">Features</th>
                                <th className="px-6 py-4 text-center font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredPackages.map((pkg, index) => (
                                <tr key={pkg.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <p className="font-semibold text-gray-900">{pkg.title}</p>
                                                <p className="text-sm text-gray-500">{pkg.type}</p>
                                            </div>
                                            {pkg.is_featured && (
                                                <span className="bg-[#FAD502] text-[#930B31] text-xs font-bold px-2 py-1 rounded">
                                                    FEATURED
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 capitalize">
                                            {pkg.company}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="font-semibold text-[#930B31]">{pkg.duration}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-lg font-bold text-gray-900">€{pkg.adult_price}</span>
                                            {pkg.off_price > pkg.adult_price && (
                                                <span className="text-sm text-gray-400 line-through">€{pkg.off_price}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-lg font-bold text-gray-900">€{pkg.youth_price}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            <span className="text-green-500" title="WiFi Available"><FaWifi /></span>
                                            <span className="text-blue-500" title="Audio Guide"><FaUsers /></span>
                                            <span className="text-orange-500" title="Flexible Timing"><FaClock /></span>
                                            <span className="text-purple-500" title="Route Map"><FaMapMarkedAlt /></span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleViewTicket(pkg.package_tag)}
                                            className="bg-[#930B31] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-800 transition-colors"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Grid View */}
                <div className="lg:hidden grid grid-cols-3 gap-3">
                    {filteredPackages.map((pkg) => (
                        <div key={pkg.id} className="bg-white rounded-lg shadow-md p-3 border border-gray-200 flex flex-col">
                            {/* Ticket Name */}
                            <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 min-h-[40px]">
                                {pkg.title}
                            </h3>
                            
                            {/* Duration */}
                            <div className="mb-2">
                                <p className="text-xs text-gray-500 mb-1">Duration</p>
                                <p className="font-semibold text-[#930B31] text-sm uppercase">{pkg.duration}</p>
                            </div>

                            {/* Price */}
                            <div className="mb-3 flex-grow">
                                <p className="text-xs text-gray-500 mb-1">Price</p>
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold text-gray-900">€{pkg.adult_price}</span>
                                    {pkg.off_price > pkg.adult_price && (
                                        <span className="text-xs text-gray-400 line-through">€{pkg.off_price}</span>
                                    )}
                                </div>
                            </div>

                            {/* View Button */}
                            <button
                                onClick={() => handleViewTicket(pkg.package_tag)}
                                className="w-full bg-[#930B31] text-white py-2 rounded-md text-sm font-semibold hover:bg-red-800 transition-colors"
                            >
                                View
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recommended Packages Section */}
            {recommendedPackages.length > 0 && (
                <div className="bg-gray-100 py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-gray-800">
                            Recommended Packages
                        </h2>
                        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
                            Our most popular and highly-rated tour packages, chosen by thousands of satisfied customers
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {recommendedPackages.map((pkg) => (
                                <div key={pkg.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                                    <div className="bg-gradient-to-br from-[#930B31] to-red-800 text-white p-6">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="bg-[#FAD502] text-[#930B31] text-xs font-bold px-3 py-1 rounded-full">
                                                RECOMMENDED
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-xl mb-2 line-clamp-2">{pkg.title}</h3>
                                        <p className="text-sm opacity-90 capitalize">{pkg.company}</p>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-baseline gap-2 mb-4">
                                            <span className="text-3xl font-bold text-[#930B31]">€{pkg.adult_price}</span>
                                            {pkg.off_price > pkg.adult_price && (
                                                <span className="text-lg text-gray-400 line-through">€{pkg.off_price}</span>
                                            )}
                                        </div>

                                        <div className="space-y-2 mb-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FaClock className="text-[#930B31]" />
                                                <span>{pkg.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FaCheck className="text-green-500" />
                                                <span>Free WiFi Onboard</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FaCheck className="text-green-500" />
                                                <span>Audio Guide</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FaCheck className="text-green-500" />
                                                <span>Hop-On Hop-Off</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleViewTicket(pkg.package_tag)}
                                            className="w-full bg-[#930B31] text-white py-3 rounded-lg font-bold hover:bg-red-800 transition-colors"
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketComparison;
