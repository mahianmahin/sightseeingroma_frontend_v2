import React, { useEffect, useState } from "react";
import axios from "axios";
import TicketCard from "../Components/TicketCard/TicketCard";
import Similar from "./Similar";
import { FaArrowLeftLong } from "react-icons/fa6";
import { baseUrl } from '../utilities/Utilities';
import ILoveRomeImage from "../assets/new/I-Love-Rome-Bus-Hero-Image.jpg";

const LoveRome = () => {
    const [loveRomePackages, setloveRomePackages] = useState([]);

    // Fetch data using Axios and filter for "big bus" company
    useEffect(() => {
        axios
            .get(`${baseUrl}packages/`)
            .then((response) => {
                const filteredPackages = response.data.bus_data.filter(
                    (item) => item.company.toLowerCase() === "i love rome"
                );
                setloveRomePackages(filteredPackages);
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
                    src={ILoveRomeImage}
                    alt="Big Bus Rome"
                    className="w-full object-contain"
                />
            </div>

            <div className="block md:hidden">
                <img
                    src={ILoveRomeImage}
                    alt="Big Bus Rome"
                    className="w-full object-contain"
                />
            </div>
           
            <div className="px-4 md:px-8">
           
            <div className="py-7 md:py-10 ">
               <div className="block md:hidden mb-3 ">
                <FaArrowLeftLong size={20}></FaArrowLeftLong>
               </div>

                    <h1 className="text-3xl font-bold">I love Rome Bus Service</h1>
                    <p className="text-gray-600">
                    Discover the Comfort of I Love Rome Travel 
                    </p>
                </div>

                {/* Render tickets dynamically */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-10">
                    {loveRomePackages.map((ticket, index) => (
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
                    ))}
                </div>
            </div>

            <div className="mb-12 md:mb-0">
         <Similar />
         </div>
        </div>
    );
};

export default LoveRome;
