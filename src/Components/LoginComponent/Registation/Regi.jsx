import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../../../utilities/Utilities";

const Regi = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(false);
    setErrorMessage("");
    setLoading(true);

    // Validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      setError(true);
      setLoading(false);
      return;
    }

    if (phoneNumber.length < 10 || !/^\d+$/.test(phoneNumber)) {
      setErrorMessage("Phone number must be at least 10 digits and numeric.");
      setError(true);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords didn't match!");
      setError(true);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${baseUrl}register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          phone_number: phoneNumber,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setLoading(false);

      if (data.error) {
        setErrorMessage(data.error);
        setError(true);
        return;
      }

      if (data.registered === true) {
        navigate("/login/");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setErrorMessage(error.message || "An error occurred. Please try again.");
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col  md:flex-row h-screen md:h-auto relative bg-[url('/Login/logins.png')] md:bg-[url('/Login/bgmd.png')] bg-cover bg-center">
      <div className="md:w-1/2 w-full relative hidden md:block">
        <img
          src="./Login/regi.png"
          alt="Bus View"
          className="w-full   object-cover"
        />
        <div className="absolute top-4 left-4">
          <img src="./Login/Logo.png" alt="Logo" className="h-16" />
        </div>
      </div>
      <div className="text-center block md:hidden flex justify-center py-10 mb-5">
        <img src="./Login/Logo.png" alt="Logo" />
      </div>
      <div className="w-full md:w-1/2 flex justify-center items-center px-5">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-md w-full relative">
          <button
            onClick={() => navigate("/")}
            className="absolute top-2 right-4 text-gray-500 bg-[#F2F2F7] p-2 rounded-full"
            aria-label="Close Registration Form"
          >
            <RxCross2 size={20} />
          </button>
          <h2 className="text-4xl font-bold mb-4 md:text-start">Registration</h2>
          <p className="text-gray-500 mb-4 md:text-start">
            Create an account to book tickets easily
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block font-bold mb-1">
                User name
              </label>
              <input
                type="text"
                id="username"
                className="w-full px-4 py-2 border rounded-lg bg-[#F2F2F7] focus:outline-none focus:ring-2 focus:ring-red-900"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block font-bold mb-1">
                Email address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border rounded-lg bg-[#F2F2F7] focus:outline-none focus:ring-2 focus:ring-red-900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phone-number" className="block font-bold mb-1">
                Phone number
              </label>
              <input
                type="text"
                id="phone-number"
                className="w-full px-4 py-2 border rounded-lg bg-[#F2F2F7] focus:outline-none focus:ring-2 focus:ring-red-900"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block font-bold mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border rounded-lg bg-[#F2F2F7] focus:outline-none focus:ring-2 focus:ring-red-900"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirm-password" className="block font-bold mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                className="w-full px-4 py-2 border rounded-lg bg-[#F2F2F7] focus:outline-none focus:ring-2 focus:ring-red-900"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}
            <button
              type="submit"
              className={`w-full text-white py-2 rounded-full md:rounded-lg transition ${
                loading ? "bg-gray-500" : "bg-red-800 hover:bg-red-900"
              }`}
              disabled={loading}
            >
              {loading ? "Processing..." : "Create Account"}
            </button>
          </form>
          <p className="font-bold text-center text-sm mt-4">
            Already a user?{" "}
            <Link to={"/login"} className="color-1">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Regi;
