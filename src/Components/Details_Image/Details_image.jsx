
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

  // Build images array with proper URLs and alt texts
  const images = [];
  
  if (data) {
    // Use responsive images based on screen size
    const imageFields = [
      {
        large: data.carousel_one_large,
        small: data.carousel_one_small,
        alt: isLargeScreen 
          ? (data.carousel_one_large_alt || data.title || 'Image 1')
          : (data.carousel_one_small_alt || data.title || 'Image 1')
      },
      {
        large: data.carousel_two_large,
        small: data.carousel_two_small,
        alt: isLargeScreen 
          ? (data.carousel_two_large_alt || data.title || 'Image 2')
          : (data.carousel_two_small_alt || data.title || 'Image 2')
      },
      {
        large: data.carousel_three_large,
        small: data.carousel_three_small,
        alt: isLargeScreen 
          ? (data.carousel_three_large_alt || data.title || 'Image 3')
          : (data.carousel_three_small_alt || data.title || 'Image 3')
      },
      {
        large: data.carousel_four_large,
        small: data.carousel_four_small,
        alt: isLargeScreen 
          ? (data.carousel_four_large_alt || data.title || 'Image 4')
          : (data.carousel_four_small_alt || data.title || 'Image 4')
      }
    ];

    imageFields.forEach((field, index) => {
      const imagePath = isLargeScreen ? field.large : field.small;
      if (imagePath) {
        images.push({
          src: baseUrlHashless + imagePath,
          alt: field.alt
        });
      }
    });
  } else {
    // Fallback to legacy img1, img2, img3, img4 props
    const legacyImages = [
      { src: img1, alt: 'Image 1' },
      { src: img2, alt: 'Image 2' },
      { src: img3, alt: 'Image 3' },
      { src: img4, alt: 'Image 4' }
    ];

    legacyImages.forEach(img => {
      if (img.src) {
        images.push(img);
      }
    });
  }

  return (
    <div className="relative">
      {/* Carousel */}
      <ImageCarousel images={images} />
    </div>
  );
};

export default DetailsImage;
