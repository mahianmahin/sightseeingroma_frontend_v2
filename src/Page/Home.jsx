import Banner from '../Components/Banner/Banner';
import Contact from '../Components/Contact/Contact';
import Hero from '../Components/Hero/Hero';
import HeroBottom from '../Components/Hero/HeroBottom';
import TicketTypeSearch from '../Components/Hero/TicketTypeSearch';
import Work from '../Components/How-Its-Work/Work';
import Services from '../Components/Services/Services';
import HelmetWrapper from "../utilities/HelmetWrapper";

const Home = () => {
    return (
        <>
            <HelmetWrapper title="Explore & Book Hop-On Hop-Off Bus Tickets | Sightseeing Roma" description="Explore Rome at your own pace with flexible hop-on hop-off bus tickets. Book online for 24, 48, or 72-hour tours from top operators and enjoy unforgettable sights." />
            <div>
                <div className="">
                    <Hero></Hero>
                    <div className="block md:hidden">
                        <TicketTypeSearch />
                        <HeroBottom></HeroBottom>
                    </div>
                    <Work></Work>
                    <Services></Services>
                    <Banner></Banner>
                    <Contact></Contact>
                </div>
            </div>
        </>
    );
};

export default Home;