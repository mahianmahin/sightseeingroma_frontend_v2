import { useEffect, useState } from "react";
import HeroBottom from "./HeroBottom";

import { baseMediaUrl, baseUrl } from "../../utilities/Utilities";
import Ticket from "./Ticket";

const Hero = () => {
  const [heroImage, setHeroImage] = useState("");

  useEffect(() => {
    fetch(baseUrl + "hero_image/")
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
        className="w-full  relative h-[50vh] lg:h-[80vh] bg-no-repeat bg-cover bg-center py-8"
        style={{
          backgroundImage: heroImage ? `url('${heroImage}')` : "none",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>

        {/* Text Content */}
        <div className="text-white px-6 sm:px-5 md:px-16 h-full flex flex-col justify-center text-center md:text-start relative z-20">
          <div className="mt-20">
            <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-5xl font-semibold mb-3 md:mb-4 leading-tight">
              Experience the City Tour <br className="hidden md:block" /> - Your Ticket to Freedom{" "}
              <br className="hidden lg:block" /> & Adventure
            </h1>
            <h5 className="text-sm md:text-xl  leading-relaxed">
              Enjoy unlimited stops and start exploring the city's top{" "}
              <br className="hidden md:block" /> sights at your own pace
            </h5>
          </div>
          <div className="hidden md:block">
            <div className="flex justify-center items-center w-auto ">
           <Ticket></Ticket>
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
