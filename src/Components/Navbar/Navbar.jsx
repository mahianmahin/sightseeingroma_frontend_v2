import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuHome, LuTicket } from "react-icons/lu";
import { MdOutlineLocationOn } from "react-icons/md";
import { BsInfoCircle } from "react-icons/bs";
import { HiOutlineNewspaper } from "react-icons/hi";
import { TbLogin2, TbLogout2 } from "react-icons/tb";
import { HiOutlineLogout } from "react-icons/hi";
import { FaTicketAlt, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaInfoCircle, FaMapMarkerAlt, FaChevronDown, FaHistory, FaUserCircle } from "react-icons/fa";
import useStaticContent from "../../hooks/useStaticContent";
import logo from "../../assets/Logo.webp";
import EditImageWrapper from "../Edit_Wrapper/EditImageWrapper";
import useEditorCheck from "../../hooks/useEditorCheck";
import useAuthenticate from "../../hooks/seAuthenticate";
import { trackUserActivity, ACTIVITY_TYPES } from '../../utilities/activityTracker';
import { baseUrlHashless } from "../../utilities/Utilities";
import { FiMenu, FiX } from "react-icons/fi";

// Lazy-load EditPanelSheet — it pulls in Monaco + shadcn Button (23+ KiB)
// Only admins use this, no need to load on every page
const EditPanelSheet = lazy(() => import("../EditPanel/EditPanelSheet"));

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false); // State to control EditPanelSheet
    const navigate = useNavigate();
    const dropdownRef = useRef(null);  // Reference to the dropdown menu

    // Hook to check if user is authenticated
    useAuthenticate(setIsLoggedIn);

    // Static content and editor hooks
    const { isEditor } = useEditorCheck();

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
                                aria-label="Open navigation menu"
                                aria-expanded={isOpen}
                                onClick={() => setIsOpen(!isOpen)} // Toggle Dropdown
                                className="btn btn-ghost lg:hidden hover:bg-white/10 transition-colors duration-200"
                            >
                                {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                            </div>

                            <Link to={"/"}>
                                
                                <div className="w-full flex justify-center items-center">
                                    <img src={logo} alt="Sightseeing Roma - Rome tour booking" width="160" height="85" className="w-24 h-auto sm:w-28 md:w-32 lg:w-36 xl:w-40 min-w-16 max-w-xs"/>
                                </div>

                                
                            </Link>
                        </div>

                        {isOpen && (
                            <ul
                                tabIndex={0}
                                aria-label="Navigation menu"
                                className="menu menu-sm dropdown-content space-y-2 bg-white text-black text-lg rounded-xl z-[1] mt-3 w-64 p-4 shadow-xl border border-gray-100"
                            >
                                {/* Home link for both logged in and out */}
                                <li onClick={() => handleMenuClick("/")}>
                                    <a role="button" tabIndex={0} className="text-base font-semibold pt-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors duration-200">
                                        <LuHome className="text-blue-600" /> Home
                                    </a>
                                </li>

                                {/* Conditional menu items based on login status */}
                                {isLoggedIn ? (
                                    <>
                                        <li onClick={() => handleMenuClick("/yourticket")}>
                                            <a role="button" tabIndex={0} className="text-base font-semibold hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors duration-200">
                                                <FaHistory className="text-green-600" /> Purchase History
                                            </a>
                                        </li>
                                        <li onClick={() => handleMenuClick("/agentPoints")}>
                                            <a role="button" tabIndex={0} className="text-base font-semibold hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors duration-200">
                                                <MdOutlineLocationOn className="text-orange-600" /> Agent Points
                                            </a>
                                        </li>
                                        <li onClick={() => handleMenuClick("/profile")}>
                                            <a role="button" tabIndex={0} className="text-base font-semibold hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors duration-200">
                                                <FaUser className="text-purple-600" /> Profile
                                            </a>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li onClick={() => handleMenuClick("/about-us")}>
                                            <a role="button" tabIndex={0} className="text-base font-semibold hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors duration-200">
                                                <BsInfoCircle className="text-blue-600" /> About Us
                                            </a>
                                        </li>
                                        <li onClick={() => handleMenuClick("/agentPoints")}>
                                            <a role="button" tabIndex={0} className="text-base font-semibold hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors duration-200">
                                                <MdOutlineLocationOn className="text-orange-600" /> Agent Points
                                            </a>
                                        </li>
                                    </>
                                )}

                                {/* Blog link - available for all users */}
                                <li onClick={() => handleMenuClick("/blogs")}>
                                    <a role="button" tabIndex={0} className="text-base font-semibold hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors duration-200">
                                        <HiOutlineNewspaper className="text-indigo-600" /> Blog
                                    </a>
                                </li>

                                <hr className="my-2" />
                              
                                {/* Authentication button */}
                                {isLoggedIn ? (
                                    <li onClick={logout}>
                                        <a role="button" tabIndex={0} className="text-base font-semibold hover:bg-red-50 text-red-600 rounded-lg px-3 py-2 transition-colors duration-200">
                                            <TbLogout2 className="text-red-600" /> Log Out
                                        </a>
                                    </li>
                                ) : (
                                    <li onClick={() => handleMenuClick("/login")}>
                                        <a role="button" tabIndex={0} className="text-base font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg px-3 py-2 transition-colors duration-200">
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
                            <img src={logo} alt="Sightseeing Roma - Rome tour booking" width="160" height="85" className="w-16 md:w-36 pl-0 md:pl-5"/>
                        </Link>
                    </div>

                    {/* Navbar for large screens */}
                    <div className="navbar-end flex items-center lg:flex lg:w-full">
                        <ul className="menu menu-horizontal px-1 font-medium text-lg text-white hidden lg:flex items-center space-x-2" aria-label="Main navigation">
                            {/* Home link for both logged in and out */}
                            <li onClick={() => handleMenuClick("/")}>
                                <a role="button" tabIndex={0} className="hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-200 flex items-center gap-2">
                                    <LuHome className="text-lg" /> Home
                                </a>
                            </li>

                            {/* Conditional menu items based on login status */}
                            {isLoggedIn ? (
                                <>
                                    <li onClick={() => handleMenuClick("/yourticket")}>
                                        <a role="button" tabIndex={0} className="hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-200 flex items-center gap-2">
                                            <FaHistory className="text-lg" /> Purchase History
                                        </a>
                                    </li>
                                    <li onClick={() => handleMenuClick("/agentPoints")}>
                                        <a role="button" tabIndex={0} className="hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-200 flex items-center gap-2">
                                            <MdOutlineLocationOn className="text-lg" /> Agent Points
                                        </a>
                                    </li>
                                    <li onClick={() => handleMenuClick("/profile")}>
                                        <a role="button" tabIndex={0} className="hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-200 flex items-center gap-2">
                                            <FaUser className="text-lg" /> Profile
                                        </a>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li onClick={() => handleMenuClick("/about-us")}>
                                        <a role="button" tabIndex={0} className="hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-200 flex items-center gap-2">
                                            <BsInfoCircle className="text-lg" /> About Us
                                        </a>
                                    </li>
                                    <li onClick={() => handleMenuClick("/agentPoints")}>
                                        <a role="button" tabIndex={0} className="hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-200 flex items-center gap-2">
                                            <MdOutlineLocationOn className="text-lg" /> Agent Points
                                        </a>
                                    </li>
                                </>
                            )}

                            {/* Blog link - available for all users */}
                            <li onClick={() => handleMenuClick("/blogs")}>
                                <a role="button" tabIndex={0} className="hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-200 flex items-center gap-2">
                                    <HiOutlineNewspaper className="text-lg" /> Blog
                                </a>
                            </li>

                            {/* Buy Tickets Button */}
                            <li className="ml-4">
                                <button className="font-bold bg-1 hover:bg-yellow-600 rounded-lg px-4 py-3 transition-colors duration-200">
                                    <Link to={"/company-packages/big-bus"} className="flex items-center gap-2 hover:text-inherit">
                                        <LuTicket className="text-xl" />
                                        Buy Tickets
                                    </Link>
                                </button>
                            </li>

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
                                <li>
                                    <button
                                        onClick={() => handleMenuClick("/login")}
                                        className="btn btn-ghost text-white hover:bg-blue-500/20 hover:text-blue-200 rounded-lg px-4 py-2 transition-all duration-200 flex items-center gap-2"
                                    >
                                        <TbLogin2 size={20} />
                                        Login
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="flex items-center space-x-3 lg:hidden">
                    {/* Buy Tickets Button - Mobile (Icon Only) */}
                    <button aria-label="Buy tickets" className="font-bold bg-1 hover:bg-yellow-600 rounded-lg p-2.5 transition-colors duration-200">
                        <Link to={"/compare-tickets"} className="flex items-center hover:text-inherit">
                            <LuTicket size={18} />
                        </Link>
                    </button>

                    {isLoggedIn && (
                        <>
                            <Link to={"/profile"} aria-label="View profile" className="text-white hover:text-gray-300 transition-colors duration-200">
                                <FaUser size={18} />
                            </Link>
                            <button
                                onClick={logout}
                                aria-label="Log out"
                                className="text-white hover:text-red-300 transition-colors duration-200 p-1"
                            >
                                <HiOutlineLogout size={20} />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Edit Panel - only rendered for admins, lazy-loaded */}
            {isEditPanelOpen && (
              <Suspense fallback={null}>
                <EditPanelSheet
                  isOpen={isEditPanelOpen}
                  onClose={() => setIsEditPanelOpen(false)}
                />
              </Suspense>
            )}
        </div>
    );
};

export default Navbar;
