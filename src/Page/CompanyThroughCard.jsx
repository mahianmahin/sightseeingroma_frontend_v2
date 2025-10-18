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
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                <img
                  src={`${baseUrlHashless}${companyInfo.image}`}
                  alt={companyInfo.card_title}
                  className="w-full h-full object-cover"
                />
              </div>
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
          <div className="flex gap-3 overflow-x-auto pb-2">
            {allCompanies.map((company) => (
              <div
                key={company.id}
                onClick={() => handleCompanySwitch(company.company_slug)}
                className={`flex-shrink-0 rounded cursor-pointer transition-all duration-300 ${
                  company.company_slug === companySlug 
                    ? 'ring-2 ring-[#930B31] ring-offset-2 scale-105' 
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

      {/* Tickets List */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Available Tickets</h2>
          <p className="text-gray-600 text-sm sm:text-base">Choose from the available ticket options</p>
        </div>

        <div className="grid gap-4 sm:gap-6">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                  {/* Left Content - Ticket Information */}
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900">{ticket.title}</h3>
                          {ticket.is_featured && (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                              ⭐ Featured
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {ticket.duration}
                          </span>
                          <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            {ticket.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Key Information Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">Ticket Details</h4>
                        <div className="space-y-1 text-xs sm:text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-medium">{ticket.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-medium">{ticket.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Package ID:</span>
                            <span className="font-medium">#{ticket.package_tag}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">Pricing</h4>
                        <div className="space-y-1 text-xs sm:text-sm">
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
                            <span className="text-gray-600">Infant (0-5):</span>
                            <span className="font-medium text-green-600">FREE</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Schema Information */}
                    {/* {ticket.schema_json && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">What's Included</h4>
                        <div className="text-xs sm:text-sm text-gray-700">
                          {ticket.schema_json.additionalProperty?.map((prop, index) => (
                            prop.name === 'Included Services' && (
                              <div key={index} className="mb-2">
                                <div className="flex flex-wrap gap-1">
                                  {prop.value.split(',').map((service, i) => (
                                    <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                      {service.trim()}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )} */}
                  </div>

                  {/* Right Content - Pricing Card */}
                  <div className="w-full lg:w-80">
                    <div className="bg-gradient-to-br from-[#930B31] to-red-700 text-white rounded-lg p-4 sm:p-6 sticky top-4">
                      <div className="text-center mb-4">
                        {ticket.off_price && ticket.off_price > ticket.adult_price && (
                          <div className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold mb-2 inline-block">
                            SAVE €{ticket.off_price - ticket.adult_price}
                          </div>
                        )}
                        <div className="flex items-center justify-center gap-2 mb-2">
                          {ticket.off_price && ticket.off_price > ticket.adult_price && (
                            <span className="text-lg text-gray-300 line-through">€{ticket.off_price}</span>
                          )}
                          <span className="text-2xl sm:text-3xl font-bold">€{ticket.adult_price}</span>
                        </div>
                        <p className="text-sm text-gray-200">Starting price per adult</p>
                      </div>

                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Adult:</span>
                            <span className="font-bold">€{ticket.adult_price}</span>
                          </div>
                          {ticket.youth_price > 0 && (
                            <div className="flex justify-between">
                              <span>Youth:</span>
                              <span className="font-bold">€{ticket.youth_price}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Child (0-5):</span>
                            <span className="font-bold text-yellow-300">FREE</span>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => window.location.href = `/manageBookings/E9/${ticket.package_tag}`}
                        className="w-full bg-white text-[#930B31] font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:scale-105 shadow-lg"
                      >
                        Book This Ticket
                      </button>
                      
                      <p className="text-xs text-center text-gray-200 mt-2">
                        Instant confirmation • Exclusive Support
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyThroughCard;