import { useEffect, useState } from "react";
import { FaRegClock } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import TicketCard from "../TicketCard/TicketCard";
import handleStripeCheckout from "../../utilities/stripeCheckout";
import { baseUrl, baseUrlHashless } from "../../utilities/Utilities";
import Description from "../Description/Description";
import Details_image from "../Details_Image/Details_image";
import Loader from "../Loader/Loader";
import HelmetWrapper from "../../utilities/HelmetWrapper";
import useEditorCheck from "../../hooks/useEditorCheck";
import useStaticContent from "../../hooks/useStaticContent";
import EditWrapper from "../Edit_Wrapper/EditWrapper";
import renderContent from "../../utilities/renderContent";
import Description2 from "../Description/Description2";
import TicketEditModal from "../TicketEditModal/TicketEditModal";
import DateSelector from "../DateSelector/DateSelector";

const ManageBookingMd = () => {
  const { id, status } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [adultCount, setAdultCount] = useState(1); // Default to 1 adult ticket
  const [youthCount, setYouthCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [bigLoader, setBigLoader] = useState(false);
  
  // Similar packages state
  const [allPackages, setAllPackages] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(true);
  const [similarError, setSimilarError] = useState(false);
  
  // Ticket edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const adultPrice = data?.adult_price || 0;
  const youthPrice = data?.youth_price || 0;
  const totalAdultPrice = adultCount * adultPrice;
  const totalYouthPrice = youthCount * youthPrice;
  const totalPrice = totalAdultPrice + totalYouthPrice;

  // Use the new carousel image fields with large variants for desktop
  const img1 = data?.carousel_one_large ? baseUrlHashless + data.carousel_one_large : (data?.image_big ? baseUrlHashless + data.image_big : '');
  const img2 = data?.carousel_two_large ? baseUrlHashless + data.carousel_two_large : (data?.second_image ? baseUrlHashless + data.second_image : '');
  const img3 = data?.carousel_three_large ? baseUrlHashless + data.carousel_three_large : (data?.third_image ? baseUrlHashless + data.third_image : '');
  const img4 = data?.carousel_four_large ? baseUrlHashless + data.carousel_four_large : (data?.fourth_image ? baseUrlHashless + data.fourth_image : '');

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
      .then(result => { setData(result.data); })
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

  const getCleanText = (htmlText) => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlText || '';
    return tempElement.textContent || tempElement.innerText || '';
  };

  function handleStripeCheckoutFunction(adultCount, youthCount, infantCount) {
    if (selectedDate === '') {
      setMessage("Please select a date first");
      setShowMessage(true);
      return;
    }
    
    setMessage('');
    setShowMessage(false);
    setBigLoader(true);

    const tempElement = document.createElement('div');
    tempElement.innerHTML = data?.description || '';
    const cleanText = tempElement.textContent || tempElement.innerText;

    handleStripeCheckout(
      data?.title || '',
      cleanText,
      data?.thumbnail_large ? baseUrlHashless + data.thumbnail_large : (data?.image_big ? baseUrlHashless + data.image_big : ''),
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
    <>
    {/* Meta information */}
    <HelmetWrapper title={data?.meta_title} description={data?.meta_description} keywords={data?.meta_keywords} schema={data?.schema_json} />
    
    
    <div className="container mx-auto pt-24"> {/* Changed from pt-16 to pt-24 */}
      {bigLoader && <Loader />}
      <div>
        <div className="">
         
          <div>
            <Details_image img1={img1} img2={img2} img3={img3} img4={img4} data={data}></Details_image>

          </div>

        </div>
      </div>

      <div className="flex flex-col mt-16 space-y-4 pb-8 px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <p>{data?.type}</p>
            <div className="flex items-center gap-2">
              <FaRegClock />
              <p className="font-bold">{data?.duration}</p>
            </div>
          </div>
          
          {/* Edit Button - Only show for editors */}
          {isEditor && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Ticket
            </button>
          )}
        </div>
        
        <h2 className="text-xl md:text-3xl font-bold mb-2">{data?.title}</h2>
        
        <EditWrapper isEditor={isEditor} contentTag={"ticket-details-steps"} refreshContent={refreshContent}>
          {renderContent('ticket-details-steps', hasContent, getContentByTag)}
        </EditWrapper>


      </div>

      <div className="flex flex-col md:flex-row bg-[#F2F2F7] gap-6 py-10 px-8">
        <div className="flex-1 bg-white p-6 border rounded-lg">

          <EditWrapper isEditor={isEditor} contentTag={"ticket-details-heading"} refreshContent={refreshContent}>
            {renderContent('ticket-details-heading', hasContent, getContentByTag)}
          </EditWrapper>
          
          <div className="flex justify-between items-center mb-6 border rounded-lg py-5 px-4">
            <div>
              <h4 className="text-lg font-bold">Adult - € {adultPrice}</h4>

              <EditWrapper isEditor={isEditor} contentTag={`ticket-details-adult-description-${data?.company}`} refreshContent={refreshContent}>
                {renderContent(`ticket-details-adult-description-${data?.company}`, hasContent, getContentByTag)}
              </EditWrapper>
            
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

              <EditWrapper isEditor={isEditor} contentTag={`ticket-details-youth-description-${data?.company}`} refreshContent={refreshContent}>
                {renderContent(`ticket-details-youth-description-${data?.company}`, hasContent, getContentByTag)}
              </EditWrapper>
            
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

          <EditWrapper isEditor={isEditor} contentTag={"ticket-details-note"} refreshContent={refreshContent}>
            {renderContent('ticket-details-note', hasContent, getContentByTag)}
          </EditWrapper>

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
            
            {/* Date Selector - Desktop */}
            <div className="mb-6">
              <DateSelector 
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                isMobile={false}
                ticketCount={adultCount + youthCount}
              />
            </div>

            <EditWrapper isEditor={isEditor} contentTag={"ticket-details-summary-title"} refreshContent={refreshContent}>
              {renderContent('ticket-details-summary-title', hasContent, getContentByTag, 'Summary')}
            </EditWrapper>

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
            
            {/* Validation Message */}
            {showMessage && message && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {message}
                </p>
              </div>
            )}
            
            <button
              className={`w-full py-2 rounded ${
                totalPrice === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-2 text-white hover:bg-red-800"
              }`}
              disabled={totalPrice === 0}
              onClick={() => handleStripeCheckoutFunction(adultCount, youthCount, 0)} // Assuming infant count is 0 for now
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
      
      {/* <Description description={data?.description} /> */}
      <Description2 description={data?.description} />

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
                  {renderContent("ticket-details-explore-similar", hasContent, getContentByTag)}
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
    </>
  );
};

export default ManageBookingMd;
