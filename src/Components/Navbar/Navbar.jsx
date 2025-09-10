import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuHome } from "react-icons/lu";
import { MdOutlineLocationOn } from "react-icons/md";
import { BsInfoCircle } from "react-icons/bs";
import { TbLogin2, TbLogout2 } from "react-icons/tb";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUser, FaHistory } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "../../assets/Logo.png";
import EditImageWrapper from "../Edit_Wrapper/EditImageWrapper";
import useStaticContent from "../../hooks/useStaticContent";
import useEditorCheck from "../../hooks/useEditorCheck";
import useAuthenticate from "../../hooks/seAuthenticate";
import { trackUserActivity, ACTIVITY_TYPES } from '../../utilities/activityTracker';
import { baseUrlHashless } from "../../utilities/Utilities";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);  // Reference to the dropdown menu

    // Hook to check if user is authenticated
    useAuthenticate(setIsLoggedIn);

    // Static content and editor hooks
    const { isEditor } = useEditorCheck();
    const { getImageByTag, refreshContent } = useStaticContent('navbar');

    // Get navbar logo from static content or fallback to imported logo
    const navbarLogoData = getImageByTag ? getImageByTag('navbar-logo') : null;
    const navbarLogoUrl = navbarLogoData?.image?.file ? `${baseUrlHashless}${navbarLogoData.image.file}` : logo;

    // Logout function
    async function logout() {
        try {
            const email = localStorage.getItem('email'); // If you store user email
            await trackUserActivity(ACTIVITY_TYPES.USER_LOGOUT, { email });
        } catch (error) {
            console.error('Error tracking logout:', error);
        } finally {
            window.localStorage.clear();
            window.location.reload();
            navigate('/');
        }
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
            <div className="navbar bg-2 absolute text-white z-50 backdrop-blur-sm shadow-lg border-b border-white/10">
                {/* Navbar for small screens */}
                <div className="navbar-start lg:hidden">
                    <div className="dropdown" ref={dropdownRef}>
                        <div className="flex items-center justify-between">
                            <div
                                tabIndex={0}
                                role="button"
                                onClick={() => setIsOpen(!isOpen)} // Toggle Dropdown
                                className="btn btn-ghost lg:hidden hover:bg-white/10 transition-colors duration-200"
                            >
                                {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                            </div>

                            <Link to={"/"}>
                                
                                <div className="w-full flex justify-center items-center">
                                    <EditImageWrapper
                                        isEditor={isEditor}
                                        uniqueTag="navbar-logo"
                                        refreshContent={refreshContent}
                                    >
                                        <img src={navbarLogoUrl} alt="Logo" className="w-24 h-auto sm:w-28 md:w-32 lg:w-36 xl:w-40 min-w-16 max-w-xs"/>
                                    </EditImageWrapper>
                                </div>

                                
                            </Link>
                        </div>

                        {isOpen && (
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content space-y-2 bg-white text-black text-lg rounded-xl z-[1] mt-3 w-64 p-4 shadow-xl border border-gray-100"
                            >
                                {/* Home link for both logged in and out */}
                                <li onClick={() => handleMenuClick("/")}>
                                    <a className="text-base font-semibold pt-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors duration-200">
                                        <LuHome className="text-blue-600" /> Home
                                    </a>
                                </li>

                                {/* Conditional menu items based on login status */}
                                {isLoggedIn ? (
                                    <>
                                        <li onClick={() => handleMenuClick("/yourticket")}>
                                            <a className="text-base font-semibold hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors duration-200">
                                                <FaHistory className="text-green-600" /> Purchase History
                                            </a>
                                        </li>
                                        <li onClick={() => handleMenuClick("/agentPoints")}>
                                            <a className="text-base font-semibold hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors duration-200">
                                                <MdOutlineLocationOn className="text-orange-600" /> Agent Points
                                            </a>
                                        </li>
                                        <li onClick={() => handleMenuClick("/profile")}>
                                            <a className="text-base font-semibold hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors duration-200">
                                                <FaUser className="text-purple-600" /> Profile
                                            </a>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li onClick={() => handleMenuClick("/aboutus")}>
                                            <a className="text-base font-semibold hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors duration-200">
                                                <BsInfoCircle className="text-blue-600" /> About Us
                                            </a>
                                        </li>
                                        <li onClick={() => handleMenuClick("/agentPoints")}>
                                            <a className="text-base font-semibold hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors duration-200">
                                                <MdOutlineLocationOn className="text-orange-600" /> Agent Points
                                            </a>
                                        </li>
                                    </>
                                )}

                                <hr className="my-2" />
                              
                                {/* Authentication button */}
                                {isLoggedIn ? (
                                    <li onClick={logout}>
                                        <a className="text-base font-semibold hover:bg-red-50 text-red-600 rounded-lg px-3 py-2 transition-colors duration-200">
                                            <TbLogout2 className="text-red-600" /> Log Out
                                        </a>
                                    </li>
                                ) : (
                                    <li onClick={() => handleMenuClick("/login")}>
                                        <a className="text-base font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg px-3 py-2 transition-colors duration-200">
                                            <TbLogin2 className="text-blue-600" /> Log In
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
                            <EditImageWrapper
                                isEditor={isEditor}
                                uniqueTag="navbar-logo"
                                refreshContent={refreshContent}
                            >
                                <img
                                    src={navbarLogoUrl}
                                    alt="Logo"
                                    className="w-16 md:w-36 pl-0 md:pl-5"
                                />
                            </EditImageWrapper>
                        </Link>
                    </div>

                    {/* Navbar for large screens */}
                    <div className="navbar-end flex items-center lg:flex lg:w-full">
                        <ul className="menu menu-horizontal px-1 font-medium text-lg text-white hidden lg:flex items-center space-x-2">
                            {/* Home link for both logged in and out */}
                            <li onClick={() => handleMenuClick("/")}>
                                <a className="hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-200 flex items-center gap-2">
                                    <LuHome className="text-lg" /> Home
                                </a>
                            </li>

                            {/* Conditional menu items based on login status */}
                            {isLoggedIn ? (
                                <>
                                    <li onClick={() => handleMenuClick("/yourticket")}>
                                        <a className="hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-200 flex items-center gap-2">
                                            <FaHistory className="text-lg" /> Purchase History
                                        </a>
                                    </li>
                                    <li onClick={() => handleMenuClick("/agentPoints")}>
                                        <a className="hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-200 flex items-center gap-2">
                                            <MdOutlineLocationOn className="text-lg" /> Agent Points
                                        </a>
                                    </li>
                                    <li onClick={() => handleMenuClick("/profile")}>
                                        <a className="hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-200 flex items-center gap-2">
                                            <FaUser className="text-lg" /> Profile
                                        </a>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li onClick={() => handleMenuClick("/aboutus")}>
                                        <a className="hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-200 flex items-center gap-2">
                                            <BsInfoCircle className="text-lg" /> About Us
                                        </a>
                                    </li>
                                    <li onClick={() => handleMenuClick("/agentPoints")}>
                                        <a className="hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-200 flex items-center gap-2">
                                            <MdOutlineLocationOn className="text-lg" /> Agent Points
                                        </a>
                                    </li>
                                </>
                            )}

                            {/* Authentication button */}
                            {isLoggedIn ? (
                                <li>
                                    <button
                                        onClick={logout}
                                        className="btn btn-ghost text-white hover:bg-red-500/20 hover:text-red-200 rounded-lg px-4 py-2 transition-all duration-200 flex items-center gap-2"
                                    >
                                        <HiOutlineLogout size={20} />
                                        Logout
                                    </button>
                                </li>
                            ) : (
                                <li className="ml-4">
                                    <button className="font-bold bg-1 hover:bg-yellow-600 rounded-lg px-4 py-3 transition-colors duration-200">
                                        <Link to={"/login"} className="flex items-center gap-2 hover:text-inherit">
                                            <TbLogin2 className="text-xl" />
                                            Login
                                        </Link>
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="flex items-center space-x-3 lg:hidden">
                    {isLoggedIn ? (
                        <>
                            <Link to={"/profile"} className="text-white hover:text-gray-300 transition-colors duration-200">
                                <FaUser size={18} />
                            </Link>
                            <button
                                onClick={logout}
                                className="text-white hover:text-red-300 transition-colors duration-200 p-1"
                            >
                                <HiOutlineLogout size={20} />
                            </button>
                        </>
                    ) : (
                        <button className="font-bold bg-1 hover:bg-yellow-600 rounded-lg px-4 py-3 transition-colors duration-200">
                            <Link to={"/login"} className="flex items-center gap-1 hover:text-inherit">
                                <TbLogin2 size={16} />
                                Login
                            </Link>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
