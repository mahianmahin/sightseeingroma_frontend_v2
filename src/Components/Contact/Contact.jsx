import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import { useState, useEffect } from "react";
import { baseUrl, baseUrlHashless } from "../../utilities/Utilities";
import GetInTouch from '../../assets/new/Get-in-Touch.jpg';
import EditWrapper from "../Edit_Wrapper/EditWrapper";
import EditImageWrapper from "../Edit_Wrapper/EditImageWrapper";
import renderContent from "../../utilities/renderContent.jsx";

const Contact = (props) => {
    const [contactData, setContactData] = useState({
        phone: "+39 327 3633 993", // fallback values
        email: "hello@sightseeingroma.com",
        address: "Piazza d'Ara Coeli,8, 00186, roma",
        mapLink: "https://maps.app.goo.gl/5tippW2iGzJ7h8TY7"
    });
    const [loading, setLoading] = useState(true);

    // Get contact image from static content or fallback to imported image
    const contactImageData = props.getImageByTag ? props.getImageByTag('get-in-touch') : null;
    const contactImageUrl = contactImageData?.image?.file ? `${baseUrlHashless}${contactImageData.image.file}` : GetInTouch;

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

    const contactItems = [
        {
            icon: <FaPhoneAlt />,
            label: "Call Us",
            value: contactData.phone,
            link: `tel:${contactData.phone}`,
            isExternal: false
        },
        {
            icon: <FaEnvelope />,
            label: "Email Us",
            value: contactData.email,
            link: `mailto:${contactData.email}`,
            isExternal: false
        },
        {
            icon: <FaMapMarkerAlt />,
            label: "Visit Us",
            value: contactData.address,
            link: contactData.mapLink,
            isExternal: true
        }
    ];

    return (
        <div className="relative w-full bg-white overflow-hidden">
            <div className="container mx-auto px-4 py-8 lg:py-16">
                <div className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-16">
                    
                    {/* Content Section */}
                    <div className="w-full lg:w-1/2">
                        <div className="text-center lg:text-left mb-8">
                            <h4 className="text-[#FAD502] font-bold uppercase tracking-wider mb-2 text-sm md:text-base">
                                <EditWrapper isEditor={props.isEditor} contentTag={"get-in-touch-label"} refreshContent={props.refreshContent}>
                                    {renderContent('get-in-touch-label', props.hasContent, props.getContentByTag, 'Contact Us')}
                                </EditWrapper>
                            </h4>
                            <h2 className="text-3xl lg:text-5xl font-bold text-[#930B31] mb-4">
                                <EditWrapper isEditor={props.isEditor} contentTag={"get-in-touch-title"} refreshContent={props.refreshContent}>
                                    {renderContent('get-in-touch-title', props.hasContent, props.getContentByTag, 'Get in Touch')}
                                </EditWrapper>
                            </h2>
                            <div className="text-gray-600 text-base lg:text-lg leading-relaxed">
                                <EditWrapper isEditor={props.isEditor} contentTag={"get-in-touch-subtitle"} refreshContent={props.refreshContent}>
                                    {renderContent('get-in-touch-subtitle', props.hasContent, props.getContentByTag, 'We are here to help you with any questions you may have.')}
                                </EditWrapper>
                            </div>
                        </div>

                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {contactItems.map((item, index) => (
                                    <a 
                                        key={index}
                                        href={item.link}
                                        target={item.isExternal ? "_blank" : "_self"}
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-white border border-gray-100 hover:border-[#FAD502] hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-[#930B31] text-white flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
                                            {item.icon}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-0.5">
                                                {item.label}
                                            </p>
                                            <p className="text-[#930B31] font-bold text-sm md:text-base break-all md:break-normal">
                                                {item.value}
                                            </p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Image Section */}
                    <div className="w-full lg:w-1/2">
                        <div className="overflow-hidden">
                            <EditImageWrapper 
                                isEditor={props.isEditor} 
                                uniqueTag="get-in-touch" 
                                refreshContent={props.refreshContent} 
                                className="w-full"
                            >
                                <img 
                                    src={contactImageUrl} 
                                    alt="Contact Us" 
                                    className="w-full h-auto object-cover" 
                                />
                            </EditImageWrapper>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;