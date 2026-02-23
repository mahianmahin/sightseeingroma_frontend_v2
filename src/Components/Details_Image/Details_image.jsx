
import ImageCarousel from "./ImageCarousel ";
import { baseUrlHashless } from "../../utilities/Utilities";

const DetailsImage = ({ img1, img2, img3, img4, data }) => {

  // Build images array with both small and large URLs for srcset
  const images = [];
  
  if (data) {
    const imageFields = [
      {
        large: data.carousel_one_large,
        small: data.carousel_one_small,
        altLarge: data.carousel_one_large_alt || data.title || 'Image 1',
        altSmall: data.carousel_one_small_alt || data.title || 'Image 1',
      },
      {
        large: data.carousel_two_large,
        small: data.carousel_two_small,
        altLarge: data.carousel_two_large_alt || data.title || 'Image 2',
        altSmall: data.carousel_two_small_alt || data.title || 'Image 2',
      },
      {
        large: data.carousel_three_large,
        small: data.carousel_three_small,
        altLarge: data.carousel_three_large_alt || data.title || 'Image 3',
        altSmall: data.carousel_three_small_alt || data.title || 'Image 3',
      },
      {
        large: data.carousel_four_large,
        small: data.carousel_four_small,
        altLarge: data.carousel_four_large_alt || data.title || 'Image 4',
        altSmall: data.carousel_four_small_alt || data.title || 'Image 4',
      }
    ];

    imageFields.forEach((field) => {
      if (field.large || field.small) {
        images.push({
          src: baseUrlHashless + (field.large || field.small),
          srcSmall: field.small ? baseUrlHashless + field.small : undefined,
          srcLarge: field.large ? baseUrlHashless + field.large : undefined,
          alt: field.altLarge || field.altSmall,
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
