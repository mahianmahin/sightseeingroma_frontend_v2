import { LuHome } from "react-icons/lu";
import { PiTicketBold } from "react-icons/pi";
import { MdOutlineLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div>
            <div className="navbar bg-[#930B31] md:bg-[#FAD502E0]  absolute container mx-auto text-white">
                <div className="navbar-start lg:hidden">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content  bg-white text-black rounded-box z-[1] mt-3 w-52 p-2 shadow">
                              <li><a><LuHome /> Home</a></li>
                        <li><a href=""><PiTicketBold /> Manage Bookings</a></li>
                        <li><a><MdOutlineLocationOn /> Agent Point</a></li>
                        </ul>
                    </div>
                </div>

                <div className="navbar-center">
                    <img src="https://iili.io/2TmGVUb.png" alt="Logo" className="w-16 md:w-28 pl-0 md:pl-5" />
                </div>

                <div className="navbar-end flex items-center space-x-4 lg:flex  md:w-full">
                    <ul className="menu menu-horizontal px-1 font-medium text-lg text-black hidden lg:flex">
                       <Link to={"/loveRome"}> <li><a><LuHome /> Home</a></li></Link>
                        <li><a href=""><PiTicketBold /> Manage Bookings</a></li>
                        <li><a><MdOutlineLocationOn /> Agent Point</a></li>
                    </ul>
                    <button className="md:bg-[#930B31] bg-[#FAD502E0]  px-2 md:px-4 py-2 h-10 md:h-12 w-20 md:w-28 rounded-md md:text-white text-[#930B31] text-lg font-medium">
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
