import { useEffect, useState } from "react";
import axios from "axios";
import OfferCard from "../Components/OfferCard/OfferCard";
import OfferBanner from './../Components/OfferBanner/OfferBanner';
import { FaArrowLeftLong } from "react-icons/fa6";
import OfferBannerMd from "../Components/OfferBanner/OfferBannerMd";


const OfferPage = () => {
    const [tickets, setTickets] = useState([]);

    // Fetch data using Axios
    useEffect(() => {
        axios.get("/bus.json")
            .then((response) => {
                setTickets(response.data);
            })
            .catch((error) => {
                console.error("Error fetching bigBus data:", error);
            });
    }, []);

    // Function to handle ticket button click
    const handleTicketClick = (index) => {
        console.log("Ticket clicked at index:", index);
    };



    return (
        <div className="container mx-auto">
           <div className="block md:hidden">
           <OfferBanner></OfferBanner>
           </div>

           <div className="hidden md:block">
            <OfferBannerMd></OfferBannerMd>
           </div>
            <div className="px-4 md:px-10 ">
                <div className="block md:hidden mb-3 pt-7 ">
                    <FaArrowLeftLong size={20}></FaArrowLeftLong>
                </div>
                <div className="py-4 md:py-14 ">
                    <h1 className="text-2xl md:text-3xl font-bold">Exciting Deals Just for You!</h1>
                    <p className="text-gray-600">
                        Save big on your next trip with our exclusive promotions
                    </p>
                </div>

                {/* Render tickets dynamically */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 md:gap-x-10">
                    {tickets.map((ticket, index) => (
                        <OfferCard
                            key={index}
                            title={ticket.title}
                            subtitle={ticket.subtitle}
                            image={ticket.image}
                            duration={ticket.duration}
                            ticketCount={ticket.ticket_count}
                            price={ticket.price}
                            onClick={() => handleTicketClick(index)} // Pass the click handler
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OfferPage;