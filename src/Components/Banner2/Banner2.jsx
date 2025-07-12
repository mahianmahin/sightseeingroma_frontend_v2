import { useState } from 'react';

const Banner2 = ({ bannerImgmd, bannerImgsm, title, description }) => {
    const [overlayOpacity, setOverlayOpacity] = useState(0.7);

    return (
        <div 
            className="relative h-[350px] md:h-[400px] w-full bg-cover bg-center" 
            style={{ 
                backgroundImage: `url(${bannerImgsm})`, 
            }}
        >
            {/* Using Tailwind's responsive classes for media queries */}
            <style>
                {`
                    @media (min-width: 768px) {
                        .bg-md {
                            background-image: url('${bannerImgmd}');
                        }
                    }
                `}
            </style>
            <div className={`h-full w-full bg-cover bg-center bg-md`}>
                {/* Overlay */}
                <div 
                    className="absolute inset-0 bg-black"
                    style={{ opacity: overlayOpacity }}
                ></div>
                {/* Text Content */}
                <div className="relative flex flex-col items-center justify-center h-full text-white text-center pt-7 px-6">
                    <h1 className="text-4xl font-bold">{title}</h1>
                    <p className="text-lg mt-2">{description}</p>
                </div>
            </div>
        </div>
    );
};

export default Banner2;
