import { useState } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

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
      {/* Mobile: Red background with smaller centered image */}
      {/* Desktop: Full size image with gray background */}
      <div className="relative h-[140px] md:h-[500px] overflow-hidden bg-[#930B31] md:bg-gray-100 flex items-center justify-center">
        <img
          src={currentImage.src || currentImage}
          alt={currentImage.alt || `Slide ${currentIndex + 1}`}
          className="block h-[120px] w-[200px] md:w-full md:h-full object-cover cursor-pointer transition-all duration-300 hover:scale-105 rounded-lg md:rounded-none"
          onClick={() => setSelectedImage(currentImage)}
          onError={(e) => {
            console.error('Image failed to load:', currentImage.src || currentImage);
            e.target.src = '/placeholder-image.jpg'; // Fallback image
          }}
        />
        
        {/* Image overlay with better contrast - only on desktop */}
        <div className="hidden md:block absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
      </div>

      {/* Navigation Arrows - Only show if more than 1 image */}
      {images.length > 1 && (
        <>
          {/* Mobile: White arrows on both sides of small image */}
          {/* Desktop: Black semi-transparent arrows inside image */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 bg-white md:bg-black md:bg-opacity-50 text-[#930B31] md:text-white hover:bg-gray-100 md:hover:bg-opacity-75 p-2 md:p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
            aria-label="Previous image"
          >
            <FaChevronLeft size={16} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 bg-white md:bg-black md:bg-opacity-50 text-[#930B31] md:text-white hover:bg-gray-100 md:hover:bg-opacity-75 p-2 md:p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
            aria-label="Next image"
          >
            <FaChevronRight size={16} />
          </button>
        </>
      )}

      {/* Indicators - Only show if more than 1 image */}
      {/* {images.length > 1 && (
        <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? "bg-white shadow-lg scale-110" 
                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )} */}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-black bg-opacity-50 text-white px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm">
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
