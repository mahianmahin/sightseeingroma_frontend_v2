import React from 'react';
import { Helmet } from 'react-helmet-async';
import GlobalSEO from '../Components/GlobalSEO';

const FeaturedOffer = () => {
  return (
    <>
      <Helmet>
        <title>Today's Featured Offer - SightseeingRoma</title>
        <meta name="description" content="Check out today's best deals on Rome sightseeing tours and tickets." />
      </Helmet>
      <GlobalSEO />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#930B31]">Today's Featured Offer</h1>
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-xl text-gray-700 mb-6">
            We are currently curating the best offers for you. Please check back soon!
          </p>
          <div className="animate-pulse bg-gray-200 h-64 w-full rounded-lg mb-4"></div>
          <div className="animate-pulse bg-gray-200 h-8 w-3/4 mx-auto rounded mb-2"></div>
          <div className="animate-pulse bg-gray-200 h-4 w-1/2 mx-auto rounded"></div>
        </div>
      </div>
    </>
  );
};

export default FeaturedOffer;
