
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
    return (
        <div className="bg-black text-white py-10">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                
                {/* Logo and Description */}
                <div className="space-y-4  md:text-left">
                    <h2 className="text-xl font-bold">Sightseeing Roma</h2>
                    <img src="https://iili.io/2uJqnr7.png" className="h-20 mx-auto md:mx-0" alt="Sightseeing Roma Logo" />
                    <p className="text-sm">
                        At Sightseeing Roma, we believe that every traveler deserves to explore the majestic beauty and rich history of Rome with ease and comfort. Established with a passion for delivering unforgettable experiences, we are your gateway to the heart of this ancient city.
                    </p>
                </div>

                {/* Bus Services and About Section */}
                <div className="grid grid-cols-2 gap-8">
                    {/* Bus Services */}
                    <div className=" md:text-left">
                        <h3 className="font-semibold text-lg">Bus Services</h3>
                        <ul className="space-y-2 text-sm">
                            <li>Big Bus</li>
                            <li>Green Line</li>
                            <li>I Love Rome</li>
                            <li>ID Bus</li>
                            <li>Sightseeing</li>
                        </ul>
                    </div>

                    {/* About */}
                    <div className=" md:text-left">
                        <h3 className="font-semibold text-lg">About</h3>
                        <ul className="space-y-2 text-sm">
                            <li>About Us</li>
                            <li>Terms & Conditions</li>
                            <li>Return Policy</li>
                            <li>Refund Policy</li>
                            <li>Privacy Policy</li>
                        </ul>
                    </div>
                </div>

                {/* Stay Updated */}
                <div className=" md:text-left">
                    <h3 className="font-semibold text-lg">Stay Updated</h3>
                    <p className="text-sm mb-4">Sign up to receive exclusive offers, travel tips, and the latest bus routes directly to your inbox.</p>
                    <div className="flex justify-center md:justify-start">
                        <input type="email" placeholder="Email address" className="w-full p-2 text-black rounded-l" />
                        <button className="bg-yellow-500 text-black px-4 py-2 rounded-r">Buy Ticket</button>
                    </div>
                     {/* Payment Methods */}
                     <h1 className='font-bold mt-10 mb-5'>Payment Methods</h1>
                <div className="flex space-x-4">
                    <img  src="https://iili.io/2uJuUuI.png"  alt="Visa" className="h-6" />
                   
                </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="container mx-auto px-4 mt-8 border-t border-gray-700 pt-4 flex flex-col md:flex-row items-center justify-between text-sm space-y-4 md:space-y-0">
                <p>© All Rights Reserved to Sightseeing Roma</p>

               

                {/* Social Media Icons */}
                <div className="flex space-x-4 text-lg">
                    <a href="#" className="hover:text-gray-400"><i className="fab fa-facebook-f"></i></a>
                    <a href="#" className="hover:text-gray-400"><i className="fab fa-youtube"></i></a>
                    <a href="#" className="hover:text-gray-400"><i className="fab fa-instagram"></i></a>
                </div>
            </div>
        </div>
    );
};

export default Footer;
