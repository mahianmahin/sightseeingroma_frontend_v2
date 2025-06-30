import { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { baseUrl } from './../../../utilities/Utilities';
import { trackUserActivity, ACTIVITY_TYPES } from '../../../utilities/activityTracker';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleClick = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setError(false);
        setLoading(true);

        const header = {
            mode: "cors",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        };

        try {
            const response = await fetch(`${baseUrl}api/token/`, header);
            if (response.ok) {
                const data = await response.json();
                window.localStorage.setItem("refresh", data.refresh);
                window.localStorage.setItem("access", data.access);
                navigate("/");

                // Track successful login
                await trackUserActivity(ACTIVITY_TYPES.USER_LOGIN, {
                    email: username
                });
            } else if (response.status === 401) {
                setErrorMessage("Invalid username or password!");
                setError(true);
                setPassword("");
            }
        } catch (err) {
            setErrorMessage("Something went wrong! Please try again.");
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    // Track page view on component mount
    useEffect(() => {
        trackUserActivity(ACTIVITY_TYPES.PAGE_VIEW, { pageName: 'Login' });
    }, []);

    return (
        <div
            className="min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 animated-gradient-bg"
            style={{
                background: "linear-gradient(135deg, #7F001D, #FFD600, #7F001D, #FFD600)",
                backgroundSize: "400% 400%",
                animation: "gradientBG 25s ease-in-out infinite"
            }}
        >
        <style>
            {`
                @keyframes gradientBG {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }
            `}
        </style>
            <div className="max-w-6xl w-full flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Left Side - Image and Logo */}
                <div className="md:w-1/2 relative hidden md:block">
                    <img
                        src="./Login/login.png"
                        alt="Login"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30" />
                    <div className="absolute top-6 left-6">
                        <img src="https://sightseeingroma.pythonanywhere.com/media/logo/Logo.png" alt="Logo" className="h-16" />
                    </div>
                    <div className="absolute bottom-10 left-6 text-white">
                        <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
                        <p className="text-lg">Access your bookings and manage your trips</p>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="md:w-1/2 p-8 lg:p-12">
                    {/* Mobile Logo */}
                    <div className="md:hidden flex justify-center mb-8">
                        <img src="https://sightseeingroma.pythonanywhere.com/media/logo/Logo.png" alt="Logo" className="h-16" />
                    </div>

                    <div className="text-center md:text-left mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
                        <p className="mt-2 text-gray-600">Welcome back to Sightseeing Roma</p>
                    </div>

                    <form onSubmit={handleClick} className="space-y-6">
                        {/* Username Input */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <FaEye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="flex justify-end">
                            <Link 
                                to="/forgot-password" 
                                className="text-sm font-medium text-[#7F001D] hover:text-red-900"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                                {errorMessage}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                                loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-[#7F001D] hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-900"
                            }`}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </button>

                        {/* Register Link */}
                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{" "}
                                <Link to="/registation" className="font-medium text-[#7F001D] hover:text-red-900">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </form>

                    {/* Back to Home Button */}
                    <button
                        onClick={() => navigate("/")}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors duration-200"
                    >
                        <RxCross2 size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
