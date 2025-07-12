
import ImageCarousel from "./ImageCarousel ";
import { useState, useEffect } from "react";

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
    isLargeScreen ? data.carousel_one_large : data.carousel_one_small,
    isLargeScreen ? data.carousel_two_large : data.carousel_two_small,
    isLargeScreen ? data.carousel_three_large : data.carousel_three_small,
    isLargeScreen ? data.carousel_four_large : data.carousel_four_small,
  ].filter(Boolean) : [img1, img2, img3, img4].filter(Boolean);
 

  return (
    <div className="relative">
      {/* Carousel */}
      <ImageCarousel images={images} />

  

    </div>
  );
};

export default DetailsImage;
