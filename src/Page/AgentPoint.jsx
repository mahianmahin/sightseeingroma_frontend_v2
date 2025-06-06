import HelmetWrapper from '../utilities/HelmetWrapper';
import Banner2 from './../Components/Banner2/Banner2';

const AgentPoint = () => {
    return ( <>
        <HelmetWrapper title="Agent Point—Book Tickets & Get Travel Advice | Sightseeing Roma" description="Visit our Agent Points in Rome to easily book bus tour tickets, receive local travel advice, and access exclusive deals with Sightseeing Roma." />
        <div className="container mx-auto ">
            {/* Banner Section */}
            <Banner2
                bannerImgmd={'/Banner/b4.png'}
                bannerImgsm={'/Banner/b3.png'}
                title={'Agent Point'}
                description={'Easily book tickets, get travel advice, and more with our local agents'}
            />
            
            {/* Content Section */}
            <div className="my-8 py-3 space-y-6 px-6 md:px-10">
                {/* Agent Locations */}
             <div className='md:pr-96'>
             <div>
                    <h1 className="text-xl font-bold ">Our Agent Locations</h1>
                    <p className="mt-4 ">
                        Find our trusted bus service agents conveniently located near you. Whether you're booking your next trip, looking for travel information, or need assistance, our agents are here to help.
                    </p>
                </div>

                {/* Locate an Agent Near You */}
                <div>
                    <h2 className="text-xl font-semibold ">Locate an Agent Near You</h2>
                    <p className="mt-2 ">
                        We have a network of agents across Rome to make your travel planning easier and more accessible. Visit one of our agent locations to:
                    </p>
                    <ul className="list-disc ml-6 mt-4 font-semibold space-y-2 ">
                        <li>Book tickets for any of our partner bus operators</li>
                        <li>Access local travel deals and promotions</li>
                    </ul>
                </div>
             </div>

            </div>

            
                {/* Google Map Embed */}
                <div className="py-4 mb-5 md:mb-10 px-0 md:px-10">
                   
                    <div className="">
                        <iframe
                            title="Sightseeing Agent Locations"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3075.144648368676!2d12.484859015234326!3d41.89546607922006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132f6106e3eb8f4b%3A0xa8e2b22f9bc0ae60!2sPiazza%20d%27Aracoeli%2C%2000186%20Roma%20RM%2C%20Italy!5e0!3m2!1sen!2sus!4v1697048298709!5m2!1sen!2sus"
                            className="w-full h-96"
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
        </div>
        </>);
};

export default AgentPoint;
