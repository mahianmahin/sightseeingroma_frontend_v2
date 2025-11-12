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
import TicketEditModal from "../TicketEditModal/TicketEditModal";


const ManageBookingSm = () => {
  const { id, status } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [adultCount, setAdultCount] = useState(1); // Default to 1 adult ticket
  const [youthCount, setYouthCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  
  // Similar packages state
  const [allPackages, setAllPackages] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(true);
  const [similarError, setSimilarError] = useState(false);
  const [bigLoader, setBigLoader] = useState(false);
  
  // Ticket edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  // Handle ticket data update after editing
  const handleTicketUpdate = (updatedData) => {
    setData(prevData => ({
      ...prevData,
      ...updatedData
    }));
  };

  return (
    <div className="min-h-screen pt-[67px]"> {/* Changed from pt-16 to pt-24 */}
      <div>
        <div className="md:hidden block">
        <div>
            <DetailsImage img1={img1} img2={img2} img3={img3} img4={img4} data={data}></DetailsImage>
          </div>
        </div>
      </div>

      <div className="pt-2 lg:pt-10 pb-3 lg:pb-6 px-4">
        <div className="flex text-sm items-center gap-6 py-3">
          <p>{data?.type}</p>
          <div className="flex items-center gap-2">
            <FaRegClock />
            <p className="font-bold">{data?.duration}</p>
          </div>
          
          {/* Edit Button - Only show for editors */}
          {isEditor && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="ml-auto flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors duration-200"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          )}
        </div>
        <h2 className="text-sm  font-semibold mb-2">{data?.title}</h2>

        <div className="hidden lg:flex text-sm items-center gap-0  color-1 font-semibold">
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

      <div className="bg-[#F2F2F7] pb-4 md:pb-8 md:mb-0">
        <div className="p-3 md:p-4 rounded-lg">
          <div className="border-2 p-3 md:p-4 rounded-lg bg-white">
            <h1 className="text-base md:text-lg font-bold pb-3 md:py-4">Book Your Tickets</h1>

            {/* Compact Adult Section */}
            <div className="mb-3 md:mb-6 border rounded-lg p-3 md:p-4 bg-white shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <h2 className="text-sm font-bold">Adult - €{adultPrice}</h2>
                  <p className="text-gray-500 text-xs md:text-sm">Age 19-99</p>
                </div>
                <div className="flex items-center gap-2 md:gap-3 p-1.5 md:p-2 rounded-lg bg-[#F2F2F7]">
                  <button
                    className="border bg-[#FEF7FF] rounded-md px-2 md:px-3 py-1 text-sm md:text-base"
                    onClick={() => setAdultCount(Math.max(0, adultCount - 1))}
                  >
                    −
                  </button>
                  <span className="text-sm md:text-base bg-white px-3 md:px-4 py-0.5 rounded-md min-w-[32px] md:min-w-[40px] text-center">
                    {adultCount}
                  </span>
                  <button
                    className="border bg-[#FEF7FF] rounded-md px-2 md:px-3 py-1 text-sm md:text-base"
                    onClick={() => setAdultCount(adultCount + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs md:text-sm text-gray-600">Total:</span>
                <span className="text-base md:text-lg font-bold text-[#930B31]">€{totalAdultPrice}</span>
              </div>
            </div>

            {/* Compact Youth Section */}
            <div className="mb-3 md:mb-6 border rounded-lg p-3 md:p-4 bg-white shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <h2 className="text-sm font-bold">Youth - €{youthPrice}</h2>
                  <p className="text-gray-500 text-xs md:text-sm">Age 6-18</p>
                </div>
                <div className="flex items-center gap-2 md:gap-3 p-1.5 md:p-2 rounded-lg bg-[#F2F2F7]">
                  <button
                    className="border bg-[#FEF7FF] rounded-md px-2 md:px-3 py-1 text-sm md:text-base"
                    onClick={() => setYouthCount(Math.max(0, youthCount - 1))}
                  >
                    −
                  </button>
                  <span className="text-sm md:text-base bg-white px-3 md:px-4 py-0.5 rounded-md min-w-[32px] md:min-w-[40px] text-center">
                    {youthCount}
                  </span>
                  <button
                    className="border bg-[#FEF7FF] rounded-md px-2 md:px-3 py-1 text-sm md:text-base"
                    onClick={() => setYouthCount(youthCount + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs md:text-sm text-gray-600">Total:</span>
                <span className="text-base md:text-lg font-bold text-[#930B31]">€{totalYouthPrice}</span>
              </div>
            </div>

            {/* Compact Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 md:p-3 mb-3 md:mb-4">
              <p className="text-xs md:text-sm text-blue-800 flex items-start gap-2">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Children aged 0-5 travel free (no ticket required)</span>
              </p>
            </div>

            {/* Compact Policies */}
            <div className="flex flex-wrap gap-3 md:gap-4 pt-3 md:pt-4 text-xs md:text-sm border-t">
              <Link to={"/returnPolicy"} className="text-blue-600 hover:underline flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Return Policy
              </Link>
              <Link to={"/refund"} className="text-blue-600 hover:underline flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Refund Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Compact Summary Section - Sticky on Mobile */}
        <div className="fixed bottom-0 left-0 right-0 md:relative md:w-1/3 px-3 z-50 md:z-auto">
          <div className="border-2 md:border-4 border-gray-300 md:border-gray-400 p-3 md:p-6 rounded-t-lg md:rounded-lg shadow-lg md:shadow-md bg-white">
            <h3 className="text-base md:text-xl font-bold mb-2 md:mb-4 text-gray-900">Order Summary</h3>
            
            {/* Compact price breakdown */}
            <div className="space-y-2 mb-3 md:mb-4">
              {adultCount > 0 && (
                <div className="flex justify-between items-center text-sm md:text-base">
                  <span className="text-gray-600">Adult ({adultCount}x):</span>
                  <span className="font-semibold">€{totalAdultPrice}</span>
                </div>
              )}
              {youthCount > 0 && (
                <div className="flex justify-between items-center text-sm md:text-base">
                  <span className="text-gray-600">Youth ({youthCount}x):</span>
                  <span className="font-semibold">€{totalYouthPrice}</span>
                </div>
              )}
            </div>
            
            <div className="border-t-2 border-gray-200 pt-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-base md:text-lg font-bold text-gray-900">Total:</span>
                <span className="text-xl md:text-2xl font-bold text-[#930B31]">€{totalPrice}</span>
              </div>
            </div>
            
            <button
              className={`w-full py-3 md:py-3.5 rounded-lg font-bold text-sm md:text-base transition-all duration-300 ${
                totalPrice === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#930B31] text-white hover:bg-red-800 hover:shadow-lg transform hover:scale-[1.02]"
              }`}
              disabled={totalPrice === 0}
              onClick={() => handleStripeCheckoutFunction(adultCount, youthCount)}
            >
              {totalPrice === 0 ? "Select Tickets" : "Proceed to Payment"}
            </button>
            
            {/* Trust indicators */}
            <div className="mt-3 md:mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secure Transfer</span>
                </div>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Instant Confirm</span>
                </div>
              </div>
            </div>
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
                <EditWrapper isEditor={isEditor} contentTag={"ticket-details-explore-similar"} refreshContent={refreshContent}>
                  {renderContent("ticket-details-explore-similar", hasContent, getContentByTag, '<h1 class="text-2xl font-bold mb-4">Explore Similar Packages</h1>')}
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
                    thumbnail_small_alt={ticket.thumbnail_small_alt}
                    thumbnail_large_alt={ticket.thumbnail_large_alt}
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

      {/* Ticket Edit Modal */}
      <TicketEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        ticketData={data}
        onSave={handleTicketUpdate}
      />
    </div>
  );
};

export default ManageBookingSm;
