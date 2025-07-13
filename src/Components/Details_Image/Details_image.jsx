
import ImageCarousel from "./ImageCarousel ";
import { useState, useEffect } from "react";
import { baseUrlHashless } from "../../utilities/Utilities";

const DetailsImage = ({ img1, img2, img3, img4, data }) => {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // If data object is provided, use responsive images based on screen size
  const images = data ? [
    isLargeScreen ? baseUrlHashless+data.carousel_one_large : baseUrlHashless+data.carousel_one_small,
    isLargeScreen ? baseUrlHashless+data.carousel_two_large : baseUrlHashless+data.carousel_two_small,
    isLargeScreen ? baseUrlHashless+data.carousel_three_large : baseUrlHashless+data.carousel_three_small,
    isLargeScreen ? baseUrlHashless+data.carousel_four_large : baseUrlHashless+data.carousel_four_small,
  ].filter(Boolean) : [img1, img2, img3, img4].filter(Boolean);
 

  return (
    <div className="relative">
      {/* Carousel */}
      <ImageCarousel images={images} />
    </div>
  );
};

export default DetailsImage;
