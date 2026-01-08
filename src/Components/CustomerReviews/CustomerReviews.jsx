import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { baseUrlHashless } from '../../utilities/Utilities';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CustomerReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef(null);
    
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`${baseUrlHashless}/reviews/`);
                setReviews(response.data);
            } catch (error) {
                console.error("Error fetching reviews", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const scroll = (direction) => {
        const container = scrollContainerRef.current;
        if (container) {
            const cardWidth = container.firstChild.offsetWidth; 
            const gap = 24; // Equivalent to gap-6 (1.5rem = 24px)
            const scrollAmount = cardWidth + gap;
            
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (loading || reviews.length === 0) return null;

    return (
        <section className="py-16 md:py-24 bg-[#F9FAFB]">
            <div className="container mx-auto px-4 relative">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 mb-4 max-w-3xl mx-auto leading-tight">
                        Don’t take our word for it — listen to what our customers have to say about us
                    </h2>
                    <p className="text-gray-500 font-medium tracking-wide text-sm md:text-base">
                        Real travelers. Real experiences. Trusted worldwide.
                    </p>
                </div>

                {/* Left Arrow Button */}
                <button 
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg text-gray-600 hover:text-[#930B31] hover:bg-gray-50 transition-all hidden md:block focus:outline-none -ml-4 lg:-ml-12"
                    aria-label="Previous review"
                >
                    <FaChevronLeft size={24} />
                </button>

                {/* Reviews Container */}
                <div 
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-6 md:gap-8 pb-8 md:pb-0 px-2 md:px-0 snap-x snap-mandatory scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {reviews.map((review) => (
                        <div key={review.id} className="min-w-[85vw] md:min-w-[calc(33.333%-1.33rem)] snap-start flex flex-col bg-white rounded-xl shadow-lg shadow-gray-100 hover:shadow-xl transition-shadow duration-300 p-6 md:p-8 h-auto border border-gray-100">
                           <div className="mb-6 h-48 md:h-56 overflow-hidden rounded-lg bg-gray-100 relative group flex-shrink-0">
                                <img 
                                    src={review.image && review.image.startsWith('http') ? review.image : `${baseUrlHashless}${review.image}`} 
                                    alt={`${review.name} - ${review.country}`}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        e.target.onerror = null; 
                                        e.target.parentElement.style.display = 'none';
                                    }} 
                                />
                            </div>
                            
                            <div className="flex-grow flex flex-col">
                                <FaQuoteLeft className="text-gray-300 text-2xl mb-4 flex-shrink-0" />
                                <blockquote className="text-gray-600 italic font-light leading-relaxed mb-6 text-base md:text-lg flex-grow">
                                    "{review.review_text}"
                                </blockquote>
                            </div>
                            
                            <div className="mt-auto border-t border-gray-50 pt-4 flex-shrink-0">
                                <p className="font-bold text-gray-800 text-lg">
                                    {review.name} <span className="text-gray-500 font-medium">— {review.country}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Arrow Button */}
                <button 
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg text-gray-600 hover:text-[#930B31] hover:bg-gray-50 transition-all hidden md:block focus:outline-none -mr-4 lg:-mr-12"
                    aria-label="Next review"
                >
                    <FaChevronRight size={24} />
                </button>
            </div>
        </section>
    );
};

export default CustomerReviews;
