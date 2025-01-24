import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../utilities/Utilities";
import Banner2 from "../Banner2/Banner2";
import TicketCard from "../TicketCard/TicketCard";

const ViewMore = () => {
    const [busPackages, setBusPackages] = useState([]); // For bus packages of the selected company
    const [similar, setSimilar] = useState([]); // For similar bus packages
    const { hours, company } = useParams(); // Get 'hours' and 'company' from the route parameters

    console.log("Route Params:", { hours, company }); // Debugging log

    // Fetch packages for the selected company
    useEffect(() => {
        axios
            .get(`${baseUrl}packages/`)
            .then((response) => {
                const filteredPackages = response.data.bus_data.filter(
                    (item) => item.company.toLowerCase() === company?.toLowerCase()
                );
                setBusPackages(filteredPackages);
            })
            .catch((error) => {
                console.error("Error fetching data for the selected company:", error);
            });
    }, [company]);

    // Fetch similar packages based on the 'hours' parameter
    useEffect(() => {
        axios
            .get(`${baseUrl}packages/`)
            .then((response) => {
                const filteredPackages = response.data.bus_data.filter(
                    (item) => item.duration === hours // Filtering by duration
                );
                setSimilar(filteredPackages);
            })
            .catch((error) => {
                console.error("Error fetching similar packages:", error);
            });
    }, [hours]);

    return (
        <div className="container mx-auto">
            {/* Header Image */}
            <div className="">
            <Banner2
                bannerImgmd={'/Banner/b8.png'}
                bannerImgsm={'/Banner/b7.png'}
                title={'Explore more with us'}
                description={'Discover the best of Rome with our exclusive bus packages'}
            />
            </div>
           

            {/* Same Categories Section */}
            <div className="px-4 md:px-8">
                <div className="py-7 md:py-10">
                    <div className="block md:hidden mb-3">
                        <FaArrowLeftLong size={20}></FaArrowLeftLong>
                    </div>
                    <h1 className="text-2xl font-bold uppercase">Same Categories</h1>
                   
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 md:gap-x-10">
                    {busPackages.map((ticket) => (
                        <TicketCard
                            key={ticket.package_tag}
                            id={ticket.package_tag}
                            status={ticket.status}
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

            {/* Similar Categories Section */}
            <div className="px-4 md:px-8">
                <div className="py-7 md:py-10">
                    
                    <h1 className="text-2xl font-bold uppercase">Similar Options</h1>
                  
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 md:gap-x-10">
                    {similar.map((ticket) => (
                        <TicketCard
                            key={ticket.package_tag}
                            id={ticket.package_tag}
                            status={ticket.status}
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
        </div>
    );
};

export default ViewMore;
