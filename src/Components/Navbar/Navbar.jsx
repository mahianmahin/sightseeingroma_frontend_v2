import { LuHome } from "react-icons/lu";
import { PiTicketBold } from "react-icons/pi";
import { MdOutlineLocationOn } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoDocumentTextOutline } from "react-icons/io5";
import { RiMoneyEuroCircleLine } from "react-icons/ri";
import { BsInfoCircle } from "react-icons/bs";
import { TbLogout2 } from "react-icons/tb";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";

import { useState } from "react";
import useAuthenticate from "../../hooks/seAuthenticate";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // Hook to check if user is authenticated
    useAuthenticate(setIsLoggedIn);

    // Logout function
    function logout() {
        window.localStorage.clear();
        window.location.reload();
        navigate('/'); // Redirect to home after logout
    }

    return (
        <div className="">
            <div className="navbar bg-2 absolute   text-white z-50">
                {/* Navbar for small screens */}
                <div className="navbar-start lg:hidden ">
                    <div className="dropdown ">
                        <div className="flex items-center justify-between">
                            <div
                                tabIndex={0}
                                role="button"
                                onClick={() => setIsOpen(!isOpen)} // Toggle Dropdown
                                className="btn btn-ghost lg:hidden"
                            >
                                <FiMenu size={20} />
                            </div>
                            <div className="">
                            </div>
                            <Link to={"/"}>
                                <img
                                    src="https://iili.io/2TmGVUb.png"
                                    alt="Logo"
                                    className="w-16 md:w-28 pl-0 md:pl-5"
                                />
                            </Link>
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
                                <Link to={"/yourticket"}>
                                    <li>
                                        <a className="text-base font-semibold">
                                            <RiMoneyEuroCircleLine /> Payments
                                        </a>
                                    </li>
                                </Link>
                                <Link to={"/paymentsuccess"}>
                                    <li>
                                        <a className="text-base font-semibold">
                                            <BsInfoCircle /> Payment Success
                                        </a>
                                    </li>
                                </Link>
                                {isLoggedIn ? (
                                    <li onClick={logout}>
                                        <a className="text-base font-semibold">
                                            <TbLogout2 /> Log Out
                                        </a>
                                    </li>
                                ) : (
                                    <Link to={"/login"}>
                                        <li>
                                            <a className="text-base font-semibold">
                                                <TbLogout2 /> Log In
                                            </a>
                                        </li>
                                    </Link>
                                )}
                            </ul>
                        )}
                    </div>
                </div>


                <div className="  container mx-auto w-full">
                    <div className=" md:hidden hidden lg:block">
                        <Link to={"/"}>
                            <img
                                src="https://iili.io/2TmGVUb.png"
                                alt="Logo"
                                className="w-16 md:w-28 pl-0 md:pl-5"
                            />
                        </Link>
                    </div>

                    {/* Navbar for large screens */}
                    <div className="navbar-end flex items-center  lg:flex lg:w-full ">
                        <ul className="menu menu-horizontal px-1 font-medium text-lg text-white hidden lg:flex">
                            <Link to={"/"}>
                                <li>
                                    <a>
                                        <LuHome /> Home
                                    </a>
                                </li>
                            </Link>
                            <Link to={"/yourticket"}>
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
                            {
                                isLoggedIn && (
                                    <Link to={"/yourticket"}>
                                        <li>
                                            <a>
                                                <FaUser /> Profile
                                            </a>
                                        </li>
                                    </Link>
                                )
                            }

                            {isLoggedIn ? (

                                <div className="">
                                    <button
                                        onClick={logout}
                                        className="btn btn-ghost text-2xl font-medium "

                                    >

                                        <HiOutlineLogout size={20} />
                                    </button>
                                </div>
                            ) : (
                                <button className="bg-1 px-2 md:px-4 py-2 h-10 md:h-12 w-20 md:w-28 rounded-md color-1 text-lg font-medium">
                                    <Link to={"/login"}>Login</Link>
                                </button>
                            )}
                        </ul>



                    </div>

                </div>

                <div className="flex items-center  space-x-1">
                    {
                        isLoggedIn && (
                            <div className="block md:block lg:hidden">
                                <Link to={"/yourticket"}> <FaUser /></Link>
                            </div>
                        )
                    }
                    {/* Conditional rendering for Login/Logout button */}
                    {isLoggedIn ? (

                        <div className=" block md:block lg:hidden">
                            <button
                                onClick={logout}
                                className="btn btn-ghost text-2xl font-medium "

                            >

                                <HiOutlineLogout size={20} />
                            </button>
                        </div>
                    ) : (
                        <button className="bg-1 block md:block lg:hidden px-2 md:px-4 py-2 h-10 md:h-12 w-20 md:w-28 rounded-md color-1 text-lg font-medium">
                            <Link to={"/login"}>Login</Link>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
