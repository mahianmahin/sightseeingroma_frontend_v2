import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const PaymentReturn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [packageIdentifier, setPackageIdentifier] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      setStatus('error');
      return;
    }

    // Initialize Stripe
    let key = '';
    let mode = "live";

    if (mode === "live") {
      key = 'pk_live_51RUF9vDVqSXnpb2PoAQmiqLb01JmshH8xVAaa73g5eeBxa8wduq5pfIt0sHWWLw5MkpyfQEv78asGbqOlOmiFAXY00MH7pQVHr';
    } else if (mode === "test") {
      key = 'pk_test_51RUFA3Rl7eg880YGrbKxXn5f4L0jgxm1OJSr191iJkz1m0MccRsWc9OiycCwXWwtbCUW3vR3N5ks6WUjbQUBTN3X00okzcby4o';
    }

    loadStripe(key).then(stripe => {
      if (!stripe) {
        setStatus('error');
        return;
      }

      // Retrieve the session
      stripe.retrieveCheckoutSession(sessionId).then(({ session }) => {
        if (session.status === 'complete') {
          setStatus('success');
          setPackageIdentifier(session.client_reference_id);
          
          // Redirect to success page after a short delay
          setTimeout(() => {
            navigate(`/success/${session.client_reference_id}/`);
          }, 2000);
        } else if (session.status === 'open') {
          setStatus('processing');
        } else {
          setStatus('error');
        }
      }).catch(error => {
        console.error('Error retrieving session:', error);
        setStatus('error');
      });
    }).catch(error => {
      console.error('Error loading Stripe:', error);
      setStatus('error');
    });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {status === 'processing' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h2>
            <p className="text-gray-600">Please wait while we verify your payment...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Your booking has been confirmed.</p>
            <p className="text-sm text-gray-500">Redirecting to your ticket...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Issue</h2>
            <p className="text-gray-600 mb-6">We encountered an issue processing your payment.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#930B31] text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-colors font-semibold"
            >
              Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentReturn;
