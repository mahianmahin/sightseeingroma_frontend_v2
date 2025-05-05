import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useParams, useNavigate } from "react-router-dom";
import { baseUrl } from "../../utilities/Utilities";
import Banner2 from "../Banner2/Banner2";
import TicketCard from "../TicketCard/TicketCard";

const ViewMore = () => {
    const [busPackages, setBusPackages] = useState([]);
    const [similar, setSimilar] = useState([]);
    const { hours, company } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`${baseUrl}packages/`)
            .then((response) => {
                const allPackages = response.data.bus_data || [];

                const companyPackages = allPackages.filter(
                    (item) => item.company.toLowerCase() === company?.toLowerCase()
                );
                setBusPackages(companyPackages);

                const similarPackages = allPackages.filter(
                    (item) => item.duration === hours
                );
                setSimilar(similarPackages);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, [hours, company]);

    // Simplified Back Button
    const handleBackClick = () => {
        navigate(-1); // Always try to go back one step
    };

    return (
        <div className="container mx-auto">
            {/* Banner */}
            <Banner2
                bannerImgmd={"/Banner/b8.png"}
                bannerImgsm={"/Banner/b7.png"}
                title={"Explore more with us"}
                description={"Discover the best of Rome with our exclusive bus packages"}
            />

            {/* Same Categories Section */}
            <div className="px-4 md:px-8">
                <div className="py-7 md:py-10">
                    {/* Mobile Back Button */}
                    {/* <div className="block md:hidden mb-3">
                        <button onClick={handleBackClick}> 
                            <FaArrowLeftLong size={20} />
                        </button>
                    </div> */}
                    <h1 className="text-2xl font-bold uppercase">Same Categories</h1>
                </div>

                {busPackages.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 md:gap-x-10">
                        {busPackages.map((ticket) => (
                            <TicketCard
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
                                id1={ticket.id}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">
                        No packages available for this category.
                    </p>
                )}
            </div>

            {/* Similar Categories Section */}
            <div className="px-4 md:px-8">
                <div className="py-7 md:py-10">
                    <h1 className="text-2xl font-bold uppercase">Similar Options</h1>
                </div>

                {similar.length > 0 ? (
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
                                id1={ticket.id}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">
                        No similar options available.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ViewMore;
