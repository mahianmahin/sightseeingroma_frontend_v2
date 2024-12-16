import React, { useEffect, useState } from "react";
import axios from "axios";
import TicketCard from "../Components/TicketCard/TicketCard";
import Similar from "./Similar";
import { FaArrowLeftLong } from "react-icons/fa6";
const LoveRome = () => {
    const [tickets, setTickets] = useState([]);

    // Fetch data using Axios
    useEffect(() => {
        axios
            .get("/loveRome.json")
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
            {/* Full-width responsive image */}
            <div className="hidden md:block">
                <img
                    src="./LoveRome/banner.png"
                    alt="Big Bus Rome"
                    className="w-full object-contain"
                />
            </div>

            <div className="block md:hidden">
                <img
                    src="./LoveRome/banner2.png"
                    alt="Big Bus Rome"
                    className="w-full object-contain"
                />
            </div>
           
            <div className="px-4 md:px-8">
           
            <div className="py-7 md:py-10 ">
               <div className="block md:hidden mb-3 ">
                <FaArrowLeftLong size={20}></FaArrowLeftLong>
               </div>

                    <h1 className="text-3xl font-bold">I love Rome Bus Service</h1>
                    <p className="text-gray-600">
                    Discover the Comfort of I Love Rome Travel 
                    </p>
                </div>

                {/* Render tickets dynamically */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 md:gap-x-10">
                    {tickets.map((ticket, index) => (
                        <TicketCard
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

            <div className="mb-12 md:mb-0">
         <Similar />
         </div>
        </div>
    );
};

export default LoveRome;
