import '@fortawesome/fontawesome-free/css/all.min.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "../../assets/Logo.png";
import scrollToTop, { baseUrl } from '../../utilities/Utilities';
import paymentMethods from '../../assets/payment_banners.png';
import useStaticContent from '../../hooks/useStaticContent';
import EditWrapper from '../Edit_Wrapper/EditWrapper';
import useEditorCheck from '../../hooks/useEditorCheck';
import renderContent from '../../utilities/renderContent.jsx';

const Footer = () => {
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [socialLinks, setSocialLinks] = useState({
        facebook: "https://www.facebook.com/sightseeingroma", // fallback values
        instagram: "https://www.instagram.com/sightseeingroma"
    });
    const [socialLoading, setSocialLoading] = useState(true);

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

        const fetchSocialLinks = async () => {
            try {
                const response = await fetch(`${baseUrl}website-settings/`);
                if (response.ok) {
                    const result = await response.json();
                    if (result.status === 200 && result.data) {
                        setSocialLinks({
                            facebook: result.data.website_facebook || socialLinks.facebook,
                            instagram: result.data.website_instagram || socialLinks.instagram
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching social links:", error);
                // Keep fallback values if API fails
            } finally {
                setSocialLoading(false);
            }
        };

        fetchFolders();
        fetchSocialLinks();
    }, []);


    // Newsletter state and handler
    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [newsletterStatus, setNewsletterStatus] = useState(null); // 'success' | 'error' | null
    const [newsletterLoading, setNewsletterLoading] = useState(false);

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();
        setNewsletterStatus(null);
        setNewsletterLoading(true);
        try {
            const response = await fetch(`${baseUrl}newsletter/subscribe/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: newsletterEmail })
            });
            let data = {};
            try {
                data = await response.json();
            } catch (e) {}
            if (
                data && (data.message === "Email already subscribed" || data.error === "Email already subscribed")
            ) {
                setNewsletterStatus("already");
            } else if (response.ok) {
                setNewsletterStatus("success");
                setNewsletterEmail("");
            } else {
                setNewsletterStatus("error");
            }
        } catch (err) {
            setNewsletterStatus("error");
        } finally {
            setNewsletterLoading(false);
        }
    };

    const { isEditor } = useEditorCheck();
    const { getContentByTag, hasContent, refreshContent } = useStaticContent('footer');

    return (
        <div className="bg-black font-color-1 py-10 px-2 md:px-4">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                {/* Logo and Description */}
                <div className="space-y-4  md:text-left">

                    <Link to={'/'}><img src={logo} className=" w-1/2  mx-auto md:mx-0" alt="Sightseeing Roma Logo" /></Link>

                    <EditWrapper isEditor={isEditor} contentTag={"footer-text"} refreshContent={refreshContent}>
                      {renderContent('footer-text', hasContent, getContentByTag, 'Your trusted partner for exploring Rome')}
                    </EditWrapper>
                
                </div>

                {/* Bus Services and About Section */}
                <div className="grid grid-cols-2 gap-8">
                    {/* Bus Services */}
                    <div className=" md:text-left">

                        <EditWrapper isEditor={isEditor} contentTag={"footer-bus-services-title"} refreshContent={refreshContent}>
                            {renderContent('footer-bus-services-title', hasContent, getContentByTag, 'Bus Services')}
                        </EditWrapper>

                        <ul className="flex flex-col space-y-2 text-sm">
                            {loading ? (
                                <li>Loading services...</li>
                            ) : error ? (
                                <li className="text-red-500">{error}</li>
                            ) : (
                                folders.map((folder) => (
                                    <Link onClick={() => {scrollToTop();}} key={folder.id} to={`/bus/${folder.company_slug}/${folder.name.toLowerCase()}`}>
                                        <li>{folder.name}</li>
                                    </Link>
                                ))
                            )}
                        </ul>
                    </div>

                    {/* About */}
                    <div className=" md:text-left">
                        
                        <EditWrapper isEditor={isEditor} contentTag={"footer-about-title"} refreshContent={refreshContent}>
                            {renderContent('footer-about-title', hasContent, getContentByTag, 'About')}
                        </EditWrapper>
                        
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
                    
                    <EditWrapper isEditor={isEditor} contentTag={"footer-newsletter-title"} refreshContent={refreshContent}>
                        {renderContent('footer-newsletter-title', hasContent, getContentByTag, 'Newsletter')}
                    </EditWrapper>

                    <EditWrapper isEditor={isEditor} contentTag={"footer-newsletter-text"} refreshContent={refreshContent}>
                        {renderContent('footer-newsletter-text', hasContent, getContentByTag, 'Subscribe to get updates on our latest offers')}
                    </EditWrapper>
                    
                    <form className="flex justify-start items-center w-full max-w-md " onSubmit={handleNewsletterSubmit}>
                        <input
                            type="email"
                            placeholder="Email address"
                            className=" p-2 text-black text-sm sm:text-base   rounded-l focus:outline-none"
                            value={newsletterEmail}
                            onChange={e => setNewsletterEmail(e.target.value)}
                            required
                            disabled={newsletterLoading}
                        />
                        <button
                            type="submit"
                            className="bg-yellow-500 text-black font-semibold px-2 sm:px-2 py-2 text-sm sm:text-base w-auto sm:w-36 md:w-40 rounded-r whitespace-nowrap disabled:opacity-60"
                            disabled={newsletterLoading}
                        >
                            {newsletterLoading ? "..." : "HOP IN!"}
                        </button>
                    </form>
                    {newsletterStatus === "success" && (
                        <p className="text-green-400 mt-2 text-sm">Thank you for subscribing! Please check your email.</p>
                    )}
                    {newsletterStatus === "already" && (
                        <p className="text-yellow-400 mt-2 text-sm">This email is already subscribed to our newsletter.</p>
                    )}
                    {newsletterStatus === "error" && (
                        <p className="text-red-400 mt-2 text-sm">Subscription failed. Please try again later.</p>
                    )}

                    {/* Payment Methods */}
                    
                    <EditWrapper isEditor={isEditor} contentTag={"footer-payment-methods-title"} refreshContent={refreshContent}>
                        {renderContent('footer-payment-methods-title', hasContent, getContentByTag, 'Payment Methods')}
                    </EditWrapper>
                    
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
                    {socialLoading ? (
                        <>
                            <div className="w-6 h-6 bg-gray-600 rounded animate-pulse"></div>
                            <div className="w-6 h-6 bg-gray-600 rounded animate-pulse"></div>
                        </>
                    ) : (
                        <>
                            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            {/* <a href="#" className="hover:text-gray-400"><i className="fab fa-youtube"></i></a> */}
                            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
                                <i className="fab fa-instagram"></i>
                            </a>
                        </>
                    )}
                </div>
            </div>
            
            <div className="container mx-auto px-4 border-gray-700 flex flex-col-reverse md:flex-row items-start md:items-center justify-between text-sm space-y-4 md:space-y-0">
                <p>Designed & Developed by <a href="https://wa.me/8801762142364" target="_blank" rel="noopener noreferrer" className="text-yellow-500">Mahian Mahin</a>.</p>
            </div>

        </div>
    );
};

export default Footer;
