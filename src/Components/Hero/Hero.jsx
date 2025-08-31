import { useEffect, useState } from "react";
import HeroBottom from "./HeroBottom";

import { baseMediaUrl, baseUrl, baseUrlHashless } from "../../utilities/Utilities";
import TicketTypeSearch from "./TicketTypeSearch";
import EditWrapper from "../Edit_Wrapper/EditWrapper";
import EditImageWrapper from "../Edit_Wrapper/EditImageWrapper";
import renderContent from "../../utilities/renderContent.jsx";

const Hero = (props) => {
  // Get hero image from static content instead of separate API
  const heroImageData = props.getImageByTag ? props.getImageByTag('hero-image') : null;
  const heroImageUrl = heroImageData?.image?.file ? `${baseUrlHashless}${heroImageData.image.file}` : null;

  return (
    <div>
      <EditImageWrapper
        isEditor={props.isEditor}
        uniqueTag="hero-image"
        refreshContent={props.refreshContent}
        className="w-full"
      >
        <div
          className="w-full relative h-[50vh] lg:h-[85vh] bg-no-repeat bg-cover bg-center py-8"
          style={{
            backgroundImage: heroImageUrl ? `url('${heroImageUrl}')` : "none",
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>

          {/* Text Content */}
          <div className="text-white px-6 sm:px-5 md:px-16 h-full flex flex-col justify-center text-center md:text-start relative z-20">
            {/* hero text */}
            
            <div className="mt-16 md:mt-12">
              <EditWrapper isEditor={props.isEditor} contentTag={"hero-big-title"} refreshContent={props.refreshContent}>
                {renderContent('hero-big-title', props.hasContent, props.getContentByTag, 'Discover Amazing Rome')}
              </EditWrapper>

              <h5 className="text-sm md:text-lg leading-relaxed">
                <EditWrapper isEditor={props.isEditor} contentTag={"hero-subtitle"} refreshContent={props.refreshContent}>
                {renderContent('hero-subtitle', props.hasContent, props.getContentByTag, 'Experience the eternal city with our guided tours')}
                </EditWrapper>
              </h5>
            </div>

            {/* search box */}
            <div className="hidden md:block">
              <div className="w-[100%] mx-auto">
                <TicketTypeSearch />
              </div>
            </div>
          </div>
        </div>
      </EditImageWrapper>

      <div className="hidden md:block">
        <HeroBottom />
      </div>
    </div>
  );
};

export default Hero;
