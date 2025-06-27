import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useResetPassword } from "./ResetPasswordContext";

const ResetSuccess = () => {
  const { resetCompleted, navigate } = useResetPassword();

  useEffect(() => {
    if (!resetCompleted) {
      navigate("/forgot-password");
    }
  }, [resetCompleted, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8"
      style={{
        background: "linear-gradient(135deg, #7F001D, #FFD600, #7F001D, #FFD600)",
        backgroundSize: "400% 400%",
        animation: "gradientBG 25s ease-in-out infinite",
      }}
    >
      <style>
        {`
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="https://sightseeingroma.pythonanywhere.com/media/logo/Logo.png"
            alt="Logo"
            className="h-16"
          />
        </div>

        <div className="flex justify-center mb-6">
          <FaCheckCircle className="text-green-500 text-6xl" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Password Reset Successful!
        </h2>
        <p className="text-gray-600 mb-8">
          Your password has been successfully reset. You can now log in with your new password.
        </p>

        <Link
          to="/login"
          className="inline-block w-full bg-[#7F001D] text-white py-3 px-4 rounded-lg font-medium hover:bg-red-900 transition-colors duration-200"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ResetSuccess; 