import { useState } from "react";
import { FaTimes } from "react-icons/fa";

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full">
      {/* Carousel Wrapper */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-lg">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="block w-full h-full object-cover cursor-pointer"
          onClick={() => setSelectedImage(images[currentIndex])} // Open selected image
        />
      </div>

      {/* Indicators */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      {/* Prev Button */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-2 text-white p-2 rounded-full w-10 "
      >
        ❮
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-2 text-white p-2 rounded-full w-10 "
      >
        ❯
      </button>

      {/* Enlarged Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className="relative">
            <img
              src={selectedImage}
              alt="Enlarged"
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            />
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 bg-2 text-white p-2 rounded-full"
              onClick={() => setSelectedImage(null)}
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
