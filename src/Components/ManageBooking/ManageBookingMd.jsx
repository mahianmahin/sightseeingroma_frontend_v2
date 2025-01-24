import { useEffect, useState } from "react";
import { FaRegClock } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import Similar from "../../Page/Similar";
import handleStripeCheckout from "../../utilities/stripeCheckout";
import { baseUrl, baseUrlHashless } from "../../utilities/Utilities";
import Description from "../Description/Description";
import Details_image from "../Details_Image/Details_image";
import Loader from "../Loader/Loader";

const ManageBookingMd = () => {
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

  const getCleanText = (htmlText) => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlText || '';
    return tempElement.textContent || tempElement.innerText || '';
  };

  function handleStripeCheckoutFunction(adultCount, youthCount, infantCount) {
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
        infantCount,
        navigate,
        id,
        status,
        setBigLoader
      );
    }
  }

  return (
    <div className="container mx-auto">
      {bigLoader && <Loader />}
      <div>
        <div className="">
         
          <div>
            <Details_image img1={imgbig} img2={img2} img3={img3} img4={img4}></Details_image>

          </div>

        </div>
      </div>

      <div className="flex flex-col mt-16 space-y-4 pb-8 px-8">
        <div className="flex items-center gap-6">
          <p>{data?.type}</p>
          <div className="flex items-center gap-2">
            <FaRegClock />
            <p className="font-bold">{data?.duration}</p>
          </div>
        </div>
        <h2 className="text-xl md:text-3xl font-bold mb-2">{data?.title}</h2>
        <div className="flex items-center gap-0 md:gap-3 color-1 font-semibold">
          <p>Select ticket</p>
          <MdKeyboardArrowRight size={20} />
          <p>Payment</p>
          <MdKeyboardArrowRight size={20} />
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
              className="w-full bg-red-800 text-white py-2 rounded-lg"
              onClick={() => handleStripeCheckoutFunction(adultCount, youthCount, 0)} // Assuming infant count is 0 for now
            >
              Checkout
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
