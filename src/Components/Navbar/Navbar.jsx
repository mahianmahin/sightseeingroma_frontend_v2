import { LuHome } from "react-icons/lu";
import { PiTicketBold } from "react-icons/pi";
import { MdOutlineLocationOn } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { IoDocumentTextOutline } from "react-icons/io5";
import { RiMoneyEuroCircleLine } from "react-icons/ri";
import { BsInfoCircle } from "react-icons/bs";
import { TbLogout2 } from "react-icons/tb";
import { useEffect, useState } from "react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Dropdown close when location changes
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    return (
        <div>
            <div className="navbar bg-[#FAD502E0] absolute container mx-auto text-white z-50">
                <div className="navbar-start lg:hidden">
                    <div className="dropdown">
                        <div
                            tabIndex={0}
                            role="button"
                            onClick={() => setIsOpen(!isOpen)} // Toggle Dropdown
                            className="btn btn-ghost lg:hidden"
                        >
                            <img src="./Vector.png" alt="" />
                        </div>
                        {isOpen && (
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content space-y-4 bg-white text-black text-lg rounded-box z-[1] mt-3 w-52 p-2 shadow"
                            >
                                <Link to={"/"}>
                                    <li>
                                        <a className="text-base font-semibold pt-3">
                                            <LuHome /> Home
                                        </a>
                                    </li>
                                </Link>
                                <Link to={"/manageBookings"}>
                                    <li>
                                        <a className="text-base font-semibold">
                                            <PiTicketBold /> Manage Bookings
                                        </a>
                                    </li>
                                </Link>
                                <Link to={"/agentPoints"}>
                                    <li>
                                        <a className="text-base font-semibold">
                                            <MdOutlineLocationOn /> Agent Point
                                        </a>
                                    </li>
                                </Link>
                                <hr />
                                <Link to={"/offer"}>
                                    <li>
                                        <a className="text-base font-semibold">
                                            <IoDocumentTextOutline /> Offer
                                        </a>
                                    </li>
                                </Link>
                                <Link to={"/"}>
                                    <li>
                                        <a className="text-base font-semibold">
                                            <RiMoneyEuroCircleLine /> Payments
                                        </a>
                                    </li>
                                </Link>
                                <Link to={"/manageBookings"}>
                                    <li>
                                        <a className="text-base font-semibold">
                                            <BsInfoCircle /> Settings
                                        </a>
                                    </li>
                                </Link>
                                <Link to={"/login"}>
                                    <li>
                                        <a className="text-base font-semibold">
                                            <TbLogout2 /> Log Out
                                        </a>
                                    </li>
                                </Link>
                            </ul>
                        )}
                    </div>
                </div>

                <div className="navbar-center">
                    <img
                        src="https://iili.io/2TmGVUb.png"
                        alt="Logo"
                        className="w-16 md:w-28 pl-0 md:pl-5"
                    />
                </div>

                <div className="navbar-end flex items-center space-x-4 lg:flex md:w-full">
                    <ul className="menu menu-horizontal px-1 font-medium text-lg text-black hidden lg:flex">
                        <Link to={"/"}>
                            <li>
                                <a>
                                    <LuHome /> Home
                                </a>
                            </li>
                        </Link>
                        <Link to={"/manageBookings"}>
                            <li>
                                <a>
                                    <PiTicketBold /> Manage Bookings
                                </a>
                            </li>
                        </Link>
                        <Link to={"/agentPoints"}>
                            <li>
                                <a>
                                    <MdOutlineLocationOn /> Agent Point
                                </a>
                            </li>
                        </Link>
                    </ul>
                    <button className="bg-[#930B31] px-2 md:px-4 py-2 h-10 md:h-12 w-20 md:w-28 rounded-md text-white text-lg font-medium">
                        <Link to={"/login"}>Login</Link>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
