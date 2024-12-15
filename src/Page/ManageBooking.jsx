import ManageBookingMd from "../Components/ManageBooking/ManageBookingMd";
import ManageBookingSm from "../Components/ManageBooking/ManageBookingSm";

const ManageBooking = () => {
    return (
        <div className="container mx-auto">
            <div className="hidden md:block">
                <ManageBookingMd></ManageBookingMd>
            </div>
            <div className="block md:hidden">
                <ManageBookingSm></ManageBookingSm>
            </div>
        </div>
    );
};

export default ManageBooking;