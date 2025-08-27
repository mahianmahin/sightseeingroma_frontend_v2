import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import TicketCard from "../Components/TicketCard/TicketCard";
import HelmetWrapper from "../utilities/HelmetWrapper";
import scrollToTop, { baseUrl } from '../utilities/Utilities';
import Similar from "./Similar";
import BigBusImage from "../assets/new/Big-Bus-Page-Hero-Image.jpg";
import { useParams } from "react-router-dom";

const Companies = () => {
    const [busPackages, setBusPackages] = useState([]);
    const { companySlug, companyName } = useParams();

    // Fetch data using Axios and filter for "big bus" company
    useEffect(() => {
        axios
            .get(`${baseUrl}packages/`)
            .then((response) => {
                const filteredPackages = response.data.bus_data.filter(
                    (item) => item.company.toLowerCase() === companyName.toLowerCase()
                );
                setBusPackages(filteredPackages);
            })
                        .catch((error) => {
                console.error("Error fetching bigBus data:", error);
            });
        scrollToTop();
    }, [companyName]);

    // Function to handle ticket button click
 

    return (
        <>
            <HelmetWrapper title="Explore Rome with Big Bus | Book Tickets at Sightseeing Roma" description="Explore Rome with Big Bus hop-on hop-off tours. Choose from 24h, 48h, or 72h tickets, Travel in style, enjoy panoramic views, and discover top landmarks." />
            <div className="container mx-auto">
                {/* Full-width responsive image */}
                <div className="hidden md:block">
                    <img
                        src={BigBusImage}
                        alt="Big Bus Rome"
                        className="w-full object-contain"
                    />
                </div>

                <div className="block md:hidden">
                    <img
                        src={BigBusImage}
                        alt="Big Bus Rome"
                        className="w-full object-contain"
                    />
                </div>
               
                <div className="px-4 md:px-8">
               
                    <div className="py-7 md:py-10 ">
                   <div className="block md:hidden mb-3 ">
                    <FaArrowLeftLong size={20}></FaArrowLeftLong>
                   </div>

                        <h1 className="text-3xl font-bold">Available Services</h1>
                        <p className="text-gray-600">Travel in style with our big bus services</p>

                        <p className="bg-yellow-300 px-4 py-2 my-5 w-fit font-bold rounded-md text-red-700 text-xs">{companyName.toUpperCase()} SERVICES</p>
                    </div>

                    {/* Render tickets dynamically */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-10">
                        {busPackages.map((ticket, index) => (
                            <TicketCard
                                key={ticket}
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
                                id1={ticket.id}
                            />
                        ))}
                    </div>
                </div>

             <div className="mb-12 md:mb-0">
             
             <Similar />
             
             </div>
            </div>
        </>
    );
};

export default Companies;
