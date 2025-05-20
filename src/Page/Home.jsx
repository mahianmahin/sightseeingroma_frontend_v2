import { Helmet } from "react-helmet-async";
import Banner from '../Components/Banner/Banner';
import Contact from '../Components/Contact/Contact';
import Hero from '../Components/Hero/Hero';
import HeroBottom from '../Components/Hero/HeroBottom';
import TicketSm from '../Components/Hero/TicketSm';
import Work from '../Components/How-Its-Work/Work';
import Services from '../Components/Services/Services';

const Home = () => {
    return (
        <>
            <Helmet>
                <title>Sightseeing Roma - Home | Rome Tours & Tickets</title>
                <meta name="description" content="Explore Rome's iconic attractions with Sightseeing Roma. Book your Rome tours, hop-on hop-off bus tickets, and skip-the-line passes for the best experience in the Eternal City." />
            </Helmet>
            <div>
                <div className="">
                    <Hero></Hero>
                    <div className="block md:hidden">
                        <TicketSm></TicketSm>
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