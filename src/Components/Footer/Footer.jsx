
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className="bg-black font-color-1 py-10 px-2 md:px-4">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                {/* Logo and Description */}
                <div className="space-y-4  md:text-left">

                    <Link to={'/'}><img src="https://iili.io/2uJqnr7.png" className=" w-1/2  mx-auto md:mx-0" alt="Sightseeing Roma Logo" /></Link>
                    <p className="text-sm">
                        At Sightseeing Roma, we believe that every traveler deserves to explore the majestic beauty and rich history of Rome with ease and comfort. Established with a passion for delivering unforgettable experiences, we are your gateway to the heart of this ancient city.
                    </p>
                </div>

                {/* Bus Services and About Section */}
                <div className="grid grid-cols-2 gap-8">
                    {/* Bus Services */}
                    <div className=" md:text-left">
                        <h3 className="font-semibold pb-4 text-lg">Bus Services</h3>
                        <ul className="flex flex-col space-y-2 text-sm">
                            <Link to={"/bigBus"}>  <li>Big Bus</li></Link>
                            <Link to={"/greenLine"}>  <li>Green Line</li></Link>
                            <Link to={"/loveRome"}>  <li>I Love Rome</li></Link>
                            <Link to={"/iobus"}>  <li>IO Bus</li></Link>
                            <Link to={"/city"}>  <li>CitySightseeing</li></Link>


                        </ul>
                    </div>

                    {/* About */}
                    <div className=" md:text-left">
                        <h3 className="font-semibold pb-4 text-lg">About</h3>
                        <ul className="flex flex-col space-y-2 text-sm">
                            <Link to={'/aboutus'}><li>About Us</li></Link>
                            <Link to={'/terms'}><li>Terms & Conditions</li></Link>
                            <Link to={'/returnPolicy'}><li>Return Policy</li></Link>
                            <Link to={'/refund'}><li>Refund Policy</li></Link>
                            <li>Privacy Policy</li>
                        </ul>
                    </div>
                </div>

                {/* Stay Updated */}
                <div className=" md:text-left">
                    <h3 className="font-semibold pb-4 text-lg">Stay Updated</h3>
                    <p className="text-sm mb-4">Sign up to receive exclusive offers, travel tips, and the latest bus routes directly to your inbox.</p>
                    <div className="flex justify-start items-center w-full max-w-md ">
                        <input
                            type="email"
                            placeholder="Email address"
                            className=" p-2 text-black text-sm sm:text-base   rounded-l focus:outline-none"
                        />
                        <button
                            className="bg-yellow-500 text-black font-semibold px-2 sm:px-2 py-2 text-sm sm:text-base w-auto sm:w-36 md:w-40 rounded-r whitespace-nowrap"
                        >
                            Buy Ticket
                        </button>
                    </div>

                    {/* Payment Methods */}
                    <h1 className='font-bold mt-10 mb-5'>Payment Methods</h1>
                    <div className="flex space-x-4">
                        <img src="https://iili.io/2uJuUuI.png" alt="Visa" className="h-6" />

                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="container mx-auto px-4 mt-8 border-t border-gray-700 pt-4 flex flex-col-reverse md:flex-row items-start md:items-center justify-between text-sm space-y-4 md:space-y-0">
                <p>© All Rights Reserved to Sightseeing Roma</p>



                {/* Social Media Icons */}
                <div className="flex space-x-4 text-lg pb-3 md:pb-0">
                    <a href="#" className="hover:text-gray-400"><i className="fab fa-facebook-f"></i></a>
                    <a href="#" className="hover:text-gray-400"><i className="fab fa-youtube"></i></a>
                    <a href="#" className="hover:text-gray-400"><i className="fab fa-instagram"></i></a>
                </div>
            </div>
        </div>
    );
};

export default Footer;
