import { useEffect, useState } from "react";
import HeroBottom from "./HeroBottom";

import { baseMediaUrl, baseUrl } from "../../utilities/Utilities";
import TicketTypeSearch from "./TicketTypeSearch";
import EditWrapper from "../Edit_Wrapper/EditWrapper";
import renderContent from "../../utilities/renderContent.jsx";

const Hero = (props) => {
  const [heroImage, setHeroImage] = useState("");

  useEffect(() => {
    fetch(baseUrl + "hero-image/")
      .then((response) => response.json())
      .then((data) => {
        if (data?.data?.hero_image?.length > 0) {
          const relativePath = data.data.hero_image[0].fields.image;
          setHeroImage(`${baseMediaUrl}${relativePath}`);
        }
      })
      .catch((error) => console.error("Error fetching hero image:", error));
  }, []);

  return (
    <div>
      <div
        className="w-full  relative h-[50vh] lg:h-[85vh] bg-no-repeat bg-cover bg-center py-8"
        style={{
          backgroundImage: heroImage ? `url('${heroImage}')` : "none",
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

      <div className="hidden md:block">
        <HeroBottom />
      </div>
    </div>
  );
};

export default Hero;
