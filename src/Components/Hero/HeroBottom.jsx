

const HeroBottom = () => {
    // Partner logos array - you can easily add more logos here
    const partnerLogos = [
        "https://iili.io/2TycEQ9.png",
        "https://iili.io/2Tyloaj.png",
        "https://iili.io/2Tyl7MF.png",
        "https://iili.io/2Tylv94.png",
    ];

    return (
        <div className="bg-[#FAD50266] py-8 md:py-12 overflow-hidden">
            {/* Top Row - Slides Right */}
            <div className="relative mb-0 md:mb-5 mb-5">
                {/* Fade Effect Left */}
                {/* <div className="absolute left-0 top-0 w-16 md:w-32 h-full bg-gradient-to-r from-[#FAD50266] to-transparent z-10"></div> */}

                {/* Fade Effect Right */}
                {/* <div className="absolute right-0 top-0 w-16 md:w-32 h-full bg-gradient-to-l from-[#FAD50266] to-transparent z-10"></div> */}

                {/* Scrolling Container */}
                <div className="flex animate-scroll-right">
                    {/* Multiple sets to fill the entire row seamlessly */}
                    {Array.from({ length: 20 }).map((_, setIndex) =>
                        partnerLogos.map((logo, index) => (
                            <div key={`top-${setIndex}-${index}`} className="flex-shrink-0 mx-10 md:mx-20">
                                <img
                                    src={logo}
                                    className="h-6 md:h-8 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
                                    alt={`Partner ${index + 1}`}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Bottom Row - Slides Left */}
            {/* <div className="relative">

                <div className="flex animate-scroll-left">
                    {Array.from({ length: 20 }).map((_, setIndex) =>
                        partnerLogos.map((logo, index) => (
                            <div key={`bottom-${setIndex}-${index}`} className="flex-shrink-0 mx-10 md:mx-20">
                                <img
                                    src={logo}
                                    className="h-6 md:h-8 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
                                    alt={`Partner ${index + 1}`}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div> */}

        </div>
    );
};

export default HeroBottom;
