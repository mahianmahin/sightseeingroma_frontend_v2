import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import scrollToTop from '../utilities/Utilities';

const EmbeddedCheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [stripePromise, setStripePromise] = useState(null);
  const { clientSecret } = location.state || {};

  useEffect(() => {
    // Initialize Stripe
    let key = '';
    let mode = "live";

    if (mode === "live") {
      key = 'pk_live_51RUF9vDVqSXnpb2PoAQmiqLb01JmshH8xVAaa73g5eeBxa8wduq5pfIt0sHWWLw5MkpyfQEv78asGbqOlOmiFAXY00MH7pQVHr';
    } else if (mode === "test") {
      key = 'pk_test_51RUFA3Rl7eg880YGrbKxXn5f4L0jgxm1OJSr191iJkz1m0MccRsWc9OiycCwXWwtbCUW3vR3N5ks6WUjbQUBTN3X00okzcby4o';
    }

    setStripePromise(loadStripe(key));
    scrollToTop();
  }, []);

  // If no client secret, redirect back
  useEffect(() => {
    if (!clientSecret) {
      console.error('No client secret provided');
      navigate('/');
    }
  }, [clientSecret, navigate]);

  const options = { clientSecret };

  if (!clientSecret || !stripePromise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#930B31] mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-5">
      <div className="container mx-auto px-3">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-t-2xl shadow-sm p-6 mb-0 mt-20">
            <div className="flex flex-wrap items-center justify-between">
              <div>
                <h1 className="text-base my-1 lg:text-2xl font-bold text-gray-900">Complete Your Booking</h1>
              </div>
              <div className="flex my-1 items-center gap-1 lg:gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-600">Secure Checkout</span>
              </div>
            </div>
          </div>

          {/* Embedded Checkout Form */}
          <div className="bg-white rounded-b-2xl shadow-lg pb-5">
            <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>SSL Encrypted</span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 9a1 1 0 112 0v3a1 1 0 11-2 0V9z" />
                </svg>
                <span>PCI Compliant</span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbeddedCheckoutPage;
