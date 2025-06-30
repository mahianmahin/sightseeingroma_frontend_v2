import { useState, useEffect } from 'react';
import useSuperUser from '../hooks/useSuperUser';
import { baseUrl } from '../utilities/Utilities';
import { FaUsers, FaTicketAlt, FaMoneyBillWave } from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import { BiTime } from 'react-icons/bi';
import DetailedMetrics from '../Components/Analytics/DetailedMetrics';

const Analytics = () => {
    const { isSuperUser, isLoading, error } = useSuperUser();
    const [selectedMetric, setSelectedMetric] = useState(null);
    const [analyticsData, setAnalyticsData] = useState({
        userActivities: [],
        insights: {
            totalVisits: 0,
            ticketViews: 0,
            paymentInitiations: 0,
            successfulPayments: 0,
            cancelledPayments: 0
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = localStorage.getItem('access');
                const response = await fetch(`${baseUrl}analytics/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setAnalyticsData(data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isSuperUser) {
            fetchAnalytics();
        }
    }, [isSuperUser]);

    if (isLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#930B31]"></div>
            </div>
        );
    }

    if (!isSuperUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-[#930B31] mb-4">Access Restricted</h2>
                    <p className="text-gray-600">This page can only be accessed by superusers.</p>
                </div>
            </div>
        );
    }

    if (selectedMetric) {
        return <DetailedMetrics metric={selectedMetric} onClose={() => setSelectedMetric(null)} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            {/* Analytics Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[#930B31]">Analytics Dashboard</h1>
                <p className="text-gray-600">Real-time insights and user activities</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <MetricCard
                    icon={<FaUsers />}
                    title="Total Visits"
                    value={analyticsData.insights.totalVisits}
                    onClick={() => setSelectedMetric("Total Visits")}
                />
                <MetricCard
                    icon={<FaTicketAlt />}
                    title="Ticket Views"
                    value={analyticsData.insights.ticketViews}
                    onClick={() => setSelectedMetric("Ticket Views")}
                />
                <MetricCard
                    icon={<MdPayment />}
                    title="Payment Initiations"
                    value={analyticsData.insights.paymentInitiations}
                    onClick={() => setSelectedMetric("Payment Initiations")}
                />
                <MetricCard
                    icon={<FaMoneyBillWave />}
                    title="Successful Payments"
                    value={analyticsData.insights.successfulPayments}
                    onClick={() => setSelectedMetric("Successful Payments")}
                />
                <MetricCard
                    icon={<BiTime />}
                    title="Cancelled Payments"
                    value={analyticsData.insights.cancelledPayments}
                    onClick={() => setSelectedMetric("Cancelled Payments")}
                />
            </div>

            {/* User Activity Log */}
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                <h2 className="text-xl font-bold mb-4">User Activity Log</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-4 py-2 text-left">Time</th>
                                <th className="px-4 py-2 text-left">User</th>
                                <th className="px-4 py-2 text-left">Activity</th>
                                <th className="px-4 py-2 text-left">Location</th>
                                <th className="px-4 py-2 text-left">IP Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analyticsData.userActivities.map((activity, index) => (
                                <tr key={index} className="border-t">
                                    <td className="px-4 py-2 text-sm">
                                        {new Date(activity.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2 text-sm">
                                        {activity.user || 'Anonymous'}
                                    </td>
                                    <td className="px-4 py-2 text-sm">
                                        {activity.action}
                                    </td>
                                    <td className="px-4 py-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={`https://flagcdn.com/24x18/${activity.countryCode}.png`}
                                                alt={activity.country}
                                                className="w-6 h-4"
                                            />
                                            {activity.city}, {activity.country}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 text-sm font-mono">
                                        {activity.ipAddress}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Metric Card Component
const MetricCard = ({ icon, title, value, onClick }) => (
    <div 
        className="bg-white p-4 rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105"
        onClick={onClick}
    >
        <div className="flex items-center gap-3 mb-2">
            <span className="text-[#930B31] text-xl">{icon}</span>
            <h3 className="font-semibold text-gray-600">{title}</h3>
        </div>
        <p className="text-2xl font-bold text-[#930B31]">{value.toLocaleString()}</p>
    </div>
);

export default Analytics; 