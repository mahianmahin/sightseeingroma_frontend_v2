import React, { useEffect, useState } from "react";
import axios from "axios";
import TicketCard from "../Components/TicketCard/TicketCard";
import { baseUrl } from "../utilities/Utilities";

const Similar = () => {
    const [similarPackages, setSimilarPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    

    

    // Fetch data dynamically
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseUrl}packages/`); // Use your actual endpoint here
                if (response.status === 200) {
                    const allPackages = response.data.bus_data; // Assuming `bus_data` contains the packages
                    const randomPackages = getRandomItems(allPackages, 8); // Get 8 random packages
                    setSimilarPackages(randomPackages);
                } else {
                    console.error("Unexpected response status:", response.status);
                    setError(true);
                }
            } catch (err) {
                console.error("Error fetching similar packages:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Utility function to get random items from an array
    const getRandomItems = (array, count) => {
        const shuffled = array.sort(() => 0.5 - Math.random()); // Shuffle the array
        return shuffled.slice(0, count); // Return `count` number of items
    };

   
    return (
        <section className="py-8 px-4 md:px-8 bg-gray-200 container mx-auto">
            <h1 className="text-2xl font-bold mb-4 py-4">Explore Similar Packages</h1>

            {loading ? (
                <p className="text-center text-gray-600">Loading similar packages...</p>
            ) : error ? (
                <p className="text-center text-red-500">Failed to load packages. Please try again later.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 md:gap-x-10">
                    {similarPackages.length > 0 ? (
                        similarPackages.map((ticket, index) => (
                            <TicketCard
                            key={ticket.id}
                            title={ticket.title}
                            subtitle={ticket.type}
                            image={ticket.image_big}
                            thumbnail_small={ticket.thumbnail_small}
                            thumbnail_large={ticket.thumbnail_large}
                            duration={ticket.duration}
                            ticketCount={ticket.package_tag}
                            price={ticket.adult_price}
                            price2={ticket.youth_price}
                            id={ticket.package_tag}
                            status={ticket.status}
                            id1={ticket.id}
                           
                            />
                        ))
                    ) : (
                        <p className="text-center col-span-4 text-gray-600">No similar packages available.</p>
                    )}
                </div>
            )}
        </section>
    );
};

export default Similar;
