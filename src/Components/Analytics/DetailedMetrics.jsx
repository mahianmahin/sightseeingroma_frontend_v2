import { useState, useEffect } from 'react';
import { baseUrl } from '../../utilities/Utilities';
import { FaArrowLeft } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const DetailedMetrics = ({ metric, onClose }) => {
    const [data, setData] = useState({
        activities: [],
        statistics: {},
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchDetailedData = async () => {
            try {
                const token = localStorage.getItem('access');
                const response = await fetch(`${baseUrl}analytics/detailed/${metric.toLowerCase().replace(/\s+/g, '-')}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await response.json();
                setData({
                    activities: result.activities || [],
                    statistics: result.statistics || {},
                    loading: false,
                    error: null
                });
            } catch (error) {
                setData(prev => ({
                    ...prev,
                    loading: false,
                    error: 'Failed to load detailed metrics'
                }));
            }
        };

        fetchDetailedData();
    }, [metric]);

    if (data.loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#930B31]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                    <FaArrowLeft className="text-[#930B31]" />
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-[#930B31]">
                    {metric} Details
                </h1>
            </div>

            {/* Statistics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Conversion Metrics */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Conversion Statistics</h2>
                    <div className="h-64">
                        <Pie
                            data={{
                                labels: Object.keys(data.statistics.conversionRates || {}),
                                datasets: [{
                                    data: Object.values(data.statistics.conversionRates || {}),
                                    backgroundColor: [
                                        '#930B31',
                                        '#FF385C',
                                        '#FFB6C1',
                                        '#FFC0CB',
                                    ]
                                }]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false
                            }}
                        />
                    </div>
                </div>

                {/* Trend Analysis */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Weekly Trends</h2>
                    <div className="h-64">
                        <Bar
                            data={{
                                labels: data.statistics.weeklyTrends?.labels || [],
                                datasets: [{
                                    label: metric,
                                    data: data.statistics.weeklyTrends?.data || [],
                                    backgroundColor: '#930B31'
                                }]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {Object.entries(data.statistics.kpi || {}).map(([key, value]) => (
                    <div key={key} className="bg-white p-4 rounded-lg shadow-lg">
                        <h3 className="text-gray-600 font-semibold mb-2">
                            {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </h3>
                        <p className="text-2xl font-bold text-[#930B31]">
                            {typeof value === 'number' ? `${value}%` : value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Detailed Activity Log */}
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                <h2 className="text-xl font-bold mb-4">Detailed Activity Log</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-4 py-2 text-left">Time</th>
                                <th className="px-4 py-2 text-left">User</th>
                                <th className="px-4 py-2 text-left">Details</th>
                                <th className="px-4 py-2 text-left">Location</th>
                                <th className="px-4 py-2 text-left">IP Address</th>
                                {metric === 'Payment Initiations' && (
                                    <th className="px-4 py-2 text-left">Amount</th>
                                )}
                                <th className="px-4 py-2 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.activities.map((activity, index) => (
                                <tr key={index} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2 text-sm">
                                        {new Date(activity.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2 text-sm">
                                        {activity.user || 'Anonymous'}
                                    </td>
                                    <td className="px-4 py-2 text-sm">
                                        {activity.details}
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
                                    {metric === 'Payment Initiations' && (
                                        <td className="px-4 py-2 text-sm">
                                            €{activity.amount}
                                        </td>
                                    )}
                                    <td className="px-4 py-2 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {activity.status}
                                        </span>
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

export default DetailedMetrics; 