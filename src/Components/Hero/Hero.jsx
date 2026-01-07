import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaCheckCircle, FaShieldAlt, FaBolt, FaLandmark, FaBus, FaTicketAlt } from "react-icons/fa";
import { baseUrlHashless } from "../../utilities/Utilities";
import EditWrapper from "../Edit_Wrapper/EditWrapper";
import renderContent from "../../utilities/renderContent.jsx";

const Hero = (props) => {
  const navigate = useNavigate();
  const [overlayOpacity, setOverlayOpacity] = useState(0.70);
  
  // Get hero image from static content
  const heroImageData = props.getImageByTag ? props.getImageByTag('hero-image') : null;
  const heroImageUrl = heroImageData?.image?.file ? `${baseUrlHashless}${heroImageData.image.file}` : null;

  const handleBuyTickets = () => {
    const ticketsSection = document.getElementById('tickets');
    if (ticketsSection) {
        ticketsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        navigate('/company-packages/big-bus');
    }
  };

  const handleFeaturedOffer = () => {
      const featuredSection = document.getElementById('featured-today');
      if (featuredSection) {
          featuredSection.scrollIntoView({ behavior: 'smooth' });
      }
  };

  return (
    <div className="w-full relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {heroImageUrl ? (
            <img src={heroImageUrl} alt="Rome Sightseeing" className="w-full h-full object-cover" />
        ) : (
             <div className="w-full h-full bg-gray-900"></div>
        )}
        {/* Dark gradient overlay */}
        <div 
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity }}
        ></div>
      </div>

      <div className="container mx-auto px-4 z-10 py-28 md:py-0">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            
            {/* Left Column (60%) */}
            <div className="w-full lg:w-[60%] text-white text-center lg:text-left">
                
                {/* H1 Heading */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.2] mb-6 drop-shadow-lg">
                    <EditWrapper isEditor={props.isEditor} contentTag={"hero-new-title"} refreshContent={props.refreshContent}>
                        {renderContent('hero-new-title', props.hasContent, props.getContentByTag, 'Book Rome Sightseeing Tickets With Confidence')}
                    </EditWrapper>
                </h1>

                {/* Subheading */}
                <div className="text-base sm:text-lg md:text-xl text-gray-100 mb-8 max-w-2xl mx-auto lg:mx-0 font-medium drop-shadow-md">
                    <EditWrapper isEditor={props.isEditor} contentTag={"hero-new-subtitle"} refreshContent={props.refreshContent}>
                        {renderContent('hero-new-subtitle', props.hasContent, props.getContentByTag, 'Hop-on hop-off buses, Vatican & Colosseum tickets, and top Rome experiences — all from trusted operators.')}
                    </EditWrapper>
                </div>

                {/* Trust Signals */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-3 mb-10 text-sm md:text-base font-medium text-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="flex text-[#FAD502]">
                            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar className="text-[#FAD502]/70" />
                        </div>
                        <span>4.6/5 Traveler Rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaCheckCircle className="text-[#FAD502]" />
                        <span>Verified Operators</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaShieldAlt className="text-[#FAD502]" />
                        <span>Secure Payments</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaBolt className="text-[#FAD502]" />
                        <span>Instant Confirmation</span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                    <button 
                        onClick={handleBuyTickets}
                        className="w-full sm:w-auto bg-[#930B31] hover:bg-[#7a0926] text-white font-bold py-3.5 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg text-base md:text-lg uppercase tracking-wide"
                    >
                        Explore Rome Tickets
                    </button>
                    
                    <div className="relative w-full sm:w-auto group">
                        {/* Pulsing Glow Effect */}
                        <div className="absolute -inset-1 bg-[#FAD502] rounded-lg blur opacity-40 animate-pulse transition duration-1000 group-hover:opacity-70 group-hover:duration-200"></div>
                        <button 
                            onClick={handleFeaturedOffer}
                            className="relative w-full sm:w-auto bg-[#FAD502] text-[#930B31] font-bold py-3.5 px-8 rounded-lg transition-all transform hover:scale-[1.02] text-base md:text-lg shadow-xl flex items-center justify-center gap-2"
                        >
                            <span>Today’s Featured Offer</span>
                            <FaBolt className="animate-bounce" />
                        </button>
                    </div>
                </div>

            </div>

            {/* Right Column (40%) - Visual Trust Card */}
            <div className="w-full lg:w-[40%] flex justify-center lg:justify-end">
                <div className="bg-white text-gray-800 rounded-xl shadow-2xl p-5 md:p-6 max-w-md w-full transform hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
                        <div className="bg-[#FAD502]/20 p-2.5 rounded-full text-[#FAD502] shadow-sm">
                            <FaStar className="text-xl" />
                        </div>
                        <div>
                            <div className="font-bold text-lg text-gray-900">Excellent</div>
                            <div className="text-xs text-gray-600">Trusted by travelers worldwide</div>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 group p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="bg-gray-100 p-2 rounded-lg text-gray-600 group-hover:bg-[#930B31] group-hover:text-white transition-colors duration-300">
                                <FaBus className="text-base" />
                            </div>
                            <span className="font-medium text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Hop-on Hop-off Tours</span>
                        </div>
                        <div className="flex items-center gap-3 group p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="bg-gray-100 p-2 rounded-lg text-gray-600 group-hover:bg-[#930B31] group-hover:text-white transition-colors duration-300">
                                <FaLandmark className="text-base" />
                            </div>
                            <span className="font-medium text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Colosseum & Vatican</span>
                        </div>
                        <div className="flex items-center gap-3 group p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="bg-gray-100 p-2 rounded-lg text-gray-600 group-hover:bg-[#930B31] group-hover:text-white transition-colors duration-300">
                                <FaTicketAlt className="text-base" />
                            </div>
                            <span className="font-medium text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Skip-the-Line Access</span>
                        </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100 text-center">
                        <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-semibold">Official Partner of</p>
                        <div className="flex justify-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
                            <span className="font-bold text-gray-700 text-xs cursor-default">Big Bus</span>
                            <span className="font-bold text-gray-700 text-xs cursor-default">City Sightseeing</span>
                            <span className="font-bold text-gray-700 text-xs cursor-default">I Love Rome</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
