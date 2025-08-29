import { useEffect, useState } from "react";
import { FaRegClock } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import TicketCard from "../TicketCard/TicketCard";
import handleStripeCheckout from "../../utilities/stripeCheckout";
import { baseUrl, baseUrlHashless } from "../../utilities/Utilities";
import Description from "../Description/Description";
import DetailsImage from './../Details_Image/Details_image';
import useEditorCheck from "../../hooks/useEditorCheck";
import useStaticContent from "../../hooks/useStaticContent";
import EditWrapper from "../Edit_Wrapper/EditWrapper";
import renderContent from "../../utilities/renderContent";


const ManageBookingSm = () => {
  const { id, status } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [adultCount, setAdultCount] = useState(0);
  const [youthCount, setYouthCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  
  // Similar packages state
  const [allPackages, setAllPackages] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(true);
  const [similarError, setSimilarError] = useState(false);
  const [bigLoader, setBigLoader] = useState(false);

  const adultPrice = data?.adult_price || 0;
  const youthPrice = data?.youth_price || 0;
  const totalAdultPrice = adultCount * adultPrice;
  const totalYouthPrice = youthCount * youthPrice;
  const totalPrice = totalAdultPrice + totalYouthPrice;

  // Use the new carousel image fields with small variants for mobile
  const img1 = data?.carousel_one_small ? baseUrlHashless + data.carousel_one_small : (data?.image_big ? baseUrlHashless + data.image_big : '');
  const img2 = data?.carousel_two_small ? baseUrlHashless + data.carousel_two_small : (data?.second_image ? baseUrlHashless + data.second_image : '');
  const img3 = data?.carousel_three_small ? baseUrlHashless + data.carousel_three_small : (data?.third_image ? baseUrlHashless + data.third_image : '');
  const img4 = data?.carousel_four_small ? baseUrlHashless + data.carousel_four_small : (data?.fourth_image ? baseUrlHashless + data.fourth_image : '');

  // Fetch package data when the component is mounted or when id/status changes
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Fetch package data
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

    // Fetch all packages for similar packages
    const fetchAllPackages = async () => {
      try {
        const response = await axios.get(`${baseUrl}packages/`);
        if (response.status === 200) {
          setAllPackages(response.data.bus_data || []);
        } else {
          console.error("Unexpected response status:", response.status);
          setSimilarError(true);
        }
      } catch (err) {
        console.error("Error fetching similar packages:", err);
        setSimilarError(true);
      } finally {
        setSimilarLoading(false);
      }
    };

    fetchAllPackages();
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
        data?.thumbnail_small ? baseUrlHashless + data.thumbnail_small : (data?.image_big ? baseUrlHashless + data.image_big : ''),
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

  const { isEditor } = useEditorCheck();
  const { getContentByTag, hasContent, refreshContent } = useStaticContent('ticket-details');

  return (
    <div className="min-h-screen pt-24"> {/* Changed from pt-16 to pt-24 */}
      <div>
        <div className="md:hidden block">
        <div>
            <DetailsImage img1={img1} img2={img2} img3={img3} img4={img4} data={data}></DetailsImage>
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
      
      <div className="mb-12 md:mb-0">
        {/* Similar Options Section */}
        {(() => {
          if (similarLoading || !data || !allPackages.length) {
            return similarLoading ? (
              <div className="px-4 md:px-8 py-7 md:py-10">
                <p className="text-center text-gray-600">Loading similar packages...</p>
              </div>
            ) : null;
          }

          // Filter packages with same duration but different package_tag
          const similarPackages = allPackages.filter(pkg => 
            pkg.duration === data.duration && 
            pkg.package_tag !== data.package_tag
          ).slice(0, 8); // Limit to 8 similar packages

          if (similarPackages.length === 0) {
            return null; // Don't show section if no similar packages
          }

          return (
            <div className="px-4 md:px-8">
              <div className="py-7 md:py-10">
                <EditWrapper isEditor={isEditor} contentTag={"ticket-details-similar"} refreshContent={refreshContent}>
                  {renderContent("ticket-details-similar", hasContent, getContentByTag, '<h1 class="text-2xl font-bold mb-4">Explore Similar Packages</h1>')}
                </EditWrapper>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-10">
                {similarPackages.map((ticket) => (
                  <TicketCard
                    key={`similar-${ticket.id}-${ticket.package_tag}`}
                    id={ticket.package_tag}
                    status={ticket.status}
                    title={ticket.title}
                    subtitle={ticket.type}
                    image={ticket.image_big}
                    thumbnail_small={ticket.thumbnail_small}
                    thumbnail_large={ticket.thumbnail_large}
                    duration={ticket.duration}
                    ticketCount={ticket.package_tag}
                    price={ticket.adult_price}
                    price2={ticket.youth_price}
                    id1={ticket.id}
                    offPrice={ticket.off_price}
                  />
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default ManageBookingSm;
