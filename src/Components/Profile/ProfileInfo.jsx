import { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { baseUrl } from '../../utilities/Utilities';

const ProfileInfo = ({ profileData, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        email: profileData?.email || '',
        phone_number: profileData?.phone_number || ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${baseUrl}profile/update/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Profile updated successfully');
                setIsEditing(false);
                onUpdate(); // Refresh profile data
            } else {
                setError(data.error || 'Failed to update profile');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    const handleCancel = () => {
        setFormData({
            email: profileData?.email || '',
            phone_number: profileData?.phone_number || ''
        });
        setIsEditing(false);
        setError('');
        setSuccess('');
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 text-[#7F001D] hover:text-[#5F0016]"
                    >
                        <FaEdit />
                        Edit Profile
                    </button>
                )}
            </div>

            {(error || success) && (
                <div className={`p-4 rounded-md mb-4 ${error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {error || success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username (Read-only) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                        <FaUser className="text-gray-400" />
                        <span className="text-gray-700">{profileData?.username}</span>
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="text-gray-400" />
                        </div>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`block w-full pl-10 pr-3 py-2 border ${
                                isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'
                            } rounded-md focus:outline-none focus:ring-[#7F001D] focus:border-[#7F001D]`}
                        />
                    </div>
                </div>

                {/* Phone Number */}
                <div>
                    <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaPhone className="text-gray-400" />
                        </div>
                        <input
                            type="tel"
                            name="phone_number"
                            id="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`block w-full pl-10 pr-3 py-2 border ${
                                isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'
                            } rounded-md focus:outline-none focus:ring-[#7F001D] focus:border-[#7F001D]`}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-[#7F001D] text-white py-2 px-4 rounded-md hover:bg-[#5F0016] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7F001D] flex items-center justify-center gap-2"
                        >
                            <FaCheck />
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center justify-center gap-2"
                        >
                            <FaTimes />
                            Cancel
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default ProfileInfo;