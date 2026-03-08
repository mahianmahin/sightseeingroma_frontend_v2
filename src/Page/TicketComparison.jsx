import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes, FaWifi, FaUsers, FaClock, FaMapMarkedAlt } from 'react-icons/fa';
import scrollToTop, { baseUrl } from '../utilities/Utilities';
import Loader from '../Components/Loader/Loader';
import TicketCard from '../Components/TicketCard/TicketCard';

const TicketComparison = () => {
    const navigate = useNavigate();
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState('all');

    useEffect(() => {
        fetchPackages();
        scrollToTop();
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
            <div className="bg-[#930B31] text-white py-32 pb-16">
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
                    Tickets At A Glance
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

                {/* Mobile Table View */}
                <div className="lg:hidden overflow-x-auto bg-white rounded-lg shadow-lg">
                    {(() => {
                        // Group packages by company
                        const byCompany = filteredPackages.reduce((acc, pkg) => {
                            const key = pkg.company || 'Other';
                            if (!acc[key]) acc[key] = [];
                            acc[key].push(pkg);
                            return acc;
                        }, {});

                        return (
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#930B31] text-white sticky top-0">
                                    <tr>
                                        <th className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wide">Ticket</th>
                                        <th className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wide text-center">Dur.</th>
                                        <th className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wide text-center">Adult</th>
                                        <th className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wide text-center">Youth</th>
                                        <th className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wide text-center">Buy</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(byCompany).map(([company, pkgs]) => (
                                        <>
                                            {/* Company header row */}
                                            <tr key={`company-${company}`} className="bg-[#FAD502]/20 border-t-2 border-[#930B31]">
                                                <td colSpan={5} className="px-2 py-1.5">
                                                    <span className="text-[10px] font-bold text-[#930B31] uppercase tracking-widest">
                                                        {company}
                                                    </span>
                                                </td>
                                            </tr>
                                            {/* Ticket rows */}
                                            {pkgs.map((pkg, i) => (
                                                <tr
                                                    key={pkg.id}
                                                    className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-100`}
                                                >
                                                    <td className="px-2 py-2 max-w-[120px]">
                                                        <p className="text-[11px] font-semibold text-gray-900 leading-tight line-clamp-2">{pkg.title}</p>
                                                        {pkg.is_featured && (
                                                            <span className="inline-block mt-0.5 bg-[#FAD502] text-[#930B31] text-[8px] font-bold px-1 rounded leading-tight">
                                                                FEATURED
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-2 py-2 text-center whitespace-nowrap">
                                                        <span className="text-[10px] font-semibold text-[#930B31]">{pkg.duration}</span>
                                                    </td>
                                                    <td className="px-2 py-2 text-center">
                                                        <span className="text-[11px] font-bold text-gray-900">€{pkg.adult_price}</span>
                                                        {pkg.off_price > pkg.adult_price && (
                                                            <span className="block text-[9px] text-gray-400 line-through">€{pkg.off_price}</span>
                                                        )}
                                                    </td>
                                                    <td className="px-2 py-2 text-center">
                                                        <span className="text-[11px] font-bold text-gray-900">€{pkg.youth_price}</span>
                                                    </td>
                                                    <td className="px-2 py-2 text-center">
                                                        <button
                                                            onClick={() => handleViewTicket(pkg.package_tag)}
                                                            className="bg-[#930B31] text-white px-2 py-1 rounded text-[10px] font-semibold hover:bg-red-800 transition-colors whitespace-nowrap"
                                                        >
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        );
                    })()}
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

                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                            {recommendedPackages.map((pkg) => (
                                <TicketCard
                                    key={pkg.id}
                                    title={pkg.title}
                                    subtitle={pkg.type}
                                    image={pkg.thumbnail_large}
                                    duration={pkg.duration}
                                    offPrice={pkg.off_price}
                                    price={pkg.adult_price}
                                    price2={pkg.youth_price}
                                    id={pkg.package_tag}
                                    status="E9"
                                    thumbnail_small={pkg.thumbnail_small}
                                    thumbnail_large={pkg.thumbnail_large}
                                    thumbnail_small_alt={pkg.thumbnail_small_alt}
                                    thumbnail_large_alt={pkg.thumbnail_large_alt}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketComparison;
