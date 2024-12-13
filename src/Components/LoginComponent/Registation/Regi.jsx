import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";

const Regi = () => {
    return (
        <div className="flex flex-col md:flex-row container h-screen md:h-full mx-auto relative bg-[url('/Login/logins.png')]   md:bg-[url('/Login/bgmd.png')] bg-cover bg-center">
            {/* Left Image Section */}
            <div className="md:w-1/2 w-full  relative hidden md:block">
                <img
                    src="./Login/regi.png" // Replace with your image URL
                    alt="Bus View"
                    className=" w-full h-screen object-cover"
                />
                <div className="absolute top-4 left-4">
                    <img
                        src="./Login/Logo.png" // Replace with logo URL
                        alt="Logo"
                        className="h-16"
                    />
                </div>
            </div>
            <div className="block md:hidden">
                <div className=" text-center flex justify-center py-10 mb-14">
                    <img
                        src="./Login/Logo.png" // Replace with logo URL
                        alt="Logo"
                        className=""
                    />
                </div>
            </div>
            {/* Right Form Section */}
            <div className="w-full md:w-1/2  flex justify-center items-center px-5">
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-md w-full relative ">
                    {/* Close Button */}
                    <button className="absolute top-2 right-4 text-gray-500 bg-[#F2F2F7] p-2 rounded-full">
                        <RxCross2 size={20} />
                    </button>

                    <h2 className="text-4xl font-bold mb-4 md:text-start">Registration</h2>
                    <p className="text-gray-500 mb-4  r md:text-start">
                        Create an account to book tickets easily
                    </p>
                    <form>
                        <div className="mb-4">
                            <label
                                htmlFor="username"
                                className="block font-bold mb-1"
                            >
                                User name
                            </label>
                            <input
                                type="text"
                                id="username"
                                className="w-full px-4 py-2 border rounded-lg bg-[#F2F2F7] focus:outline-none focus:ring-2 focus:ring-red-900"

                            />
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="email"
                                className="block font-bold mb-1"
                            >
                                Email address
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-2 border rounded-lg bg-[#F2F2F7] focus:outline-none focus:ring-2 focus:ring-red-900"

                            />
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="phone-number"
                                className="block font-bold mb-1"
                            >
                               Phone number
                            </label>
                            <input
                                type="number"
                                id="phone-number"
                                className="w-full px-4 py-2 border rounded-lg bg-[#F2F2F7] focus:outline-none focus:ring-2 focus:ring-red-900"

                            />
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="password"
                                className="block font-bold mb-1"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-4 py-2 border rounded-lg bg-[#F2F2F7] focus:outline-none focus:ring-2 focus:ring-red-900"

                            />
                        </div>
                    
                        <button
                            type="button"
                            className="w-full bg-2 text-white py-2 rounded-full md:rounded-lg hover:bg-red-800 transition"
                        >
                            Create account
                        </button>
                    </form>
                    <p className="font-bold text-center text-sm mt-4">
                    Already a user?{" "}

                        <Link to={'/login'} className="color-1">Login</Link>

                    </p>
                </div>
            </div>
        </div>
    );
};

export default Regi;
