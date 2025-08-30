import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../utilities/Utilities';

import Banner2 from '../Components/Banner2/Banner2';
import Card from '../Components/Services/Card';
import useEditorCheck from '../hooks/useEditorCheck';
import useStaticContent from '../hooks/useStaticContent';
import EditWrapper from '../Components/Edit_Wrapper/EditWrapper';
import renderContent from '../utilities/renderContent.jsx';

import HeroImage from "../assets/new/Return-Policy.jpg";

const SearchPage = () => {
    const [ticketData, setTicketData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { search } = useLocation();

    // Editor and content hooks
    const { isEditor } = useEditorCheck();
    const { getContentByTag, hasContent, refreshContent } = useStaticContent('search');

    // Get query parameters
    const queryParams = new URLSearchParams(search);
    const ticketType = queryParams.get('ticketType');

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`${baseUrl}packages/`);
                let filteredPackages = response.data.bus_data || [];

                // Apply filtering if ticket type exists
                if (ticketType) {
                    filteredPackages = filteredPackages.filter(
                        (item) => item.duration.toLowerCase() === ticketType.toLowerCase()
                    );
                }

                setTicketData(filteredPackages);
            } catch (err) {
                setError('Failed to fetch data. Please try again later.');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (ticketType) {
            fetchData();
        } else {
            setLoading(false);
            setTicketData([]);
        }
    }, [ticketType]);

    return (
        <div className="container mx-auto">
            <Banner2
                opacity={0.6}
                bannerImgmd={HeroImage}
                bannerImgsm={HeroImage}
            >
                <EditWrapper isEditor={isEditor} contentTag={"search-page-title"} refreshContent={refreshContent}>
                    {renderContent('search-page-title', hasContent, getContentByTag, 'Available Tickets')}
                </EditWrapper>

                <EditWrapper isEditor={isEditor} contentTag={"search-page-subtitle"} refreshContent={refreshContent}>
                    {renderContent('search-page-subtitle', hasContent, getContentByTag, ticketType ? `Showing all ${ticketType} tickets` : 'Find your perfect ticket')}
                </EditWrapper>
            </Banner2>

            <div className="px-4 md:px-8">
                {/* Loading, Error, or Data Display */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#930B31]"></div>
                        <p className="mt-2 text-lg font-semibold text-gray-600">Loading tickets...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-500 text-lg">{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="mt-4 px-6 py-2 bg-[#930B31] text-white rounded-md hover:bg-red-800"
                        >
                            Try Again
                        </button>
                    </div>
                ) : ticketData.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-10 md:my-24 gap-3 md:gap-10 gap-y-8">
                        {ticketData.map((ticket) => (
                            <Card
                                key={ticket.id}
                                id={ticket.package_tag}
                                status={ticket.status}
                                title={ticket.title}
                                subtitle={ticket.type}
                                image={ticket.image_big}
                                thumbnail_small={ticket.thumbnail_small}
                                thumbnail_large={ticket.thumbnail_large}
                                thumbnail_small_alt={ticket.thumbnail_small_alt}
                                thumbnail_large_alt={ticket.thumbnail_large_alt}
                                duration={ticket.duration}
                                ticketCount={ticket.package_tag}
                                price={ticket.adult_price}
                                price2={ticket.youth_price}
                                company={ticket.company}
                                offPrice={ticket.off_price}
                                id1={ticket.id}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-600 text-lg">No tickets found for the selected type.</p>
                        <p className="text-gray-500 mt-2">Please try a different ticket type.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
