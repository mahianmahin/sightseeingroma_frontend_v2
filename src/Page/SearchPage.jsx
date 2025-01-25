import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../utilities/Utilities';

import Banner2 from '../Components/Banner2/Banner2';
import Card from '../Components/Services/Card';

const SearchPage = () => {
    const [ticketData, setTicketData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { search } = useLocation();

    // Get query parameters
    const queryParams = new URLSearchParams(search);
    const busService = queryParams.get('bus');
    const ticketType = queryParams.get('ticketType');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`${baseUrl}packages/`);
                let filteredPackages = response.data.bus_data || [];

                // Apply filtering if query params exist
                if (busService) {
                    filteredPackages = filteredPackages.filter(
                        (item) => item.company.toLowerCase() === busService.toLowerCase()
                    );
                }
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

        if (busService || ticketType) {
            fetchData();
        } else {
            setLoading(false);
            setTicketData([]);
        }
    }, [busService, ticketType]);

    return (
        <div className="container mx-auto">
            <Banner2
                bannerImgmd={'/Banner/b8.png'}
                bannerImgsm={'/Banner/b7.png'}
                title={'Search Results'}
                description={'Find the best bus service for your journey'}
            />

            <div className="px-4 md:px-8">
                {/* Loading, Error, or Data Display */}
                {loading ? (
                    <div className="text-center text-lg font-semibold">Loading tickets...</div>
                ) : error ? (
                    <div className="text-center text-red-500 text-lg">{error}</div>
                ) : ticketData.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-10 md:my-24 gap-x-2 md:gap-x-10">
                        {ticketData.map((ticket) => (
                            <Card
                                key={ticket.package_tag} // Ensure unique key
                                id={ticket.package_tag}
                                status={ticket.status}
                                title={ticket.title}
                                subtitle={ticket.type}
                                image={ticket.image_big}
                                duration={ticket.duration}
                                ticketCount={ticket.package_tag}
                                price={ticket.adult_price}
                                price2={ticket.youth_price}
                                company={ticket.company}
                                id1={ticket.id}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-600 text-lg">
                        No tickets found. Please refine your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
