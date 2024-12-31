import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../utilities/Utilities';
import { FaArrowLeftLong } from 'react-icons/fa6';
import TicketCard from '../Components/TicketCard/TicketCard';
import Similar from './Similar';
import Banner2 from '../Components/Banner2/Banner2';

const SearchPage = () => {
    const [ticketData, setTicketData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { search } = useLocation();

    const queryParams = new URLSearchParams(search);
    const busService = queryParams.get('bus');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`${baseUrl}packages/`);
                const filteredPackages = response.data.bus_data.filter(
                    (item) => item.company.toLowerCase() === busService.toLowerCase()
                );
                setTicketData(filteredPackages);
            } catch (err) {
                setError('Failed to fetch data. Please try again later.');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (busService) {
            fetchData();
        } else {
            setLoading(false);
            setTicketData([]);
        }
    }, [busService]);

    return (
        <div className="container mx-auto">
            {/* Full-width responsive image */}
            <Banner2
                bannerImgmd={'/Banner/b8.png'}
                bannerImgsm={'/Banner/b7.png'}
                title={'Search Results'}
                description={'Find the best bus service for your journey'}
            />

            <div className="px-4 md:px-8">
                <div className="py-7 md:py-10">
                    <div className="block md:hidden mb-3">
                        <FaArrowLeftLong size={20} />
                    </div>

                    <h1 className="text-3xl font-bold">{busService}</h1>
                    <p className="text-gray-600">
                        Travel in style with our big bus services
                    </p>
                </div>

                {/* Handle loading, error, and data states */}
                {loading ? (
                    <div className="text-center text-lg font-semibold">
                        Loading tickets...
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 text-lg">{error}</div>
                ) : ticketData.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 md:gap-x-10">
                        {ticketData.map((ticket) => (
                            <TicketCard
                                key={ticket.id}
                                id={ticket.id}
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
