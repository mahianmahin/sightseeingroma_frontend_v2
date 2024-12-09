import { FaPhoneAlt } from "react-icons/fa";
import { IoIosMailUnread } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";

const Contact = () => {
    return (
        <div className="flex flex-col md:flex-row md:justify-between md:items-center p-6 md:p-12 ">
            {/* Images for Small Devices */}
            <div className="flex flex-col justify-center gap-4 mb-6 block md:hidden">
                <img src="https://iili.io/2uHPAx4.png" alt="Tour Image 1" className="w-full rounded-lg" />
                <img src="https://iili.io/2uHPk5g.png" alt="Tour Image 2" className="w-full rounded-lg" />
                <img src="https://iili.io/2uHiBhx.png" alt="Tour Image 3" className="w-full rounded-lg" />
            </div>

            {/* Contact Info */}
            <div className="text-left md:w-1/2 mb-6 md:mb-0">
                <p>Get In Touch</p>
                <h2 className="text-2xl font-bold mb-2">From Comfort to Budget, Explore Ticket Options for Every Traveler</h2>
                <p className="text-gray-600 mb-4">Seamless booking, diverse routes, and flexible schedules at your fingertips</p>
                <ul className="space-y-2 font-bold">
                    <li className="flex items-center gap-2"><FaPhoneAlt /> 00393228076514</li>
                    <li className="flex items-center gap-2"><IoIosMailUnread /> hello@sightseeingroma.com</li>
                    <li className="flex items-center gap-2"><FaLocationDot /> Piazza d'Aracoeli, 8, 00186 Roma RM, Italy</li>
                </ul>
            </div>

            {/* Images with Slanted Effect for Large Devices */}
            <div className="hidden md:flex flex-col md:flex-row h-full md:w-1/2">
                <img src="https://iili.io/2uHvRmN.md.png" alt="Large Tour Image" className="w-full rounded-lg" />
            </div>
        </div>
    );
};

export default Contact;
