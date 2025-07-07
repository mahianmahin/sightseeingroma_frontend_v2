import { useEffect, useState } from "react";
import { FaRegClock } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import Similar from "../../Page/Similar";
import handleStripeCheckout from "../../utilities/stripeCheckout";
import { baseUrl, baseUrlHashless } from "../../utilities/Utilities";
import Description from "../Description/Description";
import DetailsImage from './../Details_Image/Details_image';


const ManageBookingSm = () => {
  const { id, status } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [adultCount, setAdultCount] = useState(0);
  const [youthCount, setYouthCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [bigLoader, setBigLoader] = useState(false);

  const adultPrice = data?.adult_price || 0;
  const youthPrice = data?.youth_price || 0;
  const totalAdultPrice = adultCount * adultPrice;
  const totalYouthPrice = youthCount * youthPrice;
  const totalPrice = totalAdultPrice + totalYouthPrice;

  const imgbig = baseUrlHashless + data?.image_big;
  const img2 = baseUrlHashless + data?.second_image;
  const img3 = baseUrlHashless + data?.third_image;
  const img4 = baseUrlHashless + data?.fourth_image;

  // Fetch package data when the component is mounted or when id/status changes
  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${baseUrl}package/${status}/${id}/`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        } else {
          throw new Error('Received content is not JSON');
        }
      })
      .then(result => setData(result.data))
      .catch(error => {
        console.error('Error fetching data:', error);
        setMessage('Failed to load data. Please try again later.');
        setShowMessage(true);
      });
  }, [id, status]);

  function handleStripeCheckoutFunction(adultCount, youthCount) {
    if (data?.dates && selectedDate === '') {
      setMessage("Please select a date first");
      setShowMessage(true);
    } else {
      setMessage('');
      setShowMessage(false);
      setBigLoader(true);

      const tempElement = document.createElement('div');
      tempElement.innerHTML = data?.description || '';
      const cleanText = tempElement.textContent || tempElement.innerText;

      handleStripeCheckout(
        data?.title || '',
        cleanText,
        baseUrlHashless + data?.image_big,
        selectedDate,
        adultCount,
        youthCount,
        0, // Assuming infant count is 0 for now
        navigate,
        id,
        status,
        setBigLoader
      );
    }
  }

  return (
    <div className="min-h-screen">
      <div>
        <div className="md:hidden block">
        <div>
            <DetailsImage img1={imgbig} img2={img2} img3={img3} img4={img4}></DetailsImage>
            

          </div>
        </div>
      </div>

      <div className="pt-10 pb-6 px-4">
        <div className="block md:hidden">
          <div className="flex items-center gap-5">
            <FaArrowLeftLong size={15}></FaArrowLeftLong>
            <p className="font-bold text-md">Checkout</p>
          </div>
        </div>
        <div className="flex text-sm items-center gap-6 py-3">
          <p>{data?.type}</p>
          <div className="flex items-center gap-2">
            <FaRegClock />
            <p className="font-bold">{data?.duration}</p>
          </div>
        </div>
        <h2 className="text-sm  font-semibold mb-2">{data?.title}</h2>

        <div className="flex text-sm items-center gap-0  color-1 font-semibold">
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

      <div className="bg-[#F2F2F7] pb-8">
        <div className="p-4 rounded-lg">
          <div className="border-2 p-3 rounded-lg bg-white">
            <h1 className="text-base font-bold py-4">Book Your Tickets</h1>

            {/* Adult Section */}
            <div className="mb-6 border rounded-lg p-4 bg-white shadow">
              <h2 className="text-sm font-bold">Adult - € {adultPrice}</h2>
              <p className="text-gray-500 text-sm mb-4">
                Adult: between 19 to 99 years old
              </p>
              <div>
                <div className="flex text-sm items-center justify-between">
                  <h3 className="color-1 font-bold mb-2">Total price</h3>
                  <h3 className="color-1 font-bold mb-2 text-right">
                    Ticket count
                  </h3>
                </div>
                <div className="flex items-center justify-between border gap-3 p-2 rounded-lg">
                  <p className="text-base font-bold color-1 py-4">
                    € {totalAdultPrice}
                  </p>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-[#F2F2F7]">
                    <button
                      className="border bg-[#FEF7FF] rounded-md px-3 py-1"
                      onClick={() =>
                        setAdultCount(Math.max(0, adultCount - 1))
                      }
                    >
                      −
                    </button>
                    <span className="text-sm bg-white px-4 rounded-md">
                      {adultCount}
                    </span>
                    <button
                      className="border bg-[#FEF7FF] rounded-md px-3 py-1"
                      onClick={() => setAdultCount(adultCount + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Youth Section */}
            <div className="mb-6 border rounded-lg p-4 bg-white shadow">
              <h2 className="text-sm font-bold">Youth - € {youthPrice}</h2>
              <p className="text-gray-500 text-sm mb-4">
                Youth: between 6 to 18 years old
              </p>
              <div>
                <div className="flex items-center text-sm justify-between">
                  <h3 className="color-1 font-bold mb-2">Total price</h3>
                  <h3 className="color-1 font-bold mb-2 text-right">
                    Ticket count
                  </h3>
                </div>
                <div className="flex items-center justify-between border gap-3 p-2 rounded-lg">
                  <p className="text-base font-bold color-1 py-4">
                    € {totalYouthPrice}
                  </p>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-[#F2F2F7]">
                    <button
                      className="border bg-[#FEF7FF] rounded-md px-3 py-1"
                      onClick={() =>
                        setYouthCount(Math.max(0, youthCount - 1))
                      }
                    >
                      −
                    </button>
                    <span className="text-lg bg-white px-4 rounded-md">
                      {youthCount}
                    </span>
                    <button
                      className="border bg-[#FEF7FF] rounded-md px-3 py-1"
                      onClick={() => setYouthCount(youthCount + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            <p className="text-sm color-1 font-medium mb-4">
              *Note: Children aged 0-5 years can travel free of charge and do
              not require a ticket.
            </p>

            {/* Policies */}
            <div className="flex space-x-4 pt-8 text-blue-500 text-sm">
              <Link
                to={"/returnPolicy"}
                className="text-blue-600 hover:underline"
              >
                Return Policy
              </Link>
              <Link to={"/refund"} className="text-blue-600 hover:underline">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="w-full md:w-1/3 px-3">
          <div className="border-4 border-gray-400 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Summary</h3>
            <div className="mb-2">
              <p className="flex justify-between items-center space-y-3">
                <span>Total ticket price (adult):</span>
                <span className="font-bold">€ {totalAdultPrice}</span>
              </p>
              <p className="flex justify-between items-center space-y-3">
                <span>Total ticket price (youth):</span>
                <span className="font-bold">€ {totalYouthPrice}</span>
              </p>
            </div>
            <hr />
            <div className="flex justify-between space-y-3 font-bold my-4">
              <span>Total price:</span>
              <span>€ {totalPrice}</span>
            </div>
            <button
              className={`w-full py-2 rounded ${
                totalPrice === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-2 text-white hover:bg-red-800"
              }`}
              disabled={totalPrice === 0}
              onClick={() => handleStripeCheckoutFunction(adultCount, youthCount)}
            >
              Buy Tickets
            </button>
          </div>
        </div>
      </div>

      <Description description={data?.description} />
      <Similar />
    </div>
  );
};

export default ManageBookingSm;
