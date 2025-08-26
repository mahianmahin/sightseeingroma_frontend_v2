import React, { useEffect, useState } from 'react';
import { FaTicketAlt, FaCalendarAlt, FaEuroSign, FaQrcode, FaCheckCircle, FaTimesCircle, FaDownload, FaClipboardList } from 'react-icons/fa';
import { HiOutlineTicket } from 'react-icons/hi';
import Banner2 from '../Components/Banner2/Banner2';
import { useNavigate } from 'react-router-dom';
import { baseMediaUrl, baseUrl, baseUrlHashless } from '../utilities/Utilities';
import PurchasedTicketImage from "../assets/new/Purchased-Tickets-Section.jpg";
import EditWrapper from '../Components/Edit_Wrapper/EditWrapper';
import useEditorCheck from '../hooks/useEditorCheck';
import useStaticContent from '../hooks/useStaticContent';


const Your_Purchased_Tickets = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${baseUrl}dashboard/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${window.localStorage['access']}`,
                    },
                });

                if (response.status === 401) {
                    navigate('/login');
                    return;
                }

                if (!response.ok) {
                    throw new Error('Failed to fetch tickets');
                }

                const result = await response.json();
                setData(result.data || []);
            } catch (err) {
                console.error('Error fetching tickets:', err);
                setError('Failed to load your tickets. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [navigate]);


    const { isEditor } = useEditorCheck();
    const { getContentByTag, hasContent, refreshContent } = useStaticContent('purchase-history');

    const renderContent = (contentTag, fallbackText = "Loading...") => {
    return hasContent(contentTag)
      ? <span dangerouslySetInnerHTML={{ __html: getContentByTag(contentTag) }}></span>
      : <div>{fallbackText}</div>;
    };



    return (
        <div className="min-h-screen bg-[#F2F2F7]">
            <Banner2 bannerImgmd={PurchasedTicketImage} bannerImgsm={PurchasedTicketImage}>
                
                <EditWrapper isEditor={isEditor} contentTag={"purchase-history-title"} refreshContent={refreshContent}>
                    {renderContent('purchase-history-title')}
                </EditWrapper>

                <EditWrapper isEditor={isEditor} contentTag={"purchase-history-subtitle"} refreshContent={refreshContent}>
                    {renderContent('purchase-history-subtitle')}
                </EditWrapper>

                
            </Banner2>

            <div className="container mx-auto px-4 py-8 md:py-12">
                {/* Stats Section */}
                {!loading && !error && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md text-center">
                            <FaTicketAlt className="text-2xl md:text-3xl text-[#930B31] mx-auto mb-2" />
                            <p className="text-lg md:text-2xl font-bold text-gray-800">{data.length}</p>
                            <p className="text-xs md:text-sm text-gray-600">Total Tickets</p>
                        </div>
                        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md text-center">
                            <FaCheckCircle className="text-2xl md:text-3xl text-green-600 mx-auto mb-2" />
                            <p className="text-lg md:text-2xl font-bold text-gray-800">
                                {data.filter(ticket => ticket.qr_code_scanned).length}
                            </p>
                            <p className="text-xs md:text-sm text-gray-600">Claimed</p>
                        </div>
                        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md text-center">
                            <FaTimesCircle className="text-2xl md:text-3xl text-orange-500 mx-auto mb-2" />
                            <p className="text-lg md:text-2xl font-bold text-gray-800">
                                {data.filter(ticket => !ticket.qr_code_scanned).length}
                            </p>
                            <p className="text-xs md:text-sm text-gray-600">Pending</p>
                        </div>
                        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md text-center">
                            <FaEuroSign className="text-2xl md:text-3xl text-[#930B31] mx-auto mb-2" />
                            <p className="text-lg md:text-2xl font-bold text-gray-800">
                                {data.reduce((sum, ticket) => sum + parseFloat(ticket.total_price || 0), 0).toFixed(0)}
                            </p>
                            <p className="text-xs md:text-sm text-gray-600">Total Spent</p>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-16">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#930B31] mb-4"></div>
                        <p className="text-lg text-gray-600 font-medium">Loading your tickets...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-16">
                        <div className="bg-white p-8 rounded-2xl shadow-md max-w-md mx-auto">
                            <FaTimesCircle className="text-4xl text-red-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
                            <p className="text-red-500 mb-4">{error}</p>
                            <button 
                                onClick={() => window.location.reload()} 
                                className="bg-[#930B31] text-white px-6 py-2 rounded-lg hover:bg-red-800 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && data.length === 0 && (
                    <EditWrapper isEditor={isEditor} contentTag={"purchase-history-no-tickets-found"} refreshContent={refreshContent}>
                        {renderContent('purchase-history-no-tickets-found')}
                    </EditWrapper>
                )}






                {/* Desktop Table View */}
                {!loading && !error && data.length > 0 && (
                    <div className="hidden md:block">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-[#930B31] to-red-700 px-6 py-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <HiOutlineTicket className="text-2xl" />
                                    Your Ticket History
                                </h2>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-[#F2F2F7]">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <FaCalendarAlt className="text-[#930B31]" />
                                                    Selected Date
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <FaTicketAlt className="text-[#930B31]" />
                                                    Package
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <FaEuroSign className="text-[#930B31]" />
                                                    Total Price
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <FaCheckCircle className="text-[#930B31]" />
                                                    Status
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <FaQrcode className="text-[#930B31]" />
                                                    QR Code
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {data.map((ticket, index) => (
                                            <tr
                                                key={index}
                                                className="hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {ticket.selected_date === '' ? "N/A" : ticket.selected_date}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900 max-w-xs">
                                                        {ticket.package}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-[#930B31]">
                                                        €{ticket.total_price}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {ticket.qr_code_scanned ? (
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            <FaCheckCircle />
                                                            Claimed
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                            <FaTimesCircle />
                                                            Pending
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <a 
                                                        href={`${baseUrlHashless}${ticket.qr_code}`} 
                                                        download
                                                        className="inline-flex items-center gap-1 px-3 py-2 bg-[#930B31] text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
                                                    >
                                                        <FaDownload />
                                                        Download
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile Card View */}
                {!loading && !error && data.length > 0 && (
                    <div className="block md:hidden space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <HiOutlineTicket className="text-2xl text-[#930B31]" />
                            Your Tickets
                        </h2>
                        
                        {data.map((ticket, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
                            >
                                {/* Card Header */}
                                <div className="bg-gradient-to-r from-[#930B31] to-red-700 px-4 py-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FaTicketAlt className="text-white text-lg" />
                                            <span className="text-white font-semibold text-sm">
                                                Ticket #{index + 1}
                                            </span>
                                        </div>
                                        {ticket.qr_code_scanned ? (
                                            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                                                CLAIMED
                                            </span>
                                        ) : (
                                            <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded-full">
                                                PENDING
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-4 space-y-4">
                                    {/* Date and Price Row */}
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <FaCalendarAlt className="text-[#930B31] text-sm" />
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Selected Date</p>
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {ticket.selected_date === '' ? "N/A" : ticket.selected_date}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 font-medium">Total Price</p>
                                            <p className="text-lg font-bold text-[#930B31]">€{ticket.total_price}</p>
                                        </div>
                                    </div>

                                    {/* Package Info */}
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-start gap-2">
                                            <FaTicketAlt className="text-[#930B31] text-sm mt-1" />
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium mb-1">Package</p>
                                                <p className="text-sm font-semibold text-gray-800 leading-tight">
                                                    {ticket.package}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status and QR Code Row */}
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            {ticket.qr_code_scanned ? (
                                                <>
                                                    <FaCheckCircle className="text-green-600 text-sm" />
                                                    <span className="text-sm font-medium text-green-600">Claimed</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FaTimesCircle className="text-orange-500 text-sm" />
                                                    <span className="text-sm font-medium text-orange-500">Pending</span>
                                                </>
                                            )}
                                        </div>
                                        <a 
                                            href={`${baseUrlHashless}${ticket.qr_code}`} 
                                            download
                                            className="inline-flex items-center gap-1 px-3 py-2 bg-[#930B31] text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            <FaDownload />
                                            Download QR
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Your_Purchased_Tickets;