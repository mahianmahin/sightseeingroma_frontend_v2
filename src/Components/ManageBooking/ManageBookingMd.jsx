import { useState } from "react";
import { FaRegClock } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";
import Description from "../Description/Description";
import Similar from "../../Page/Similar";
import { loadStripe } from "@stripe/stripe-js";
import { baseUrl } from "../../utilities/Utilities";

const ManageBookingMd = ({
  title = "Hop-on Hop-off tour", // Default title
  subtitle = "Hop-on Hop-off tour", // Default subtitle
  duration = "24 hours", //
  adult_price = 0, // Default price
  youth_price = 0, // Default price
  ticket_serial,
  eventDate,
}) => {
  const [adultCount, setAdultCount] = useState(0); // Default count
  const [youthCount, setYouthCount] = useState(0); // Default count

  const adultPrice = adult_price;
  const youthPrice = youth_price;

  const totalAdultPrice = adultCount * adultPrice;
  const totalYouthPrice = youthCount * youthPrice;
  const totalPrice = totalAdultPrice + totalYouthPrice;

  const handleStripeCheckout = () => {
    if (totalPrice === 0) return; // Prevent checkout if total price is 0

    loadStripe("pk_test_51JLudiCHMxzhWuhuCnD0c4BqfYSiCaTz5pmcpaNwgGeTNRMhhMxbw0WVfU96CGVyhZt4gYLbZSkuMPj8wjo1pZOn00n6ZlM5xG")
      .then((stripe) => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", subtitle);
        formData.append("image", "/path/to/image");
        formData.append("date", eventDate || "2024-12-20");
        formData.append("adult_count", adultCount);
        formData.append("youth_count", youthCount);
        formData.append("package_id", ticket_serial);
        formData.append("package_identifier", "status");

        fetch(`${baseUrl}create_checkout_session/`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${window.localStorage["access"]}`,
            "X-CSRFToken": window.localStorage["csrf_token"],
          },
        })
          .then((response) => {
            if (!response.ok) {
              if (response.status === 401) {
                window.location.href = "/login";
              } else {
                return Promise.reject("Failed to create checkout session");
              }
            }
            return response.json();
          })
          .then((session) => {
            if (session.id) {
              stripe.redirectToCheckout({ sessionId: session.id }).then((result) => {
                if (result.error) {
                  console.error(result.error.message);
                }
              });
            } else {
              console.error("Session ID not found in response");
            }
          })
          .catch((error) => {
            console.error("Error during checkout process:", error);
          });
      })
      .catch((error) => {
        console.error("Stripe.js error:", error);
      });
  };

  return (
    <div className="container  mx-auto">


        <div>
        <div className="hidden md:block">
                <img
                    src="./Banner/mb.jpg"
                    alt="Big Bus Rome"
                    className="w-full object-contain"
                />
            </div>
        </div>









      <div className="flex flex-col mt-16 space-y-4 pb-8 px-8">
        <div className="flex items-center gap-6">
          <p>{subtitle}</p>
          <div className="flex items-center gap-2">
            <FaRegClock />
            <p className="font-bold">{duration}</p>
          </div>
        </div>
        <h2 className="text-xl md:text-3xl font-bold mb-2">{title}</h2>
        <div className="flex items-center gap-0 md:gap-3 color-1 font-semibold">
          <p>Select ticket</p>
          <p>
            <MdKeyboardArrowRight size={20} />
          </p>
          <p>Payment</p>
          <p>
            <MdKeyboardArrowRight size={20} />
          </p>
          <p>Confirm ticket</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row bg-[#F2F2F7] gap-6 py-10 px-8">
        <div className="flex-1 bg-white p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Book Your Tickets</h3>
          <div className="flex justify-between items-center mb-6 border rounded-lg py-5 px-4">
            <div>
              <h4 className="text-lg font-bold">Adult - € {adultPrice}</h4>
              <p className="text-gray-500 text-sm">Adult: between 19 to 99 years old</p>
            </div>
            <div className="flex items-center gap-5">
              <h1 className="text-lg font-bold color-1">€ {totalAdultPrice}</h1>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-[#F2F2F7]">
                <button
                  className="border bg-[#FEF7FF] rounded-md px-3 py-1"
                  onClick={() => setAdultCount(Math.max(0, adultCount - 1))}
                >
                  −
                </button>
                <span className="text-lg bg-white px-4 rounded-md">{adultCount}</span>
                <button
                  className="border bg-[#FEF7FF] rounded-md px-3 py-1"
                  onClick={() => setAdultCount(adultCount + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-6 border py-5 px-4 rounded-lg">
            <div>
              <h4 className="text-lg font-bold">Youth - € {youthPrice}</h4>
              <p className="text-gray-500 text-sm">Youth: between 6 to 18 years old</p>
            </div>
            <div className="flex items-center gap-5">
              <h1 className="text-lg font-bold color-1">€ {totalYouthPrice}</h1>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-[#F2F2F7]">
                <button
                  className="border bg-[#FEF7FF] rounded-md px-3 py-1"
                  onClick={() => setYouthCount(Math.max(0, youthCount - 1))}
                >
                  −
                </button>
                <span className="text-lg bg-white px-4 rounded-md">{youthCount}</span>
                <button
                  className="border bg-[#FEF7FF] rounded-md px-3 py-1"
                  onClick={() => setYouthCount(youthCount + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <p className="color-1 text-sm font-semibold mt-4">
            *Note: Children aged 0-5 years can travel free of charge and do not require a ticket.*
          </p>

          <div className="text-sm mt-20 flex gap-4">
            <Link to={"/returnPolicy"} className="text-blue-600 hover:underline">
              Return Policy
            </Link>
            <Link to={"/refund"} className="text-blue-600 hover:underline">
              Refund Policy
            </Link>
          </div>
        </div>

        <div className="w-full md:w-1/3">
          <div className="bg-gray-50 border-4 border-gray-300 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Summary</h3>
            <div className="mb-2">
              <p className="flex justify-between items-center">
                <span>Total ticket price (adult):</span>
                <span className="font-bold">€ {totalAdultPrice}</span>
              </p>
              <p className="flex justify-between items-center">
                <span>Total ticket price (youth):</span>
                <span className="font-bold">€ {totalYouthPrice}</span>
              </p>
            </div>
            <hr />
            <div className="flex justify-between font-bold my-4">
              <span>Total price:</span>
              <span>€ {totalPrice}</span>
            </div>
            <button
              className="w-full bg-2 text-white py-2 rounded hover:bg-red-800"
              onClick={handleStripeCheckout}
              disabled={totalPrice === 0} // Disable button if total price is 0
            >
              Buy Tickets
            </button>
          </div>
        </div>
      </div>
      <Description />
      <Similar />
    </div>
  );
};

export default ManageBookingMd;
