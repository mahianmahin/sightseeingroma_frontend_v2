



import Work from '../Components/How-Its-Work/Work';
import Services from '../Components/Services/Services';
import Banner from '../Components/Banner/Banner';
import Contact from '../Components/Contact/Contact';
import Hero from '../Components/Hero/Hero';
import HeroBottom from '../Components/Hero/HeroBottom';
import TicketSm from '../Components/Hero/TicketSm';


const Home = () => {
    return (
        <div>
          <div className="container mx-auto">
          
         <Hero></Hero>
           <div className="block md:hidden">
            
             {/* <TicketSm></TicketSm> */}
             <HeroBottom></HeroBottom>
           </div>
     
     
           <Work></Work>
     
           <Services></Services>
           <Banner></Banner>
           <Contact></Contact>
           
     
     
         </div>
        </div>
       );
};

export default Home;