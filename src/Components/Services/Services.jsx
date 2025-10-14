import React, { useEffect, useState } from "react";
import { FaBus, FaMapMarkedAlt, FaTicketAlt, FaRoute, FaFilter, FaChevronDown, FaTimes } from "react-icons/fa";
import { baseUrl } from "../../utilities/Utilities";
import Card from "./Card";
import EditWrapper from "../Edit_Wrapper/EditWrapper";
import renderContent from "../../utilities/renderContent.jsx";

const Services = (props) => {
  const [activeTab, setActiveTab] = useState(0);
  const [busData, setBusData] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter states
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    duration: '',
    priceRange: '',
    availability: '',
    sortBy: '',
    features: [],
    languages: [],
    groupSize: []
  });
  const [activeFilters, setActiveFilters] = useState([]);  

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

  // Filter bus data based on the active folder and applied filters
  const filteredData = busData.filter((bus) => {
    // First filter by active folder
    const folderMatch = folders[activeTab] && bus.folder === folders[activeTab].id;
    if (!folderMatch) return false;

    // Apply duration filter
    if (filters.duration) {
      const duration = bus.duration?.toLowerCase();
      if (!duration?.includes(filters.duration.replace('-', ' '))) return false;
    }

    // Apply price range filter
    if (filters.priceRange) {
      const price = parseFloat(bus.adult_price) || 0;
      const parts = filters.priceRange.split('-');
      const min = parseFloat(parts[0].replace('+', ''));
      const max = parts.length > 1 ? parseFloat(parts[1].replace('+', '')) : null;
      
      if (max === null) {
        // For ranges like "60+" where there's no upper limit
        if (price < min) return false;
      } else {
        // For ranges like "0-20", "20-40", etc.
        if (price < min || price > max) return false;
      }
    }

    // Apply availability filter
    if (filters.availability) {
      if (filters.availability === 'available' && bus.status !== 'active') return false;
      if (filters.availability === 'featured' && !bus.is_featured) return false;
    }

    return true;
  }).sort((a, b) => {
    // Apply sorting
    switch (filters.sortBy) {
      case 'price-low':
        return (parseFloat(a.adult_price) || 0) - (parseFloat(b.adult_price) || 0);
      case 'price-high':
        return (parseFloat(b.adult_price) || 0) - (parseFloat(a.adult_price) || 0);
      case 'duration':
        return (a.duration || '').localeCompare(b.duration || '');
      default:
        return 0;
    }
  });

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Handle checkbox filters
  const handleCheckboxFilter = (filterType, value, checked) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: checked 
        ? [...prev[filterType], value]
        : prev[filterType].filter(item => item !== value)
    }));
  };

  // Apply filters
  const applyFilters = () => {
    const active = [];
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        active.push(...value.map(v => ({ type: key, value: v })));
      } else if (value) {
        active.push({ type: key, value });
      }
    });
    setActiveFilters(active);
    // Close mobile filters after applying
    setShowMobileFilters(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      duration: '',
      priceRange: '',
      availability: '',
      sortBy: '',
      features: [],
      languages: [],
      groupSize: []
    });
    setActiveFilters([]);
    // Close mobile filters after clearing
    setShowMobileFilters(false);
  };

  // Remove individual filter
  const removeFilter = (filterToRemove) => {
    const { type, value } = filterToRemove;
    if (Array.isArray(filters[type])) {
      handleCheckboxFilter(type, value, false);
    } else {
      handleFilterChange(type, '');
    }
    setActiveFilters(prev => prev.filter(filter => 
      !(filter.type === type && filter.value === value)
    ));
  };

  if (props.loading) {
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
        {/* <div className="text-center mb-8 md:mb-16"> */}
          {/* services title */}
          {/* <EditWrapper isEditor={props.isEditor} contentTag={"services-title"} refreshContent={props.refreshContent}>
            {renderContent('services-title', props.hasContent, props.getContentByTag, 'Our Bus Services')}
          </EditWrapper> */}
          
          {/* servies subtitle */}
          {/* <EditWrapper isEditor={props.isEditor} contentTag={"services-subtitle"} refreshContent={props.refreshContent}>
            {renderContent('services-subtitle', props.hasContent, props.getContentByTag, 'Reserve your seat from available bus rides. From comfort to budget, explore ticket options for every traveler.')}
          </EditWrapper> */}
          
          {/* Stats Section */}
          {/* <EditWrapper isEditor={props.isEditor} contentTag={"service-cards"} refreshContent={props.refreshContent}>
            {renderContent('service-cards', props.hasContent, props.getContentByTag)}
          </EditWrapper> */}

          {/* <div class="grid grid-cols-3 md:grid-cols-3 gap-4 max-w-3xl mx-auto" /> */}
        
        {/* </div> */}

        

        {/* Service Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <div className="text-center mb-8">
            
            <EditWrapper isEditor={props.isEditor} contentTag={"select-service-title"} refreshContent={props.refreshContent}>
              {renderContent('select-service-title', props.hasContent, props.getContentByTag, 'Select Your Service')}
            </EditWrapper>

            <EditWrapper isEditor={props.isEditor} contentTag={"select-service-subtitle"} refreshContent={props.refreshContent}>
              {renderContent('select-service-subtitle', props.hasContent, props.getContentByTag, 'Choose from our available bus services')}
            </EditWrapper>

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
        </div>

        {/* Mobile Filter Button - Only visible on small screens when filters are hidden */}
        <div className="flex justify-end lg:hidden mb-4">
          {!showMobileFilters && (
            // <button onClick={() => setShowMobileFilters(true)} className="w-20 bg-[#930B31] text-white font-semibold py-2 px-4 rounded-xl shadow-lg hover:bg-red-800 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3">
            //   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"></path>
            //   </svg>
            //   Filter
            // </button>
            <div className="mr-2 cursor-pointer" onClick={() => setShowMobileFilters(true)}>
              <span className="text-[#930B31] underline">USE FILTERS</span>
            </div>
            )}
          </div>

          {/* Advanced Filtering Component */}
        <div className={`bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 ${
          showMobileFilters ? 'block' : 'hidden lg:block'
        }`}>
          {/* Mobile Close Button */}
          <div className="block lg:hidden mb-4">
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Close Filters
            </button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            {/* Filter Controls Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 lg:max-w-4xl">
              
              {/* Duration Filter */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <select 
                  value={filters.duration}
                  onChange={(e) => handleFilterChange('duration', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#930B31] focus:border-[#930B31] transition-colors"
                >
                  <option value="">All Durations</option>
                  <option value="1 day">1 Day</option>
                  <option value="24 hours">24 Hours</option>
                  <option value="48 hours">48 Hours</option>
                  <option value="72 hours">72 Hours</option>
                  <option value="half day">Half Day</option>
                  <option value="one run">One Run</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select 
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#930B31] focus:border-[#930B31] transition-colors"
                >
                  <option value="">Any Price</option>
                  <option value="0-20">€0 - €20</option>
                  <option value="20-40">€20 - €40</option>
                  <option value="40-60">€40 - €60</option>
                  <option value="60+">€60+</option>
                </select>
              </div>

              {/* Availability Filter */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <select 
                  value={filters.availability}
                  onChange={(e) => handleFilterChange('availability', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#930B31] focus:border-[#930B31] transition-colors"
                >
                  <option value="">All Tickets</option>
                  <option value="available">Available Now</option>
                  <option value="featured">Featured</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select 
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#930B31] focus:border-[#930B31] transition-colors"
                >
                  <option value="">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="duration">Duration</option>
                </select>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex items-center gap-3 lg:gap-2">
              <button 
                onClick={applyFilters}
                className="px-6 py-2.5 bg-[#930B31] text-white font-semibold rounded-lg hover:bg-red-800 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Apply
              </button>
              <button 
                onClick={clearFilters}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300"
              >
                Clear
              </button>
            </div>
          </div>
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
                  thumbnail_small_alt={ticket.thumbnail_small_alt}
                  thumbnail_large_alt={ticket.thumbnail_large_alt}
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
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-6">
                <svg className="w-8 h-8 text-[#930B31]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Tickets Found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {activeFilters.length > 0 
                  ? "No tickets match your current filter criteria. Try adjusting your filters or browse all available tickets."
                  : "No tickets are currently available in this category. Please check back later or explore other categories."
                }
              </p>
              {activeFilters.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="bg-[#930B31] text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-all duration-300 font-semibold"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;
