import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosMailUnread } from "react-icons/io";
import { useState, useEffect } from "react";
import { baseUrl } from "../../utilities/Utilities";
import GetInTouch from '../../assets/new/Get-in-Touch.jpg';

const Contact = () => {
    const [contactData, setContactData] = useState({
        phone: "+39 327 3633 993", // fallback values
        email: "hello@sightseeingroma.com",
        address: "Piazza d'Ara Coeli,8, 00186, roma",
        mapLink: "https://maps.app.goo.gl/5tippW2iGzJ7h8TY7"
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContactData = async () => {
            try {
                const response = await fetch(`${baseUrl}website-settings/`);
                if (response.ok) {
                    const result = await response.json();
                    if (result.status === 200 && result.data) {
                        setContactData({
                            phone: result.data.website_phone_number || contactData.phone,
                            email: result.data.website_email || contactData.email,
                            address: result.data.website_address || contactData.address,
                            mapLink: result.data.address_map_link || contactData.mapLink
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching contact data:", error);
                // Keep fallback values if API fails
            } finally {
                setLoading(false);
            }
        };

        fetchContactData();
    }, []);

    return (
        <div className="flex flex-col md:flex-row md:justify-between md:items-center p-6 md:p-12 ">
            {/* Contact Info */}
            <div className="text-left md:w-1/2 mb-6 md:mb-0">
                <p className="py-2 my-4 text-2xl font-bold text-gray-800 border-b-4 border-yellow-500 inline-block">Get In Touch</p>
                <h2 className=" text-lg md:text-3xl font-bold mb-2">From Comfort to Budget, Explore Ticket Options for Every Traveler</h2>
                <p className="text-gray-600 mb-4">Seamless booking, diverse routes, and flexible schedules at your fingertips</p>
                
                {loading ? (
                    <div className="space-y-2">
                        <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                ) : (
                    <ul className="space-y-2 text-sm md:text-base font-bold">
                        <li className="flex items-center gap-2">
                            <FaPhoneAlt /> 
                            <a href={`tel:${contactData.phone}`} target="_blank" rel="noopener noreferrer">
                                {contactData.phone}
                            </a>
                        </li>
                        <li className="flex items-center gap-2">
                            <IoIosMailUnread /> 
                            <a href={`mailto:${contactData.email}`} target="_blank" rel="noopener noreferrer">
                                {contactData.email}
                            </a>
                        </li>
                        <li className="flex items-center gap-2 underline">
                            <FaLocationDot /> 
                            <a href={contactData.mapLink} target="_blank" rel="noopener noreferrer">
                                {contactData.address}
                            </a>
                        </li>
                    </ul>
                )}
            </div>

            {/* Image Section */}
            <div className="w-full md:w-1/2">
                <img src={GetInTouch} alt="Get in Touch" className="w-full h-auto rounded-lg object-cover" />
            </div>
        </div>
    );
};

export default Contact;