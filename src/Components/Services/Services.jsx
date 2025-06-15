import React, { useEffect, useState } from "react";

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
    return <div className="text-center py-10">Loading full data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  return (
    <div className="p-4 px-2 mb-6 md:px-10 mt-10 md:mt-16">
      {/* Header */}
      <h1 className="text-xl md:text-4xl font-bold text-gray-800 mb-2 text-start">
        Choose Your Bus Service
      </h1>
      <p className="text-gray-600 mb-6 text-start">
        Reserve your seat from available bus rides. From comfort to budget, explore ticket options.
      </p>

      {/* Tabs */}
      <div className="grid grid-cols-2 md:flex md:flex-row col-span-2 justify-start md:justify-between w-full gap-4 mb-6">
        {folders.map((folder, index) => (
          <button
            key={folder.id}
            onClick={() => setActiveTab(index)}
            className={`font-semibold pb-2 px-2 md:px-4 p-2 text-sm md:text-base rounded-md md:rounded-none transition-all duration-200 ${
              activeTab === index
                ? "bg-[#930B31] text-white md:border-b-2 border-2"
                : "border-2 text-gray-700 border-[#930B31] hover:text-[#930B31]"
            }`}
          >
            {folder.name}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
        {tabLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-full h-48 md:h-60 bg-gray-200 animate-pulse rounded-lg"
            ></div>
          ))
        ) : filteredData.length > 0 ? (
          filteredData.map((ticket) => (
            <Card
              key={ticket.id}
              id={ticket.package_tag}
              status={ticket.status}
              title={ticket.title}
              subtitle={ticket.type}
              image={ticket.image_big}
              duration={ticket.duration}
              ticketCount={ticket.package_tag}
              price={ticket.adult_price}
              price2={ticket.youth_price}
              company={ticket.company}
              id1={ticket.id}
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
