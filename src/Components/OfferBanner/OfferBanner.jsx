const OfferBanner = () => {
    return (
        <div
            className="bg-cover  bg-center bg-[url('./Offer/os.png')] md:bg-[url('./Offer/om.png')] text-white p-6 md:p-10 lg:p-20 flex flex-col md:flex-row items-center md:items-center justify-center"
        >
            {/* Image Section */}
            <div className=" absolute md:w-1/2">
                {/* Medium Device Image */}
                <img
                    src="./Offer/omm.png"
                    alt="Special Offers"
                    className="hidden md:block ml-24 w-40 md:w-56 lg:w-64"
                />
                {/* Small Device Image */}
            
            </div>

            <div className="">
            <img
                    src="./Offer/oss.png"
                    alt="Special Offers"
                    className="block md:hidden w-32 sm:w-40 pt-14"
                />
            </div>

            {/* Text Section */}
            <div className="mt-6 py-0 md:py-28 items-center text-center md:text-left md:pl-10">
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

export default OfferBanner;

