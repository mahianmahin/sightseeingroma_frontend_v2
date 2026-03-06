import { FaCreditCard, FaQrcode, FaMapMarkerAlt } from "react-icons/fa";
import processImage from "../../assets/process_image.webp";

const Work = () => {
    const steps = [
        {
            icon: <FaCreditCard className="text-xl md:text-2xl" />,
            titleTag: "work-step-1-title",
            descTag: "work-step-1-desc",
            defaultTitle: "Book Tickets",
            defaultDesc: "Select your preferred package and book tickets online securely."
        },
        {
            icon: <FaQrcode className="text-xl md:text-2xl" />,
            titleTag: "work-step-2-title",
            descTag: "work-step-2-desc",
            defaultTitle: "Get QR Code",
            defaultDesc: "Receive your digital ticket with a QR code instantly via email."
        },
        {
            icon: <FaMapMarkerAlt className="text-xl md:text-2xl" />,
            titleTag: "work-step-3-title",
            descTag: "work-step-3-desc",
            defaultTitle: "Hop On",
            defaultDesc: "Show your QR code to our staff at any stop and start exploring."
        }
    ];
    
    return (
        <div className="relative w-full overflow-hidden">
            {/* Background for Desktop */}
            <div className="absolute inset-0 hidden lg:block">
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${processImage})` }}>
                <div className="absolute inset-0 bg-gradient-to-r from-[#930B31]/95 to-[#930B31]/80"></div>
            </div>
            </div>

            {/* Background for Mobile */}
            <div className="absolute inset-0 lg:hidden bg-[#930B31]"></div>

            <div className="relative z-10 container mx-auto px-4 py-6 lg:py-16">
                <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
                    
                    {/* Header Section */}
                    <div className="w-full lg:w-1/4 text-center lg:text-left">
                        <h2 className="text-2xl lg:text-4xl font-bold text-white mb-2">
                            The Process
                        </h2>
                        <div className="w-16 h-1 bg-[#FAD502] mx-auto lg:mx-0 rounded-full mb-2 lg:mb-4"></div>
                    </div>

                    {/* Steps Section */}
                    <div className="w-full lg:w-3/4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
                            {steps.map((step, index) => (
                                <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-3 md:p-6 flex items-center md:flex-col md:items-start gap-3 md:gap-4 hover:bg-white/20 transition-all duration-300">
                                    <div className="bg-[#FAD502] p-2 md:p-3 rounded-full shadow-lg shrink-0 text-[#930B31]">
                                        {step.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base md:text-xl font-bold text-white mb-0.5 md:mb-2 truncate">
                                            {step.defaultTitle}
                                        </h3>
                                        <div className="text-white/90 text-xs md:text-sm leading-tight md:leading-relaxed">
                                            {step.defaultDesc}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Work;
