
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../Navbar/Navbar";
import { FaArrowLeftLong } from "react-icons/fa6";

const ForgotPass = () => {

    const navigate = useNavigate();


    return (
        <div className="container mx-auto">
            <div className="block md:hidden">
                <Navbar />


            </div>


            <div className="flex flex-col md:flex-row  justify-start md:justify-center  container h-screen  mx-auto relative py-28 ">

                <div className="block md:hidden mb-3 px-5  py-5  ">
                    <button onClick={() => navigate('/')}> <FaArrowLeftLong size={20}></FaArrowLeftLong></button>
                </div>

                <div className="w-full md:w-1/2  flex justify-center items-center px-5">
                    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-md w-full relative ">
                        {/* Close Button */}


                        <h2 className="text-4xl font-bold mb-4 md:text-start">Forgot password?</h2>
                        <p className="text-gray-500 mb-4  r md:text-start">
                            Enter your email address to get the reset password link
                        </p>
                        <form>
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


                            <Link to={'/emailsent'}>
                                <button
                                    type="button"
                                    className="w-full bg-2 mt-3 text-white py-2 rounded-full md:rounded-lg hover:bg-red-800 transition"
                                >
                                    Reset Password
                                </button>


                            </Link>
                        </form>
                        <p className="font-bold text-center text-sm mt-4">


                            <Link to={'/login'} className="color-1">Back to login</Link>

                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPass;
