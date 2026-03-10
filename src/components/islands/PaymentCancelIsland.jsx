/**
 * Payment Cancel island – shows cancel message, then redirects to home.
 */
import { useEffect } from 'react';

export default function PaymentCancelIsland() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/';
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="mb-4">
          <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Cancelled</h2>
        <p className="text-gray-600 mb-8">
          Your payment was cancelled. No charges were made to your account.
        </p>
        <p className="text-sm text-gray-500">Redirecting to home page...</p>
      </div>
    </div>
  );
}
