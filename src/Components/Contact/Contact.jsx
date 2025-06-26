import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosMailUnread } from "react-icons/io";

const Contact = () => {
    return (
        <div className="flex flex-col md:flex-row md:justify-between md:items-center p-6 md:p-12 ">
            {/* Images for Small Devices */}
            <div className="flex flex-col justify-center gap-1 mb-6 block md:hidden">
                <img src="https://iili.io/2uHPAx4.png" alt="Tour Image 1" className="w-full rounded-lg" />
                <img src="https://iili.io/2uHPk5g.png" alt="Tour Image 2" className="w-full rounded-lg" />
                <img src="https://iili.io/2uHiBhx.png" alt="Tour Image 3" className="w-full rounded-lg" />
            </div>

            {/* Contact Info */}
            <div className="text-left md:w-1/2 mb-6 md:mb-0">
                <p className="py-2 md:py-4">Get In Touch</p>
                <h2 className=" text-lg md:text-3xl font-bold mb-2">From Comfort to Budget, Explore Ticket Options for Every Traveler</h2>
                <p className="text-gray-600 mb-4">Seamless booking, diverse routes, and flexible schedules at your fingertips</p>
                <ul className="space-y-2 text-sm md:text-base font-bold">
                    <li className="flex items-center gap-2"><FaPhoneAlt /> <a href="tel:+393286076514" target="_blank" rel="noopener noreferrer">+393286076514</a></li>
                    <li className="flex items-center gap-2"><IoIosMailUnread /> <a href="mailto:hello@sightseeingroma.com" target="_blank" rel="noopener noreferrer">hello@sightseeingroma.com</a></li>
                    <li className="flex items-center gap-2 underline"><FaLocationDot /> <a href="https://maps.app.goo.gl/5tippW2iGzJ7h8TY7" target="_blank" rel="noopener noreferrer">Piazza del Popolo, 00185 Roma, Italy</a></li>
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
