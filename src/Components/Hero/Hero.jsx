import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaTripadvisor, FaCircle, FaChevronRight } from "react-icons/fa";
import HeroBottom from "./HeroBottom";

import { baseMediaUrl, baseUrl, baseUrlHashless } from "../../utilities/Utilities";
import EditWrapper from "../Edit_Wrapper/EditWrapper";
import EditImageWrapper from "../Edit_Wrapper/EditImageWrapper";
import renderContent from "../../utilities/renderContent.jsx";

const Hero = (props) => {
  const navigate = useNavigate();
  
  // Get hero image from static content instead of separate API
  const heroImageData = props.getImageByTag ? props.getImageByTag('hero-image') : null;
  const heroImageUrl = heroImageData?.image?.file ? `${baseUrlHashless}${heroImageData.image.file}` : null;

  const handleBuyTickets = () => {
    navigate('/compare-tickets');
  };

  const ServiceBar = () => (
    <div className="bg-[#2E76B7] text-white py-2 px-6 lg:py-3 lg:px-6 rounded-full flex items-center justify-between w-full max-w-md cursor-pointer hover:bg-blue-600 transition shadow-md group">
      <div className="flex items-center gap-3">
        <FaBell className="text-lg animate-pulse" />
        <span className="font-semibold text-sm md:text-base">
          <EditWrapper isEditor={props.isEditor} contentTag="hero-service-text" refreshContent={props.refreshContent}>
            {renderContent('hero-service-text', props.hasContent, props.getContentByTag, 'Loading...')}
          </EditWrapper>
        </span>
      </div>
      <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
    </div>
  );

  const TripAdvisorWidget = ({ className = "" }) => (
    <div className={`flex items-center gap-3 text-sm font-medium ${className}`}>
      <FaTripadvisor className="text-3xl" />
      <div className="flex gap-1 text-[#00aa6c]">
        <FaCircle /> <FaCircle /> <FaCircle /> <FaCircle /> <FaCircle className="text-current opacity-50" />
      </div>
      <span className="opacity-90">Based on 713 reviews</span>
    </div>
  );

  return (
    <div className="w-full">
      {/* Main Hero Section - Red Background */}
      <div className="bg-[#930B31] w-full relative overflow-hidden">
        <div className="container mx-auto px-4 pt-32 pb-48 lg:pt-40 lg:pb-20">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            
            {/* Left Column (Text Content) */}
            <div className="w-full lg:w-1/2 text-center lg:text-left text-white z-10">
              
              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <EditWrapper isEditor={props.isEditor} contentTag={"hero-big-title"} refreshContent={props.refreshContent}>
                  {renderContent('hero-big-title', props.hasContent, props.getContentByTag, 'Rome Bus Tours')}
                </EditWrapper>
              </h1>

              {/* Subtitle */}
              <div className="text-lg lg:text-xl mb-8 font-medium leading-relaxed opacity-95">
                <EditWrapper isEditor={props.isEditor} contentTag={"hero-subtitle"} refreshContent={props.refreshContent}>
                  {renderContent('hero-subtitle', props.hasContent, props.getContentByTag, "See the Eternal City's legendary landmarks on our Hop-on, Hop-off Rome Big Bus Tour!")}
                </EditWrapper>
              </div>

              {/* Button & Price Group */}
              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start mb-8 lg:mb-12">
                <button 
                  onClick={handleBuyTickets}
                  className="bg-[#FAD502] text-[#930B31] font-bold py-3 px-5 lg:py-4 lg:px-8 rounded-lg text-l lg:text-lg hover:bg-yellow-400 transition shadow-lg uppercase tracking-wide transform hover:scale-105 duration-200"
                >
                  BUY TICKETS
                </button>
                
                <div className="text-[#FAD502] font-bold text-xl">
                  <EditWrapper isEditor={props.isEditor} contentTag="hero-price-text" refreshContent={props.refreshContent}>
                    {renderContent('hero-price-text', props.hasContent, props.getContentByTag, 'Loading...')}
                  </EditWrapper>
                </div>
              </div>

              {/* Desktop Widgets */}
              <div className="hidden lg:flex flex-col gap-6 items-start">
                <ServiceBar />
                <div className="text-white mt-2">
                  <TripAdvisorWidget />
                </div>
              </div>
            </div>

            {/* Right Column (Desktop Image) */}
            <div className="hidden lg:block w-1/2 pl-8 relative z-10">
              <div className="w-[70%] mx-auto">
                <EditImageWrapper
                  isEditor={props.isEditor}
                  uniqueTag="hero-image"
                  refreshContent={props.refreshContent}
                  className="w-full"
                >
                  <img 
                    src={heroImageUrl || "https://placehold.co/600x400/black/yellow?text=BIG+DEAL"} 
                    alt="Hero Promotion" 
                    className="w-full h-auto rounded-xl shadow-2xl transform rotate-2 hover:rotate-0 transition duration-500 object-cover"
                  />
                </EditImageWrapper>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Section - Cream Background */}
      <div className="lg:hidden bg-[#fef7ff] px-4 pb-12">
        <div className="flex flex-col items-center gap-8">
          
          {/* Mobile Image */}
          <div className="w-[75%] max-w-sm shadow-xl rounded-xl overflow-hidden -mt-52 relative z-20">
            <EditImageWrapper
              isEditor={props.isEditor}
              uniqueTag="hero-image"
              refreshContent={props.refreshContent}
              className="w-full"
            >
              <img 
                src={heroImageUrl || "https://placehold.co/600x400/black/yellow?text=BIG+DEAL"} 
                alt="Hero Promotion" 
                className="w-full h-auto object-cover"
              />
            </EditImageWrapper>
          </div>

          {/* Mobile Widgets */}
          <div className="text-gray-800">
            <TripAdvisorWidget />
          </div>
          
          <div className="w-full max-w-md">
            <ServiceBar />
          </div>
        </div>
      </div>

      {/* <div className="hidden md:block">
        <HeroBottom />
      </div> */}
    </div>
  );
};

export default Hero;
