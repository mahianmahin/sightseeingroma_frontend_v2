import { useLocation } from "react-router-dom";
import ManageBookingMd from "../Components/ManageBooking/ManageBookingMd";
import ManageBookingSm from "../Components/ManageBooking/ManageBookingSm";



const ManageBooking = () => {
    const location = useLocation();
    const { title , subtitle ,duration , price , price2 ,ticketCount} = location.state || {};

    return (
        <div className="container mx-auto">
            <div className="hidden md:block">
                <ManageBookingMd title={title} subtitle={subtitle} duration={duration} adult_price={price} youth_price={price2} ticket_serial={ticketCount}></ManageBookingMd>
            </div>
            <div className="block md:hidden">
                <ManageBookingSm title={title} subtitle={subtitle} duration={duration} adult_price={price} youth_price={price2} ticket_serial={ticketCount}></ManageBookingSm>
            </div>
        </div>
    );
};

export default ManageBooking;