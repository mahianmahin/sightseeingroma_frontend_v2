import { Helmet } from "react-helmet-async";
import { Outlet } from "react-router-dom";
import Footer from "../Components/Footer/Footer";
import Navbar from "../Components/Navbar/Navbar";

const Main = () => {
    return (
        <div>
            <Helmet>
                <title>Sightseeing Roma</title>
                <meta name="description" content="Discover Rome with Sightseeing Roma - Your trusted partner for Rome tours and tickets" />
            </Helmet>
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