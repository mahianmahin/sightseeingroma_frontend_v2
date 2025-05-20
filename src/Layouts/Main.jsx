import { Outlet } from "react-router-dom";
import Footer from "../Components/Footer/Footer";
import MetaTags from "../Components/MetaTags/MetaTags";
import Navbar from "../Components/Navbar/Navbar";

const Main = () => {
    return (
        <div>
            <MetaTags 
                title="Sightseeing Roma"
                description="Discover Rome with Sightseeing Roma - Your trusted partner for Rome tours and tickets"
            />
            <div>
                <Navbar></Navbar>
            </div>
            <div>
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default Main;