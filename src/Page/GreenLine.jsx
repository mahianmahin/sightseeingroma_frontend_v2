import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import TicketCard from "../Components/TicketCard/TicketCard";
import HelmetWrapper from "../utilities/HelmetWrapper";
import { baseUrl } from '../utilities/Utilities';
import Similar from "./Similar";
import GreenLineImage from "../assets/new/GreenLine-Bus-Hero-Image.jpg";

const GreenLine = () => {
    const [greenLinePackages, setgreenLinePackages] = useState([]);

    // Fetch data using Axios and filter for "big bus" company
    useEffect(() => {
        axios
            .get(`${baseUrl}packages/`)
            .then((response) => {
                const filteredPackages = response.data.bus_data.filter(
                    (item) => item.company.toLowerCase() === "green line"
                );
                setgreenLinePackages(filteredPackages);
            })
            .catch((error) => {
                console.error("Error fetching bigBus data:", error);
            });
    }, []);

  

    return (<>
        <HelmetWrapper title="Discover Rome via Green Line Bus | Get Tickets at Sightseeing Roma" description="Book Green Line hop-on-hop-off Rome tours. Choose from 24, 48, 72-hour,  daily tickets or 3 passes and explore top sights with comfort and convenience." />
        <div className="container mx-auto">
            {/* Full-width responsive image */}
            <div className="hidden md:block">
                <img
                    src={GreenLineImage}
                    alt="Big Bus Rome"
                    className="w-full object-contain"
                />
            </div>

            <div className="block md:hidden">
                <img
                    src={GreenLineImage}
                    alt="Big Bus Rome"
                    className="w-full object-contain"
                />
            </div>
           
            <div className="px-4 md:px-8">
           
            <div className="py-7 md:py-10 ">
               <div className="block md:hidden mb-3 ">
                <FaArrowLeftLong size={20}></FaArrowLeftLong>
               </div>

                    <h1 className="text-3xl font-bold">Green Line Bus Service</h1>
                    <p className="text-gray-600">
                    Comfort Meets Convenience: Green Line Bus Services
                    </p>
                </div>

                {/* Render tickets dynamically */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 md:gap-x-10">
                    {greenLinePackages.map((ticket, index) => (
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
        </>);
};

export default GreenLine;
