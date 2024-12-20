import React, { useEffect, useState } from "react";
import axios from "axios";
import TicketCard from "../Components/TicketCard/TicketCard";
import Similar from "./Similar";
import { FaArrowLeftLong } from "react-icons/fa6";
import { baseUrl } from '../utilities/Utilities';
const BigBus = () => {
    const [busPackages, setBusPackages] = useState([]);

    // Fetch data using Axios and filter for "big bus" company
    useEffect(() => {
        axios
            .get(`${baseUrl}packages/`)
            .then((response) => {
                const filteredPackages = response.data.bus_data.filter(
                    (item) => item.company.toLowerCase() === "big bus"
                );
                setBusPackages(filteredPackages);
            })
            .catch((error) => {
                console.error("Error fetching bigBus data:", error);
            });
    }, []);

    // Function to handle ticket button click
 

    return (
        <div className="container mx-auto">
            {/* Full-width responsive image */}
            <div className="hidden md:block">
                <img
                    src="./Bigbus/bigbus.png"
                    alt="Big Bus Rome"
                    className="w-full object-contain"
                />
            </div>

            <div className="block md:hidden">
                <img
                    src="./Bigbus/bigbus1.png"
                    alt="Big Bus Rome"
                    className="w-full object-contain"
                />
            </div>
           
            <div className="px-4 md:px-8">
           
                <div className="py-7 md:py-10 ">
               <div className="block md:hidden mb-3 ">
                <FaArrowLeftLong size={20}></FaArrowLeftLong>
               </div>

                    <h1 className="text-3xl font-bold">Big Bus Service</h1>
                    <p className="text-gray-600">
                        Travel in style with our big bus services
                    </p>
                </div>

                {/* Render tickets dynamically */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 md:gap-x-10">
                    {busPackages.map((ticket, index) => (
                        <TicketCard
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
                    ))}
                </div>
            </div>

         <div className="mb-12 md:mb-0">
         <Similar />
         </div>
        </div>
    );
};

export default BigBus;
