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
            <HelmetWrapper title="Sightseeing Roma | Hop-On Hop-Off Panoramic Open Bus Tour Ticket" description="Compare and book hop-on hop-off panoramic open bus tour tickets from top operators. Explore Rome’s top sights at your own pace with flexible passes." />
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