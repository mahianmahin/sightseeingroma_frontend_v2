import React, { useEffect, useState } from "react";
import axios from "axios";
import TicketCard from "../Components/TicketCard/TicketCard";

const Similar = () => {
    const [similarPackages, setSimilarPackages] = useState([]);

    // Fetch data dynamically
    useEffect(() => {
        axios
            .get("/similarPackages.json") // Replace with your API or JSON file path
            .then((response) => {
                setSimilarPackages(response.data);
            })
            .catch((error) => {
                console.error("Error fetching similar packages:", error);
            });
    }, []);

    // Handle button click and log the index
    const handleButtonClick = (index) => {
        console.log("Button clicked for package at index:", index);
    };

    return (
        <section className="py-6 px-2 md:px-8 bg-gray-200 container mx-auto">
            <h1 className="text-2xl font-bold mb-4 py-4">
                Explore Similar Packages
            </h1>

            {/* Display TicketCards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 md:gap-x-10">
                {similarPackages.length > 0 ? (
                    similarPackages.map((packageData, index) => (
                        <TicketCard
                            key={index}
                            title={packageData.title}
                            subtitle={packageData.subtitle}
                            image={packageData.image}
                            duration={packageData.duration}
                            ticketCount={packageData.ticket_count}
                            price={packageData.price}
                            onClick={() => handleButtonClick(index)} // Pass the index to the handler
                        />
                    ))
                ) : (
                    <p className="text-center col-span-4 text-gray-600">
                        Loading similar packages...
                    </p>
                )}
            </div>
        </section>
    );
};

export default Similar;
