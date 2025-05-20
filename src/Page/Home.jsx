import Banner from '../Components/Banner/Banner';
import Contact from '../Components/Contact/Contact';
import Hero from '../Components/Hero/Hero';
import HeroBottom from '../Components/Hero/HeroBottom';
import TicketSm from '../Components/Hero/TicketSm';
import Work from '../Components/How-Its-Work/Work';
import MetaTags from "../Components/MetaTags/MetaTags";
import Services from '../Components/Services/Services';

const Home = () => {
    return (
        <>
            <MetaTags 
                title="Sightseeing Roma - Home | Rome Tours & Tickets"
                description="Explore Rome's iconic attractions with Sightseeing Roma. Book your Rome tours, hop-on hop-off bus tickets, and skip-the-line passes for the best experience in the Eternal City."
            />
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
           );
        </>
    );
};

export default Home;