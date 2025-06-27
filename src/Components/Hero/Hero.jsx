import { useEffect, useState } from "react";
import HeroBottom from "./HeroBottom";

import { baseMediaUrl, baseUrl } from "../../utilities/Utilities";
import TicketTypeSearch from "./TicketTypeSearch";

const Hero = () => {
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
            <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-5xl font-semibold mb-2 md:mb-3 leading-tight">
              Experience the City Tour <br className="hidden md:block" /> - Your Ticket to Freedom{" "}
              <br className="hidden lg:block" /> & Adventure
            </h1>
            <h5 className="text-sm md:text-lg leading-relaxed">
              Enjoy unlimited stops and start exploring the city's top{" "}
              <br className="hidden md:block" /> sights at your own pace
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
