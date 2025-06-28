import { LuHome } from "react-icons/lu";
import { PiTicketBold } from "react-icons/pi";
import { MdOutlineLocationOn } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoDocumentTextOutline } from "react-icons/io5";
import { RiMoneyEuroCircleLine } from "react-icons/ri";
import { BsInfoCircle } from "react-icons/bs";
import { TbLogin2, TbLogout2 } from "react-icons/tb";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import logo from "../../assets/Logo.png";

import { useState, useEffect, useRef } from "react";
import useAuthenticate from "../../hooks/seAuthenticate";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);  // Reference to the dropdown menu

    // Hook to check if user is authenticated
    useAuthenticate(setIsLoggedIn);

    // Logout function
    function logout() {
        window.localStorage.clear();
        window.location.reload();
        navigate('/'); // Redirect to home after logout
    }

    // Close the menu after navigating to the desired route
    const handleMenuClick = (path) => {
        setIsOpen(false);  // Close the dropdown
        navigate(path);    // Navigate to the specified path
    }

    // Close the menu when clicking outside of the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false); // Close the menu if click is outside
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="">
            <div className="navbar bg-2 absolute text-white z-50">
                {/* Navbar for small screens */}
                <div className="navbar-start lg:hidden">
                    <div className="dropdown" ref={dropdownRef}>
                        <div className="flex items-center justify-between">
                            <div
                                tabIndex={0}
                                role="button"
                                onClick={() => setIsOpen(!isOpen)} // Toggle Dropdown
                                className="btn btn-ghost lg:hidden"
                            >
                                <FiMenu size={20} />
                            </div>

                            <Link to={"/"}>
                                
                                <div className="w-full flex justify-center items-center">
                                    <img src={logo} alt="Logo" className="w-24 h-auto sm:w-28 md:w-32 lg:w-36 xl:w-40 min-w-16 max-w-xs"/>
                                </div>

                                
                            </Link>
                        </div>

                        {isOpen && (
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content space-y-4 bg-white text-black text-lg rounded-box z-[1] mt-3 w-52 p-2 shadow"
                            >
                                <li onClick={() => handleMenuClick("/")}>
                                    <a className="text-base font-semibold pt-3">
                                        <LuHome /> Home
                                    </a>
                                </li>

                                <Link to={"/yourticket"}>
                                    <li>
                                        <a className="text-base font-semibold">
                                            <PiTicketBold /> Manage Bookings
                                        </a>
                                    </li>
                                </Link>
                                <li onClick={() => {isLoggedIn ? handleMenuClick("/agentPoints") : handleMenuClick("/login")}}> 
                                    <a className="text-base font-semibold">
                                        <MdOutlineLocationOn /> Agent Points
                                    </a>
                                </li>
                                <hr />
                                <li onClick={() => handleMenuClick("/offer")}>
                                    <a className="text-base font-semibold">
                                        <IoDocumentTextOutline /> Offer
                                    </a>
                                </li>
                                <li onClick={() => handleMenuClick("/yourticket")}>
                                    <a className="text-base font-semibold">
                                        <RiMoneyEuroCircleLine /> Payments
                                    </a>
                                </li>
                              
                                {isLoggedIn ? (
                                    <li onClick={logout}>
                                        <a className="text-base font-semibold">
                                            <TbLogout2 /> Log Out
                                        </a>
                                    </li>
                                ) : (
                                    <li onClick={() => handleMenuClick("/login")}>
                                        <a className="text-base font-semibold">
                                            <TbLogin2 /> Log In
                                        </a>
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="container mx-auto w-full">
                    <div className="md:hidden hidden lg:block">
                        <Link to={"/"}>
                            <img
                                src={logo}
                                alt="Logo"
                                className="w-16 md:w-36 pl-0 md:pl-5"
                            />
                        </Link>
                    </div>

                    {/* Navbar for large screens */}
                    <div className="navbar-end flex items-center lg:flex lg:w-full">
                        <ul className="menu menu-horizontal px-1 font-medium text-lg text-white hidden lg:flex">
                            <li onClick={() => handleMenuClick("/")}>
                                <a>
                                    <LuHome /> Home
                                </a>
                            </li>
                            <li onClick={() => {isLoggedIn ? handleMenuClick("/yourticket") : handleMenuClick("/login")}}>
                                <a>
                                    <PiTicketBold /> Manage Bookings
                                </a>
                            </li>
                            <li onClick={() => handleMenuClick("/agentPoints")}>
                                <a>
                                    <MdOutlineLocationOn /> Agent Points
                                </a>
                            </li>
                            {isLoggedIn && (
                                <li onClick={() => handleMenuClick("/profile")}>
                                    <a>
                                        <FaUser /> Profile
                                    </a>
                                </li>
                            )}

                            {isLoggedIn ? (
                                <button
                                    onClick={logout}
                                    className="btn btn-ghost text-2xl font-medium"
                                >
                                    <HiOutlineLogout size={20} />
                                </button>
                            ) : (
                                <div className="px-4">
                                    <button className="bg-1 px-2 md:px-4 py-2 h-10 md:h-12 w-20 md:w-28 rounded-md color-1 text-lg font-medium">
                                        <Link to={"/login"}>Login</Link>
                                    </button>
                                </div>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="flex items-center space-x-1">
                    {isLoggedIn && (
                        <div className="block md:block lg:hidden">
                            <Link to={"/profile"}>
                                <FaUser />
                            </Link>
                        </div>
                    )}

                    {/* Conditional rendering for Login/Logout button */}
                    {isLoggedIn ? (
                        <div className="block md:block lg:hidden">
                            <button
                                onClick={logout}
                                className="btn btn-ghost text-2xl font-medium"
                            >
                                <HiOutlineLogout size={20} />
                            </button>
                        </div>
                    ) : (
                        <button className="bg-1 block md:block lg:hidden px-2 py-2 h-10 w-16 rounded-md color-1 text-md font-medium">
                            <Link to={"/login"}>Login</Link>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
