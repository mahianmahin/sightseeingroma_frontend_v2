import { useState, useEffect } from 'react';
import { FaTicketAlt, FaEuroSign, FaCalendarAlt, FaChartBar } from 'react-icons/fa';
import { baseUrl } from '../../utilities/Utilities';

const PurchaseStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPurchaseStats();
    }, []);

    const fetchPurchaseStats = async () => {
        try {
            const response = await fetch(`${baseUrl}profile/statistics/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data.data);
            } else {
                setError('Failed to fetch purchase statistics');
            }
        } catch (error) {
            setError('An error occurred while fetching statistics');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7F001D]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#7F001D] bg-opacity-10 rounded-full">
                            <FaTicketAlt className="text-[#7F001D] text-xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Purchases</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.total_purchases}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#7F001D] bg-opacity-10 rounded-full">
                            <FaEuroSign className="text-[#7F001D] text-xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Spent</p>
                            <p className="text-2xl font-semibold text-gray-900">€{stats.total_spent.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#7F001D] bg-opacity-10 rounded-full">
                            <FaCalendarAlt className="text-[#7F001D] text-xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Recent Purchases</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.recent_purchases}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#7F001D] bg-opacity-10 rounded-full">
                            <FaChartBar className="text-[#7F001D] text-xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Recent Spent</p>
                            <p className="text-2xl font-semibold text-gray-900">€{stats.recent_spent.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Purchase Breakdown */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Bus Tours</span>
                            <span className="font-medium text-gray-900">{stats.purchase_breakdown.bus_tours}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#7F001D]"
                                style={{
                                    width: `${(stats.purchase_breakdown.bus_tours / stats.total_purchases) * 100}%`
                                }}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Museum Tickets</span>
                            <span className="font-medium text-gray-900">{stats.purchase_breakdown.museum_tickets}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#7F001D]"
                                style={{
                                    width: `${(stats.purchase_breakdown.museum_tickets / stats.total_purchases) * 100}%`
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Tickets */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 p-6 border-b">Recent Tickets</h3>
                <div className="divide-y">
                    {stats.recent_tickets.map((ticket, index) => (
                        <div key={index} className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h4 className="font-medium text-gray-900">{ticket.package}</h4>
                                    <p className="text-sm text-gray-600">{formatDate(ticket.date)}</p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-sm">
                                        <p className="text-gray-600">Tickets</p>
                                        <p className="font-medium text-gray-900">{ticket.ticket_count}</p>
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-gray-600">Total</p>
                                        <p className="font-medium text-gray-900">€{ticket.total_price.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PurchaseStats; 