/**
 * Payment Success island – shows success message, then redirects to /yourticket.
 */
import { useEffect } from 'react';

export default function PaymentSuccessIsland() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/yourticket';
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="mb-4">
          <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Successful!</h2>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your transaction has been completed successfully.
        </p>
        <p className="text-sm text-gray-500">Redirecting to your tickets page...</p>
      </div>
    </div>
  );
}
