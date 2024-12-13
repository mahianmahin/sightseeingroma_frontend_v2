
import { Link } from "react-router-dom";
import Navbar from "../../Navbar/Navbar";

const Updated = () => {
    return (
        <div className="container mx-auto">

            <div className="block md:hidden">
                <Navbar></Navbar>
            </div>
            <div className="flex flex-col items-center justify-center h-screen bg-white px-3 md:bg-gray-50">
                <div className="flex flex-col items-center p-6 py-8 bg-white rounded-lg shadow-md max-w-md px-8">
                    {/* Success Icon */}
                    <div className="text-green-500 text-5xl mb-4">
                        <img src="./Login/sent.png" alt="" />

                    </div>

                    {/* Message */}
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Password updated !
                    </h1>
                    <p className="text-sm text-gray-600 text-center mb-6">
                        Your password has been updated. Now you can use your new password to continue this account
                    </p>

                    <Link to={'/'} className="w-full">
                        <button
                            type="button"
                            className="w-full bg-2 mt-3 text-white py-2 rounded-full md:rounded-lg hover:bg-red-800 transition"
                        >
                            Back to Home
                        </button>


                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Updated;