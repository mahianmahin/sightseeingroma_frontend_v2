import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaChartBar, FaTicketAlt, FaHistory } from 'react-icons/fa';
import { baseUrl } from '../utilities/Utilities';
import ProfileInfo from '../Components/Profile/ProfileInfo';
import ChangePassword from '../Components/Profile/ChangePassword';
import PurchaseStats from '../Components/Profile/PurchaseStats';

export default function Profile() {
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const response = await fetch(`${baseUrl}profile/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                const data = await response.json();
                setProfileData(data.data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile Information', icon: <FaUser /> },
        { id: 'password', label: 'Change Password', icon: <FaLock /> },
        { id: 'stats', label: 'Purchase Statistics', icon: <FaChartBar /> }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Profile Header with Banner */}
                <div className="bg-gradient-to-r from-[#7F001D] to-[#5F0016] rounded-lg shadow-xl p-8 mb-8 text-white">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                            <FaUser className="text-[#7F001D] text-3xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{profileData?.username || 'Welcome'}</h1>
                            <p className="mt-2 text-gray-100">Manage your account settings and view your travel history</p>
                        </div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        <div className="bg-white bg-opacity-10 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <FaTicketAlt className="text-2xl" />
                                <div>
                                    <p className="text-sm">Total Bookings</p>
                                    <p className="text-xl font-semibold">{profileData?.total_bookings}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white bg-opacity-10 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <FaHistory className="text-2xl" />
                                <div>
                                    <p className="text-sm">Member Since</p>
                                    <p className="text-xl font-semibold">{profileData?.member_since}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white bg-opacity-10 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <FaChartBar className="text-2xl" />
                                <div>
                                    <p className="text-sm">Total Spent</p>
                                    <p className="text-xl font-semibold">€{profileData?.total_spent}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="bg-white rounded-lg shadow-md mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                                        activeTab === tab.id
                                            ? 'border-[#7F001D] text-[#7F001D]'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        {tab.icon}
                                        {tab.label}
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7F001D]"></div>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'profile' && <ProfileInfo profileData={profileData} onUpdate={fetchProfileData} />}
                            {activeTab === 'password' && <ChangePassword />}
                            {activeTab === 'stats' && <PurchaseStats />}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

