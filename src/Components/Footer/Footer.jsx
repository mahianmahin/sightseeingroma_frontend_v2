import '@fortawesome/fontawesome-free/css/all.min.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "../../assets/Logo.png";
import { baseUrl } from '../../utilities/Utilities';
import paymentMethods from '../../assets/payment_banners.png';

const Footer = () => {
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const response = await fetch(`${baseUrl}packages/`);
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                // Filter only active folders
                const activeFolders = data.folders.filter(folder => folder.active);
                setFolders(activeFolders);
            } catch (error) {
                console.error("Error fetching folders:", error);
                setError("Failed to load bus services. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchFolders();
    }, []);

    // Function to generate route path from folder name
    const getRoutePath = (folderName) => {
        // Map folder names to their corresponding routes
        const routeMap = {
            'big bus': '/bigbus',
            'green line': '/greenline',
            'io_bus': '/iobus',
            'city sightseeing': '/city',
            'i love rome': '/loverome'
        };
        
        // Convert to lowercase for case-insensitive matching
        const normalizedName = folderName.toLowerCase();
        return routeMap[normalizedName] || `/${normalizedName.replace(/\s+/g, '')}`;
    };

    return (
        <div className="bg-black font-color-1 py-10 px-2 md:px-4">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                {/* Logo and Description */}
                <div className="space-y-4  md:text-left">

                    <Link to={'/'}><img src={logo} className=" w-1/2  mx-auto md:mx-0" alt="Sightseeing Roma Logo" /></Link>
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
                            {loading ? (
                                <li>Loading services...</li>
                            ) : error ? (
                                <li className="text-red-500">{error}</li>
                            ) : (
                                folders.map((folder) => (
                                    <Link key={folder.id} to={getRoutePath(folder.name)}>
                                        <li>{folder.name}</li>
                                    </Link>
                                ))
                            )}
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
                            {/* <li>Privacy Policy</li> */}
                        </ul>
                    </div>
                </div>

                {/* Newsletter */}
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
                            HOP IN!
                        </button>
                    </div>

                    {/* Payment Methods */}
                    <h1 className='font-bold mt-10 mb-5'>Payment Methods</h1>
                    <div className="flex space-x-4">
                        <img src={paymentMethods} alt="Payment Methods" className="h-6" />

                    </div>
                </div>
            </div>

            {/* Credits section */}
            <div className="container mx-auto px-4 mt-8 border-t border-gray-700 pt-4 flex flex-col-reverse md:flex-row items-start md:items-center justify-between text-sm space-y-4 md:space-y-0">
                <p>© All Rights Reserved to Sightseeing Roma</p>



                {/* Social Media Icons */}
                <div className="flex space-x-4 text-lg pb-3 md:pb-0">
                    <a href="https://www.facebook.com/sightseeingroma" className="hover:text-gray-400"><i className="fab fa-facebook-f"></i></a>
                    {/* <a href="#" className="hover:text-gray-400"><i className="fab fa-youtube"></i></a> */}
                    <a href="https://www.instagram.com/sightseeingroma" className="hover:text-gray-400"><i className="fab fa-instagram"></i></a>
                </div>
            </div>
            
            <div className="container mx-auto px-4 border-gray-700 flex flex-col-reverse md:flex-row items-start md:items-center justify-between text-sm space-y-4 md:space-y-0">
                <p>Designed & Developed by <a href="https://wa.me/8801762142364" target="_blank" rel="noopener noreferrer" className="text-yellow-500">Mahian Mahin</a>.</p>
            </div>

        </div>
    );
};

export default Footer;
