import { useEffect, useState } from "react";
import HeroBottom from "./HeroBottom";
import Ticket from "./Ticket";
import { baseMediaUrl, baseUrl } from "../../utilities/Utilities";

const Hero = () => {
  const [heroImage, setHeroImage] = useState("");

  useEffect(() => {
    fetch(baseUrl + "hero_image/")
      .then((response) => response.json())
      .then((data) => {
        if (data?.data?.hero_image?.length > 0) {
          setHeroImage(data.data.hero_image[0].fields.image);
        }
      })
      .catch((error) => console.error("Error fetching hero image:", error));
  }, []);

  return (
    <div>
      <div
        className="w-full h-[50vh] lg:h-[80vh] bg-no-repeat bg-cover bg-center py-8"
        style={{
          backgroundImage: heroImage ? `url(${baseMediaUrl + heroImage})` : "none",
        }}
      >
        <div className="text-white px-6 sm:px-5 md:px-16 h-full flex flex-col justify-center text-center md:text-start">
          <div className="mt-20 md:mt-40 mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-3 md:mb-4 leading-tight">
              Experience the City Tour <br className="hidden md:block" /> - Your Ticket to Freedom{" "}
              <br className="hidden lg:block" /> & Adventure
            </h1>
            <h5 className="text-sm md:text-xl lg:text-2xl leading-relaxed">
              Enjoy unlimited stops and start exploring the city's top{" "}
              <br className="hidden md:block" /> sights at your own pace
            </h5>
          </div>
          <div className="hidden md:block mb-10">
            <div className="flex justify-center items-center pt-10">
              <Ticket />
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
