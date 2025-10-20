import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import scrollToTop, { baseUrl, baseUrlHashless } from '../utilities/Utilities.jsx';

const CompanyThroughCard = () => {
  const { companySlug } = useParams();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [allCompanies, setAllCompanies] = useState([]);

  useEffect(() => {
    scrollToTop();
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch packages
        const packagesRes = await fetch(`${baseUrl}packages/`);
        if (!packagesRes.ok) throw new Error('Failed to fetch packages');
        const packagesData = await packagesRes.json();
        
        // Fetch company cards for company info
        const cardsRes = await fetch(`${baseUrl}api/cards/`);
        if (!cardsRes.ok) throw new Error('Failed to fetch company info');
        const cardsData = await cardsRes.json();
        
        // Store all companies for mini selector
        setAllCompanies(cardsData.cards?.filter(card => card.card_active) || []);
        
        // Find company info from cards
        const company = cardsData.cards?.find(card => card.company_slug === companySlug);
        setCompanyInfo(company);
        
        // Filter packages by company slug
        const filteredTickets = packagesData.bus_data?.filter(ticket => {
          // Convert company name to slug format for matching
          const ticketCompanySlug = ticket.company.toLowerCase().replace(/\s+/g, '-');
          return ticketCompanySlug === companySlug;
        }) || [];
        
        setTickets(filteredTickets);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
        scrollToTop();
      }
    };

    if (companySlug) {
      fetchData();
    }
  }, [companySlug]);

  const handleCompanySwitch = (newCompanySlug) => {
    navigate(`/company-packages/${newCompanySlug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#930B31] mb-4"></div>
          <p className="text-gray-600">Loading tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No tickets found for this company.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Current Company Header */}
      {companyInfo && (
        <div className="pt-20 bg-gradient-to-r from-[#930B31] to-red-700 text-white">
          <div className="container mx-auto px-4 py-5 md:py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              {/* <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                <img
                  src={`${baseUrlHashless}${companyInfo.image}`}
                  alt={companyInfo.card_title}
                  className="w-full h-full object-cover"
                />
              </div> */}
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{companyInfo.card_title}</h1>
                <p className="text-lg text-yellow-200 font-medium mb-2">{companyInfo.card_subtitle}</p>
                {/* <p className="text-gray-100 text-sm sm:text-base mb-3">{companyInfo.card_description}</p> */}
                {companyInfo.card_features && (
                  <div className="flex flex-wrap gap-2">
                    {companyInfo.card_features.split(',').map((feature, index) => (
                      <span
                        key={index}
                        className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium border border-white/30"
                      >
                        {feature.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mini Company Selector */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Bus Company</h2>

          {/* Hide scrollbar styles (cross-browser) */}
          <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
          `}</style>

          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
        {allCompanies.map((company) => (
          <div
            key={company.id}
            onClick={() => handleCompanySwitch(company.company_slug)}
            className={`flex-shrink-1 rounded cursor-pointer transition-all duration-300 ${
          company.company_slug === companySlug 
            ? '' 
            : 'hover:scale-105 hover:shadow-lg'
            }`}
          >
            <div className="w-30 h-20 sm:w-40 sm:h-24 rounded-xl overflow-hidden shadow-md">
          <img
            src={`${baseUrlHashless}${company.image}`}
            alt={company.card_title}
            className="w-full h-full object-cover"
          />
            </div>
            <p className={`text-center text-xs sm:text-sm mt-2 font-medium max-w-40 sm:max-w-40 truncate ${
          company.company_slug === companySlug ? 'text-[#930B31]' : 'text-gray-700'
            }`}>
          {company.card_title}
            </p>
          </div>
        ))}
          </div>
        </div>
      </div>

        {/* Tickets Grid */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Available Tickets</h2>
          <p className="text-gray-600 text-sm sm:text-base">Choose from the available options</p>
        </div>

        {/* Responsive Grid: 3 cards on mobile, 6 cards on large screens */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 lg:gap-6">
          {tickets.map((ticket) => (
            <div 
              key={ticket.id} 
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-[#930B31] to-red-700 p-4 text-white relative">
                {ticket.is_featured && (
                  <div className="absolute top-1.5 left-3.25 md:top-2 animate-pulse">
                    <span className="bg-white text-black px-2 py-1 rounded-full text-xs font-bold">
                      ⭐ Featured
                    </span>
                  </div>
                )}

                <h3 className={`font-bold ${ticket.is_featured ? 'mt-5' : ''} text-sm lg:text-base mb-2 leading-tight`}>
                  {ticket.title}
                </h3>

                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                    {ticket.duration}
                  </span>
                  
                </div>
                
                {/* Price Display */}
                <div className="text-center">
                  <div className="text-xs text-gray-200">Starting From</div>
                  {ticket.off_price && ticket.off_price > ticket.adult_price && (
                    <span className="text-sm text-gray-200 line-through block">€{ticket.off_price}</span>
                  )}
                  <div className="text-xl lg:text-3xl font-bold">€{ticket.youth_price}</div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                {/* Key Info */}
                <div className="space-y-3 mb-4">
                  {/* <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="text-xs">{ticket.duration}</span>
                  </div> */}
                  
                  {/* <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Package ID:</span>
                    <span className="font-medium text-[#930B31]">#{ticket.package_tag}</span>
                  </div> */}
                  
                  {/* Pricing Breakdown */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-xs text-gray-900 mb-2">Pricing</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Adult:</span>
                        <span className="font-bold text-[#930B31]">€{ticket.adult_price}</span>
                      </div>
                      {ticket.youth_price > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Youth:</span>
                          <span className="font-medium">€{ticket.youth_price}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Child (0-5):</span>
                        <span className="font-medium text-green-600">FREE</span>
                      </div>
                    </div>
                  </div>

                  {/* Savings Badge */}
                  {/* {ticket.off_price && ticket.off_price > ticket.adult_price && (
                    <div className="bg-yellow-200 text-yellow-800 px-2 py-1 md:px-3 md:py-2 rounded md:rounded-lg text-center">
                      <div className="text-xs font-bold">SAVE €{ticket.off_price - ticket.adult_price}</div>
                    </div>
                  )} */}
                </div>

                {/* Book Button */}
                <button 
                  onClick={() => window.location.href = `/manageBookings/E9/${ticket.package_tag}`}
                  className="w-full bg-gradient-to-r from-[#930B31] to-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No tickets message */}
        {tickets.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets available</h3>
            <p className="text-gray-600">Please check back later or select a different company.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyThroughCard;