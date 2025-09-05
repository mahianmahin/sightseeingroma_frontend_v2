import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import TicketCard from "../Components/TicketCard/TicketCard";
import HelmetWrapper from "../utilities/HelmetWrapper";
import scrollToTop, { baseUrl, baseUrlHashless } from '../utilities/Utilities';
import BigBusImage from "../assets/new/Big-Bus-Page-Hero-Image.jpg";
import ILoveRomeImage from "../assets/new/I-Love-Rome-Bus-Hero-Image.jpg";
import GreenLineImage from "../assets/new/GreenLine-Bus-Hero-Image.jpg";
import CitySightseeingImage from "../assets/new/CitySightSeeing-Bus-Hero-Image.jpg";
import { useParams } from "react-router-dom";
import useStaticContent from "../hooks/useStaticContent";
import EditWrapper from "../Components/Edit_Wrapper/EditWrapper";
import EditImageWrapper from "../Components/Edit_Wrapper/EditImageWrapper";
import EditPanelSheet from "../Components/EditPanel/EditPanelSheet";
import useEditorCheck from "../hooks/useEditorCheck";
import renderContent from "../utilities/renderContent";

const Companies = () => {
    const [busPackages, setBusPackages] = useState([]);
    const [unfilteredPackages, setUnfilteredPackages] = useState([]);
    const [imageLoaded, setImageLoaded] = useState(false);
    const { companySlug, companyName } = useParams();

    // Fetch data using Axios and filter for "big bus" company
    useEffect(() => {
        scrollToTop();
        setImageLoaded(false); // Reset image loaded state when company changes
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

    const { isEditor, error } = useEditorCheck();
    const { getContentByTag, getImageByTag, hasContent, refreshContent, loading, error: contentError } = useStaticContent(companySlug);

    // Mapping of company slugs to their banner image unique tags and fallback images
    const companyImageConfig = {
        'big-bus': {
            uniqueTag: 'big-bus-banner-image',
            altText: 'Big Bus Rome',
            fallbackImage: BigBusImage
        },
        'i-love-rome': {
            uniqueTag: 'i-love-rome-banner-image',
            altText: 'I Love Rome',
            fallbackImage: ILoveRomeImage
        },
        'green-line': {
            uniqueTag: 'green-line-banner-image',
            altText: 'Green Line',
            fallbackImage: GreenLineImage
        },
        'city-sightseeing': {
            uniqueTag: 'city-sightseeing-banner-image',
            altText: 'City Sightseeing',
            fallbackImage: CitySightseeingImage
        }
    };

    // Get the current company's image config
    const currentImageConfig = companyImageConfig[companySlug] || {
        uniqueTag: `${companySlug}-banner-image`,
        altText: companyName,
        fallbackImage: BigBusImage // Fallback to BigBusImage
    };

    // Get the banner image data from the database (only after loading is complete)
    const bannerImageData = !loading && getImageByTag ? getImageByTag(currentImageConfig.uniqueTag) : null;
    
    // Reset image loaded state when banner image data changes (after refresh)
    useEffect(() => {
        if (bannerImageData) {
            setImageLoaded(false);
        }
    }, [bannerImageData?.image?.file]); // Watch for changes in the image file path
    
    // Determine the image source (database image or fallback) with safety checks
    let bannerImageSrc;
    if (bannerImageData?.image?.file) {
        bannerImageSrc = `${baseUrlHashless}${bannerImageData.image.file}`;
    } else {
        bannerImageSrc = currentImageConfig.fallbackImage;
    }
    
    // Extra safety check - if no fallback image, use the default BigBusImage
    if (!bannerImageSrc) {
        bannerImageSrc = BigBusImage;
    }
    
    // Determine the alt text (from database or fallback)
    const bannerAltText = bannerImageData?.image?.alt_text || 
                         bannerImageData?.help_text || 
                         currentImageConfig.altText;

    // Custom refresh function that resets image state and refreshes content
    const handleImageRefresh = () => {
        setImageLoaded(false); // Reset image loading state
        refreshContent(); // Refresh the static content data
    };
 

    return (
        <>
            <HelmetWrapper title="Explore Rome with Big Bus | Book Tickets at Sightseeing Roma" description="Explore Rome with Big Bus hop-on hop-off tours. Choose from 24h, 48h, or 72h tickets, Travel in style, enjoy panoramic views, and discover top landmarks." />
            <EditPanelSheet isEditor={isEditor} error={error} page={companySlug} refreshContent={refreshContent} />
            <div className="container mx-auto">
                {/* Full-width responsive image */}
                <EditImageWrapper isEditor={isEditor} uniqueTag={currentImageConfig.uniqueTag} refreshContent={handleImageRefresh}>
                    <div className="relative">
                        {/* Skeleton loader - shows until image loads */}
                        {(!imageLoaded || loading) && (
                            <div className="absolute inset-0 bg-gray-200 animate-pulse">
                                <div className="w-full h-64 md:h-80 lg:h-96 flex items-center justify-center">
                                    <div className="space-y-4 w-full max-w-md px-4">
                                        {/* Animated skeleton bars */}
                                        <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                                        <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4"></div>
                                        <div className="h-4 bg-gray-300 rounded animate-pulse w-1/2"></div>
                                        <div className="flex items-center justify-center">
                                            <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                                        </div>
                                        <div className="text-center text-gray-500 text-sm">Loading banner image...</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Desktop Image */}
                        <div className="hidden md:block">
                            <img
                                src={bannerImageSrc}
                                alt={bannerAltText}
                                className={`w-full h-96 object-cover transition-opacity duration-500 ${
                                    imageLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                                onLoad={() => {
                                    setImageLoaded(true);
                                }}
                                onError={(e) => {
                                    console.error('Image failed to load:', bannerImageSrc);
                                    // Fallback to the static image if the dynamic one fails
                                    e.target.src = currentImageConfig.fallbackImage;
                                    setImageLoaded(true);
                                }}
                            />
                        </div>

                        {/* Mobile Image */}
                        <div className="block md:hidden">
                            <img
                                src={bannerImageSrc}
                                alt={bannerAltText}
                                className={`w-full h-64 object-cover transition-opacity duration-500 ${
                                    imageLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                                onLoad={() => {
                                    setImageLoaded(true);
                                }}
                                onError={(e) => {
                                    console.error('Image failed to load:', bannerImageSrc);
                                    // Fallback to the static image if the dynamic one fails
                                    e.target.src = currentImageConfig.fallbackImage;
                                    setImageLoaded(true);
                                }}
                            />
                        </div>
                    </div>
                </EditImageWrapper>
                
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
                                offPrice={ticket.off_price}
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
