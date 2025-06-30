import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackUserActivity, ACTIVITY_TYPES } from '../utilities/activityTracker';

const PaymentSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Track successful payment
        const urlParams = new URLSearchParams(window.location.search);
        const amount = urlParams.get('amount');
        const ticketType = urlParams.get('ticketType');

        trackUserActivity(ACTIVITY_TYPES.PAYMENT_COMPLETED, {
            amount: amount,
            ticketType: ticketType,
            status: 'completed'
        });

        // Track page view
        trackUserActivity(ACTIVITY_TYPES.PAGE_VIEW, { pageName: 'Payment Success' });

        // Redirect to tickets page after 3 seconds
        const timer = setTimeout(() => {
            navigate('/yourticket');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <div className="mb-4">
                    <svg
                        className="mx-auto h-16 w-16 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Payment Successful!
                </h2>
                <p className="text-gray-600 mb-8">
                    Thank you for your purchase. Your transaction has been completed successfully.
                </p>
                <p className="text-sm text-gray-500">
                    Redirecting to your tickets page...
                </p>
            </div>
        </div>
    );
};

export default PaymentSuccess;
