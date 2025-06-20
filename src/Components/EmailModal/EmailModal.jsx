import { useEffect, useState } from 'react';

const EmailModal = ({ isOpen, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Add a small delay before showing the modal for smooth animation
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 100);
            return () => clearTimeout(timer);
        }
        setIsVisible(false);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div 
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-800 ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}
        >
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div 
                className={`relative bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ${
                    isVisible ? 'scale-100' : 'scale-95'
                }`}
            >
                {/* Modal Header */}
                <div className="bg-[#930B31] text-white p-6 rounded-t-lg">
                    <h3 className="text-xl text-center font-semibold">Email Sent!</h3>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <div className="mb-6 text-center">
                        {/* Email Icon */}
                        <div className="mx-auto w-16 h-16 bg-[#FAD502E0] rounded-full flex items-center justify-center mb-4">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-8 w-8 text-[#930B31]" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                                />
                            </svg>
                        </div>

                        <p className="text-gray-600 text-sm md:text-base">
                            We've sent your ticket details to your email address. Please check your inbox (and spam folder) for the confirmation email.
                        </p>
                    </div>

                    {/* Important Notice */}
                    <div className="bg-yellow-50 border-l-4 border-[#FAD502E0] p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg 
                                    className="h-5 w-5 text-yellow-600" 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 20 20" 
                                    fill="currentColor"
                                >
                                    <path 
                                        fillRule="evenodd" 
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                                        clipRule="evenodd" 
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    If you don't see the email in your inbox, please check your spam folder.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="w-full bg-[#930B31] text-white py-2 px-4 rounded-lg hover:bg-red-800 transition-colors duration-200 font-semibold"
                    >
                        Okay, Got It!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailModal; 