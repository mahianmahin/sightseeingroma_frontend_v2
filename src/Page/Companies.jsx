import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import TicketCard from "../Components/TicketCard/TicketCard";
import HelmetWrapper from "../utilities/HelmetWrapper";
import scrollToTop, { baseUrl } from '../utilities/Utilities';
import BigBusImage from "../assets/new/Big-Bus-Page-Hero-Image.jpg";
import { useParams } from "react-router-dom";
import useStaticContent from "../hooks/useStaticContent";
import EditWrapper from "../Components/Edit_Wrapper/EditWrapper";
import useEditorCheck from "../hooks/useEditorCheck";
import renderContent from "../utilities/renderContent";

const Companies = () => {
    const [busPackages, setBusPackages] = useState([]);
    const [unfilteredPackages, setUnfilteredPackages] = useState([]);
    const { companySlug, companyName } = useParams();

    // Fetch data using Axios and filter for "big bus" company
    useEffect(() => {
        scrollToTop();
        axios
            .get(`${baseUrl}packages/`)
            .then((response) => {
                const filteredPackages = response.data.bus_data.filter(
                    (item) => item.company.toLowerCase() === companyName.toLowerCase()
                );
                setBusPackages(filteredPackages);
                setUnfilteredPackages(response.data.bus_data);
            })
                        .catch((error) => {
                console.error("Error fetching bigBus data:", error);
            });
        scrollToTop();
    }, [companyName]);

    const { isEditor } = useEditorCheck();
    const { getContentByTag, hasContent, refreshContent } = useStaticContent(companySlug);
 

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

                        <EditWrapper isEditor={isEditor} contentTag={`${companySlug}-page-title-subtitle`} refreshContent={refreshContent}>
                            {renderContent(`${companySlug}-page-title-subtitle`, hasContent, getContentByTag)}
                        </EditWrapper>

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
             
                {/* Similar Options Section */}
                {(() => {
                    // Get all unique durations from current company's packages
                    const currentCompanyDurations = [...new Set(busPackages.map(pkg => pkg.duration))];
                    
                    // Filter packages from other companies with matching durations
                    const similarPackages = unfilteredPackages.filter(pkg => 
                        pkg.company.toLowerCase() !== companyName.toLowerCase() && 
                        currentCompanyDurations.includes(pkg.duration)
                    );

                    if (similarPackages.length === 0) {
                        return null; // Don't show section if no similar packages
                    }

                    return (
                        <div className="px-4 md:px-8">
                            <div className="py-7 md:py-10">

                                <EditWrapper isEditor={isEditor} contentTag={`${companySlug}-page-similar`} refreshContent={refreshContent}>
                                    {renderContent(`${companySlug}-page-similar`, hasContent, getContentByTag)}
                                </EditWrapper>
                                

                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-10">
                                {similarPackages.map((ticket) => (
                                    <TicketCard
                                        key={`similar-${ticket.id}-${ticket.package_tag}`}
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
                                        offPrice={ticket.off_price}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })()}

             
             </div>
            </div>
        </>
    );
};

export default Companies;
