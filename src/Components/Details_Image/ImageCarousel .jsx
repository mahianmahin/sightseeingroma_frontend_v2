import { useState } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  console.log(images);

  // Return null or placeholder if no images
  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-[400px] md:h-[500px] bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage = images[currentIndex];

  return (
    <div className="relative w-full">
      {/* Carousel Wrapper */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-lg bg-gray-100">
        <img
          src={currentImage.src || currentImage}
          alt={currentImage.alt || `Slide ${currentIndex + 1}`}
          className="block w-full h-full object-cover cursor-pointer transition-all duration-300 hover:scale-105"
          onClick={() => setSelectedImage(currentImage)}
          onError={(e) => {
            console.error('Image failed to load:', currentImage.src || currentImage);
            e.target.src = '/placeholder-image.jpg'; // Fallback image
          }}
        />
        
        {/* Image overlay with better contrast */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
      </div>

      {/* Navigation Arrows - Only show if more than 1 image */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
            aria-label="Previous image"
          >
            <FaChevronLeft size={16} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
            aria-label="Next image"
          >
            <FaChevronRight size={16} />
          </button>
        </>
      )}

      {/* Indicators - Only show if more than 1 image */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? "bg-white shadow-lg scale-110" 
                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Enlarged Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50 p-4">
          <div className="relative max-w-[95vw] max-h-[95vh]">
            <img
              src={selectedImage.src || selectedImage}
              alt={selectedImage.alt || "Enlarged view"}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
              onClick={() => setSelectedImage(null)}
              aria-label="Close enlarged view"
            >
              <FaTimes size={20} />
            </button>
            
            {/* Image details overlay */}
            {selectedImage.alt && (
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
                <p className="text-sm">{selectedImage.alt}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
