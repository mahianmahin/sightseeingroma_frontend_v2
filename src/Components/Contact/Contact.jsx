import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosMailUnread } from "react-icons/io";
import GetInTouch from '../../assets/new/Get-in-Touch.jpg';

const Contact = () => {
    return (
        <div className="flex flex-col md:flex-row md:justify-between md:items-center p-6 md:p-12 ">
            {/* Contact Info */}
            <div className="text-left md:w-1/2 mb-6 md:mb-0">
                <p className="py-2 my-4 text-2xl font-bold text-gray-800 border-b-4 border-yellow-500 inline-block">Get In Touch</p>
                <h2 className=" text-lg md:text-3xl font-bold mb-2">From Comfort to Budget, Explore Ticket Options for Every Traveler</h2>
                <p className="text-gray-600 mb-4">Seamless booking, diverse routes, and flexible schedules at your fingertips</p>
                <ul className="space-y-2 text-sm md:text-base font-bold">
                    <li className="flex items-center gap-2"><FaPhoneAlt /> <a href="tel:+393273633993" target="_blank" rel="noopener noreferrer">+39 327 3633 993</a></li>
                    <li className="flex items-center gap-2"><IoIosMailUnread /> <a href="mailto:hello@sightseeingroma.com" target="_blank" rel="noopener noreferrer">hello@sightseeingroma.com</a></li>
                    <li className="flex items-center gap-2 underline"><FaLocationDot /> <a href="https://maps.app.goo.gl/5tippW2iGzJ7h8TY7" target="_blank" rel="noopener noreferrer">Piazza del Popolo, 00185 Roma, Italy</a></li>
                </ul>
            </div>

            {/* Image Section */}
            <div className="w-full md:w-1/2">
                <img src={GetInTouch} alt="Get in Touch" className="w-full h-auto rounded-lg object-cover" />
            </div>
        </div>
    );
};

export default Contact;