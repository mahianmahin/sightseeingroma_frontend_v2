import { useState } from 'react';

const Banner2 = ({ bannerImgmd, bannerImgsm, children, opacity }) => {
    const [overlayOpacity, setOverlayOpacity] = useState(opacity || 0.2);

    return (
        <div className="relative h-[350px] md:h-[400px] w-full overflow-hidden">
            {/* Background Image for Mobile */}
            <div 
                className="absolute inset-0 bg-cover bg-center md:hidden"
                style={{ 
                    backgroundImage: `url(${bannerImgsm})`, 
                }}
            ></div>
            
            {/* Background Image for Desktop */}
            <div 
                className="absolute inset-0 bg-cover bg-center hidden md:block"
                style={{ 
                    backgroundImage: `url(${bannerImgmd})`, 
                }}
            ></div>

            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black"
                style={{ opacity: overlayOpacity, zIndex: 1 }}
            ></div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center pt-7 px-6" style={{ zIndex: 2 }}>
                {children}
            </div>
        </div>
    );
};

export default Banner2;
