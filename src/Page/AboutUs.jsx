import Banner2 from "../Components/Banner2/Banner2";

const AboutUs = () => {
    return (
        <div className="container mx-auto">
            {/* Banner */}
            <Banner2
                bannerImgmd={'/Banner/b1.png'}
                title={'About Us'}
                description={'Travel Made Simple. Our Journey, Your Adventure'}
                bannerImgsm={'/Banner/b2.png'}
            />

            {/* Content Section */}
            <div className="my-14 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center  md:pl-14  px-5">
                {/* Text Content */}
                <div>
                    <h1 className="font-bold text-2xl md:text-2xl leading-snug">
                        Welcome to SightSeeing Roma!
                    </h1>
                    <p className="text-gray-700 mt-4 text-base md:text-lg leading-relaxed mb-8">
                        At SightSeeing Roma, we believe that every traveller deserves to explore the majestic beauty and rich history of Rome with ease and comfort. Established with a passion for delivering unforgettable experiences, we are your gateway to the heart of this ancient city.
                    </p>

                    <h2 className="font-bold text-xl md:text-2xl leading-snug">Our Commitment to Excellence</h2>
                    <p className="text-gray-700 mt-2 text-base md:text-lg leading-relaxed mb-8">
                        We take immense pride in providing top-notch bus services that cater to the diverse needs of our esteemed customers. Whether you're a history enthusiast, an adventurous soul, or a family seeking memorable moments, SightSeeing Roma has something special for everyone.
                    </p>

                    <h2 className="font-bold text-xl md:text-2xl leading-snug">Convenience at Your Fingertips</h2>
                    <p className="text-gray-700 mt-2 text-base md:text-lg leading-relaxed mb-8">
                        With our user-friendly website and conveniently located outlets, purchasing tickets for your Roman adventure has never been easier. Our seamless online booking system ensures that you can secure your spot with just a few clicks, allowing you to focus on making cherished memories.
                    </p>

                    <h2 className="font-bold text-xl md:text-2xl leading-snug">Explore Rome Your Way</h2>
                    <p className="text-gray-700 mt-2 text-base md:text-lg leading-relaxed mb-8">
                        Embark on a journey of discovery with our meticulously crafted tour packages. From the haunting depths of the Catacombs to the breathtaking vistas of our Panoramic Rome Bus Tour, each experience promises to unveil the city's hidden gems and iconic landmarks.
                    </p>

                    <h2 className="font-bold text-xl md:text-2xl leading-snug">Flexible Options for Every Itinerary</h2>
                    <p className="text-gray-700 mt-2 text-base md:text-lg leading-relaxed mb-8">
                        We understand that every traveler's schedule is unique. That's why we offer flexible packages ranging from 24 hours to 72 hours, allowing you to explore Rome at your own pace. Whether you're here for a quick getaway or an extended stay, SightSeeing Roma has the perfect solution for you.
                    </p>

                    <h2 className="font-bold text-xl md:text-2xl leading-snug">Unparalleled Quality and Affordability</h2>
                    <p className="text-gray-700 mt-2 text-base md:text-lg leading-relaxed mb-8">
                        At SightSeeing Roma, we believe that exceptional service shouldn't come with a hefty price tag. Our commitment to affordability ensures that you can indulge in premium experiences without breaking the bank. With competitive prices and unbeatable value, we make luxury accessible to all.
                    </p>

                    <h2 className="font-bold text-xl md:text-2xl leading-snug">Your Adventure Awaits</h2>
                    <p className="text-gray-700 mt-2 text-base md:text-lg leading-relaxed mb-8">
                        Join us at SightSeeing Roma and embark on an unforgettable journey through the heart of Rome. Let our comfortable buses, knowledgeable guides, and unparalleled service elevate your travel experience to new heights. Book your tickets today and get ready to create memories that will last a lifetime.
                    </p>

                    <p className="font-medium text-base md:text-lg">
                        Thank you for choosing SightSeeing Roma – where every moment is a masterpiece of discovery.
                    </p>
                </div>

                {/* Image Section */}
                <div className="relative">
                    <img
                        src="/Banner/Frame.png"
                        alt="Sightseeing Bus"
                        className="rounded-lg hidden md:block w-full h-auto"
                    />
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
