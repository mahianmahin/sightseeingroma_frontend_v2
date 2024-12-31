import React, { useState, useEffect } from "react";
import Card from "./Card";
import { baseUrl } from "../../utilities/Utilities";

const Services = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [busData, setBusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { label: "Big Bus Packages", company: "big bus" },
    { label: "Green Line Packages", company: "green line" },
    { label: "I Love Rome Packages", company: "i love rome" },
    { label: "IO Bus Packages", company: "io_bus" },
    { label: "CitySightseeing Packages", company: "city sightseeing" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}packages/`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setBusData(data.bus_data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = busData.filter(
    (bus) => bus.company.toLowerCase() === tabs[activeTab].company.toLowerCase()
  );

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  return (
    <div className="p-4 px-2 mb-6 md:px-10 mt-10 md:mt-16">
      {/* Header Section */}
      <h1 className="text-xl md:text-4xl font-bold text-gray-800 mb-2 text-start">
        Choose Your Bus Service
      </h1>
      <p className="text-gray-600 mb-6 text-start">
        Reserve your seat from available bus rides. From comfort to budget, explore ticket options.
      </p>

      {/* Tab Section */}
      <div className="flex flex-wrap justify-between gap-4 mb-6">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`font-semibold pb-2 px-2 md:px-4 p-2 text-sm md:text-base rounded-md md:rounded-none transition-all duration-200 ${
              activeTab === index
                ? "bg-[#930B31] text-white md:border-b-2 border-2 md:border-0"
                : "border-transparent text-gray-700 hover:border-[#930B31] hover:text-[#930B31]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
        {filteredData.length > 0 ? (
          filteredData.map((ticket) => (
            <Card
            key={ticket}
            id={ticket.id}
            title={ticket.title}
            subtitle={ticket.type}
            image={ticket.image_big}
            duration={ticket.duration}
            ticketCount={ticket.package_tag}
            price={ticket.adult_price}
            price2={ticket.youth_price}
            
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No buses available for this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default Services;
