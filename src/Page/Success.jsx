import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl, baseUrlHashless } from "../utilities/Utilities";
import qr_loader from "../assets/qr_loader.webp";
import EmailModal from "../Components/EmailModal/EmailModal";
// import qr_loader from "../assets/qr.png";


const Success = () => {
    const [url, setUrl] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const navigate = useNavigate();
    const { unique_id } = useParams();

    useEffect(() => {
        // Show modal after 1 second
        const modalTimer = setTimeout(() => {
            setIsModalOpen(true);
        }, 1000);

        // Fetch QR code
        fetch(`${baseUrl}success/${unique_id}/`, {
            method: 'GET',
        })
        .then(response => {
            if (response.status === 401) {
                navigate('/login/')
            } else {
                return response.json()
            }
        })
        .then(data => setUrl(data.url))
        .catch(error => console.error('Error:', error));

        return () => clearTimeout(modalTimer);
    }, []);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="container mx-auto">
            <EmailModal isOpen={isModalOpen} onClose={handleCloseModal} />
            
            <div className="flex flex-col items-center justify-center py-24 md:py-40 bg-white px-3 md:bg-gray-50">
                <div className="flex flex-col items-center p-6 py-8 bg-white rounded-lg shadow-md w-full md:w-2/3 px-8">
                    {/* Success Icon */}
                    <div className="text-green-500 text-5xl mb-4">
                        <svg
                            className="w-16 h-16"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    
                    {/* Message */}
                    <h1 className="text-3xl text-center font-bold text-gray-800 mb-2 d-flex justify-center align-items-center">
                        Payment Successful!
                    </h1>
                    
                    {/* QR Code */}
                    {url ? (
                        <img 
                            src={`${baseUrlHashless}${url}`} 
                            alt="qr_code" 
                            className="w-64 h-64 my-6"
                        />
                    ) : (
                        <img 
                            src={qr_loader} 
                            alt="qr_loader" 
                            className="w-45 h-40 my-6"
                        />
                    )}
                    
                    {/* Download QR Button */}
                    <button
                        type="button"
                        className="w-full md:w-1/2 font-bold px-4 bg-2 mt-3 mb-5 md:mb-7 text-white py-2 rounded md:rounded-lg hover:bg-red-800 transition"
                        onClick={async () => {
                            if (!url) return;
                            try {
                                const response = await fetch(`${baseUrlHashless}${url}`);
                                const blob = await response.blob();
                                const link = document.createElement('a');
                                link.href = window.URL.createObjectURL(blob);
                                link.download = 'ticket_qr_code.png';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                window.URL.revokeObjectURL(link.href);
                            } catch (e) {
                                alert('Failed to download QR code.');
                            }
                        }}
                    >
                        Download QR Code
                    </button>
                    
                    {/* Location Information */}
                    <p className="mt-4 text-center font-bold text-gray-700">
                        Show the QR code at the meeting point below:
                    </p>
                    <p className="text-center text-blue-400 underline font-bold">
                        Piazza d'Aracoeli, 8, 00186 Roma RM
                    </p>
                </div>
            </div>
        </div>
    );
};
export default Success;