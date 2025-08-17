import React, { useEffect, useState } from "react";
import { FaBus, FaMapMarkedAlt, FaTicketAlt, FaRoute } from "react-icons/fa";
import { baseUrl } from "../../utilities/Utilities";
import Card from "./Card";

const Services = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [busData, setBusData] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}packages/`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setBusData(data.bus_data || []);
        setFolders(data.folders || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // simulate delay when tab changes (optional)
    setTabLoading(true);
    const timeout = setTimeout(() => setTabLoading(false), 300);
    return () => clearTimeout(timeout);
  }, [activeTab]);

  // Filter bus data based on the active folder
  const filteredData = busData.filter(
    (bus) => folders[activeTab] && bus.folder === folders[activeTab].id
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#930B31] mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Loading bus services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-[#930B31] text-white px-6 py-2 rounded-lg hover:bg-red-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F2F2F7] py-8 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-[#930B31] rounded-full mb-6">
            <FaBus className="text-white text-2xl" />
          </div> */}
          <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Choose Your Bus Service
          </h3>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Reserve your seat from available bus rides. From comfort to budget, explore ticket options for every traveler.
          </p>
          
          {/* Stats Section */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mt-8 max-w-3xl mx-auto">
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <FaRoute className="text-[#930B31] text-2xl mx-auto mb-2" />
              <p className="text-xl font-bold text-gray-800">{folders.length}</p>
              <p className="text-sm text-gray-600">Bus Services</p>
            </div>
            
            {/* <div className="bg-white p-4 rounded-lg shadow-sm">
              <FaTicketAlt className="text-[#930B31] text-2xl mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{busData.length}</p>
              <p className="text-sm text-gray-600">Total Packages</p>
            </div> */}
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <FaMapMarkedAlt className="text-[#930B31] text-2xl mx-auto mb-2" />
              <p className="text-xl font-bold text-gray-800">Rome</p>
              <p className="text-sm text-gray-600">City Coverage</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <FaBus className="text-[#930B31] text-2xl mx-auto mb-2" />
              <p className="text-xl font-bold text-gray-800">24/7</p>
              <p className="text-sm text-gray-600">Service Hours</p>
            </div>
          
          </div>
        
        </div>

        {/* Service Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
              Select Your Preferred Service
            </h2>
            <p className="text-gray-600">
              Choose from our premium bus service providers
            </p>
          </div>

          {/* Enhanced Tabs */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8">
            {folders.map((folder, index) => (
              <button
                key={folder.id}
                onClick={() => setActiveTab(index)}
                className={`group relative px-6 py-3 md:px-8 md:py-4 rounded-xl font-semibold text-sm md:text-base transition-all duration-300 transform hover:scale-105 ${
                  activeTab === index
                    ? "bg-[#930B31] text-white shadow-lg shadow-red-900/25"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-[#930B31]"
                }`}
              >
                <span className="relative z-10">{folder.name}</span>
                {activeTab === index && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#930B31] to-red-700 rounded-xl opacity-90"></div>
                )}
              </button>
            ))}
          </div>

          {/* Active Service Info */}
          {folders[activeTab] && (
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-[#FAD502E0] px-4 py-2 rounded-full">
                <FaTicketAlt className="text-[#930B31]" />
                <span className="font-medium text-gray-800">
                  {filteredData.length} Packages Available Here
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Cards Grid */}
        <div className="container mx-auto px-2 md:px-4">
          {tabLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="w-full h-32 md:h-44 bg-gray-200 animate-pulse"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredData.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
              {filteredData.map((ticket) => (
                <Card
                  key={ticket.id}
                  id={ticket.package_tag}
                  status={ticket.status}
                  title={ticket.title}
                  subtitle={ticket.type}
                  image={ticket.image_big}
                  thumbnail_small={ticket.thumbnail_small}
                  thumbnail_large={ticket.thumbnail_large}
                  duration={ticket.duration}
                  ticketCount={ticket.package_tag}
                  price={ticket.adult_price}
                  price2={ticket.youth_price}
                  offPrice={ticket.off_price}
                  company={ticket.company}
                  id1={ticket.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <FaBus className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Buses Available
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                We don't have any buses available for this category at the moment. 
                Please check back later or try a different service.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;
