
import ImageCarousel from "./ImageCarousel ";


const DetailsImage = ({ img1, img2, img3, img4 }) => {
  const images = [img1, img2, img3, img4];
 

  return (
    <div className="relative">
      {/* Carousel */}
      <ImageCarousel images={images} />

  

    </div>
  );
};

export default DetailsImage;
