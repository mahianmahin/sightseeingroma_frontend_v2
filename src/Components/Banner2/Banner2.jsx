const Banner2 = ({ bannerImg, title, description }) => {
    return (
        <div 
            className="h-[350px] md:h-[400px] w-full bg-cover bg-center" 
            style={{ backgroundImage: `url(${bannerImg})` }}
        >
            {/* Overlay */}
            <div className="absolute inset-0"></div>
            {/* Text Content */}
            <div className="relative flex flex-col items-center justify-center h-full text-white text-center pt-7 px-6">
                <h1 className="text-4xl font-bold">{title}</h1>
                <p className="text-lg mt-2">{description}</p>
            </div>
        </div>
    );
};

export default Banner2;
