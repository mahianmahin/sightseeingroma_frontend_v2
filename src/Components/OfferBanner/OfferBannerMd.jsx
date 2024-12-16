const OfferBannerMd = () => {
    return (
        <div
            className="bg-cover bg-center bg-[url('./Offer/os.png')] md:bg-[url('./Offer/om.png')] text-white p-6 md:p-10 lg:p-20 flex flex-col md:flex-row items-center justify-center relative"
        >
            {/* Background Image for Medium Screens */}
            <div
                className="absolute top-1/4 hidden md:block w-full h-40 bg-no-repeat bg-left bg-contain"
                style={{ backgroundImage: "url('./Offer/omm.png')", left: 'calc(33.333% - 130px)' }}
            ></div>

            {/* Text Section */}
            <div className="relative z-10 mt-6 py-0 md:py-28 text-center md:text-left md:pl-10">
                <h1 className="text-lg md:text-2xl lg:text-3xl font-semibold">
                    Up to <span className="text-4xl md:text-5xl lg:text-6xl px-2 font-bold">50%</span>{' '}
                    <span className="text-xl md:text-2xl font-semibold">OFF</span>
                </h1>
                <p className="mt-2 text-sm md:text-lg lg:text-xl font-semibold">
                    Unlock Exclusive Travel Deals
                </p>
            </div>
        </div>
    );
};

export default OfferBannerMd;
