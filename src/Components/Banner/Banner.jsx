const Banner = () => {
    return (
        <div className="relative h-[220px] md:h-[320px]  bg-cover bg-center" style={{ backgroundImage: `url('https://iili.io/2uHlacu.md.png')` }}>
            {/* Overlay for Text Centering */}
            <div className="absolute inset-0  0flex flex-col items-center justify-center  flex text-center p-4">
                <h1 className="text-white text-xl sm:text-3xl lg:text-4xl font-bold mb-2">
                    Flexible Tickets, Iconic Routes, and <br /> Unforgettable Views – All in One Tour
                </h1>
                <p className="text-white text-sm sm:text-lg">
                    The easiest way to explore, with the freedom to hop on and off as you please
                </p>
            </div>
        </div>
    );
};

export default Banner;
