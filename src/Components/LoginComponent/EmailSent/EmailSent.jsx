
import { Link } from "react-router-dom";
import Navbar from "../../Navbar/Navbar";

const EmailSent = () => {
  return (
    <div className="container mx-auto">

        <div className="block md:hidden">
            <Navbar></Navbar>
        </div>
        <div className="flex flex-col items-center justify-center h-screen bg-white md:bg-gray-50">
      <div className="flex flex-col items-center p-6 py-8 bg-white rounded-lg shadow-md max-w-md px-4">
        {/* Success Icon */}
        <div className="text-green-500 text-5xl mb-4">
         <img src="./Login/sent.png" alt="" />
          
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Email sent
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Please check your inbox to reset your password
        </p>

        {/* Links */}
        <div className="flex flex-col items-center space-y-2">
          <a
            href="#"
            className="text-red-800 hover:underline text-sm font-semibold"
          >
           <Link to={'/newpass'}>
           Check email inbox
           </Link>
          </a>
          <div className=" flex space-x-4 my-6 text-sm">
         <Link to={'/login'} className="font-bold color-1">Log in</Link>
            <span>or</span>
            <Link to={'/registation'} className="font-bold color-1">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default EmailSent;
