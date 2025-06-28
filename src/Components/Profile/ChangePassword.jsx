import { useState } from 'react';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { baseUrl } from '../../utilities/Utilities';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords({
            ...showPasswords,
            [field]: !showPasswords[field]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Validate passwords match
        if (formData.new_password !== formData.confirm_password) {
            setError('New passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${baseUrl}profile/change-password/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    current_password: formData.current_password,
                    new_password: formData.new_password
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Password changed successfully');
                setFormData({
                    current_password: '',
                    new_password: '',
                    confirm_password: ''
                });
            } else {
                setError(data.error || 'Failed to change password');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>

            {(error || success) && (
                <div className={`p-4 rounded-md mb-4 ${error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {error || success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Current Password */}
                <div>
                    <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-gray-400" />
                        </div>
                        <input
                            type={showPasswords.current ? 'text' : 'password'}
                            name="current_password"
                            id="current_password"
                            value={formData.current_password}
                            onChange={handleChange}
                            required
                            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#7F001D] focus:border-[#7F001D]"
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility('current')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            {showPasswords.current ? (
                                <FaEyeSlash className="text-gray-400 hover:text-gray-500" />
                            ) : (
                                <FaEye className="text-gray-400 hover:text-gray-500" />
                            )}
                        </button>
                    </div>
                </div>

                {/* New Password */}
                <div>
                    <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-gray-400" />
                        </div>
                        <input
                            type={showPasswords.new ? 'text' : 'password'}
                            name="new_password"
                            id="new_password"
                            value={formData.new_password}
                            onChange={handleChange}
                            required
                            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#7F001D] focus:border-[#7F001D]"
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility('new')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            {showPasswords.new ? (
                                <FaEyeSlash className="text-gray-400 hover:text-gray-500" />
                            ) : (
                                <FaEye className="text-gray-400 hover:text-gray-500" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Confirm New Password */}
                <div>
                    <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-gray-400" />
                        </div>
                        <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            name="confirm_password"
                            id="confirm_password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            required
                            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#7F001D] focus:border-[#7F001D]"
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility('confirm')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            {showPasswords.confirm ? (
                                <FaEyeSlash className="text-gray-400 hover:text-gray-500" />
                            ) : (
                                <FaEye className="text-gray-400 hover:text-gray-500" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#7F001D] text-white py-2 px-4 rounded-md hover:bg-[#5F0016] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7F001D] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Changing Password...' : 'Change Password'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword; 