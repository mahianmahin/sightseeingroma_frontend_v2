import axios from "axios";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useParams, useNavigate } from "react-router-dom";
import { baseUrl } from "../../utilities/Utilities";
import Banner2 from "../Banner2/Banner2";
import TicketCard from "../TicketCard/TicketCard";
import useStaticContent from "../../hooks/useStaticContent";
import useEditorCheck from "../../hooks/useEditorCheck";
import EditWrapper from "../Edit_Wrapper/EditWrapper";

const ViewMore = () => {
    const [allPackages, setAllPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { hours, company } = useParams();
    const navigate = useNavigate();

    // Memoize filtered packages to avoid unnecessary recalculations
    const { busPackages, similar } = useMemo(() => {
        if (!allPackages.length) return { busPackages: [], similar: [] };

        const companyPackages = allPackages.filter(
            (item) => item.company.toLowerCase() === company?.toLowerCase()
        );

        const similarPackages = allPackages.filter(
            (item) => item.duration === hours && item.company.toLowerCase() !== company?.toLowerCase()
        );

        return { busPackages: companyPackages, similar: similarPackages };
    }, [allPackages, company, hours]);

    // Fetch data only once and store all packages
    useEffect(() => {
        let isMounted = true;
        
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await axios.get(`${baseUrl}packages/`);
                
                if (isMounted) {
                    setAllPackages(response.data.bus_data || []);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Error fetching data:", err);
                    setError("Failed to load packages. Please try again later.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    const { isEditor } = useEditorCheck();
    const { getContentByTag, hasContent, refreshContent } = useStaticContent('view-more');
    
    const renderContent = (contentTag, fallbackText = "Loading...") => {
    return hasContent(contentTag)
        ? <span dangerouslySetInnerHTML={{ __html: getContentByTag(contentTag) }}></span>
        : <div>{fallbackText}</div>;
    };

    // Optimized back navigation
    const handleBackClick = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    // Render loading state
    if (loading) {
        return (
            <div className="container mx-auto">
                
                <Banner2 bannerImgmd={"/Banner/b8.png"} bannerImgsm={"/Banner/b7.png"}>
                    
                    <EditWrapper isEditor={isEditor} contentTag={"view-more-title"} refreshContent={refreshContent}>
                        {renderContent('view-more-title')}
                    </EditWrapper>

                    
                    <EditWrapper isEditor={isEditor} contentTag={"view-more-subtitle"} refreshContent={refreshContent}>
                        {renderContent('view-more-subtitle')}
                    </EditWrapper>
                </Banner2>
                
                <div className="px-4 md:px-8 py-16">
                    <div className="flex justify-center items-center">
                        <div className="text-lg text-gray-600">Loading packages...</div>
                    </div>
                </div>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="container mx-auto">
                <Banner2 bannerImgmd={"/Banner/b8.png"} bannerImgsm={"/Banner/b7.png"}>
                    <EditWrapper isEditor={isEditor} contentTag={"view-more-title"} refreshContent={refreshContent}>
                        {renderContent('view-more-title')}
                    </EditWrapper>

                    
                    <EditWrapper isEditor={isEditor} contentTag={"view-more-subtitle"} refreshContent={refreshContent}>
                        {renderContent('view-more-subtitle')}
                    </EditWrapper>
                </Banner2>
                <div className="px-4 md:px-8 py-16">
                    <div className="text-center">
                        <p className="text-red-500 text-lg">{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="mt-4 px-6 py-2 bg-[#930B31] text-white rounded-lg hover:bg-red-800"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            {/* Banner */}
            <Banner2 bannerImgmd={"/Banner/b8.png"} bannerImgsm={"/Banner/b7.png"}>
                <EditWrapper isEditor={isEditor} contentTag={"view-more-title"} refreshContent={refreshContent}>
                    {renderContent('view-more-title')}
                </EditWrapper>

                    
                <EditWrapper isEditor={isEditor} contentTag={"view-more-subtitle"} refreshContent={refreshContent}>
                    {renderContent('view-more-subtitle')}
                </EditWrapper>
            </Banner2>

            {/* Same Categories Section */}
            <div className="px-4 md:px-8">
                <div className="py-7 md:py-10">
                    {/* Mobile Back Button */}
                    {/* <div className="block md:hidden mb-3">
                        <button onClick={handleBackClick}> 
                            <FaArrowLeftLong size={20} />
                        </button>
                    </div> */}
                    
                    <EditWrapper isEditor={isEditor} contentTag={"view-more-same-categories"} refreshContent={refreshContent}>
                        {renderContent('view-more-same-categories', 'Same Categories')}
                    </EditWrapper>
                
                </div>

                {busPackages.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 md:gap-x-10">
                        {busPackages.map((ticket) => (
                            <TicketCard
                                key={`company-${ticket.id}-${ticket.package_tag}`}
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
                ) : (
                    <p className="text-center text-gray-500">
                        No packages available for this category.
                    </p>
                )}
            </div>

            {/* Similar Categories Section */}
            <div className="px-4 md:px-8">
                <div className="py-7 md:py-10">
                    <EditWrapper isEditor={isEditor} contentTag={"view-more-similar-options"} refreshContent={refreshContent}>
                        {renderContent('view-more-similar-options', 'Similar Options')}
                    </EditWrapper>
                </div>

                {similar.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 md:gap-x-10">
                        {similar.map((ticket) => (
                            <TicketCard
                                key={`similar-${ticket.package_tag}-${ticket.id}`}
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
