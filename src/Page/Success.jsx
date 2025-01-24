import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl, baseUrlHashless } from "../utilities/Utilities";


const Success = () => {
     const [url, setUrl] = useState('')
    
        const navigate = useNavigate()
        const { unique_id } = useParams();
   useEffect(() => {
        fetch(`${baseUrl}success/${unique_id}/`, {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${window.localStorage['access']}`,
            }
        })
        .then(response => {
            if (response.status === 401) {
                navigate('/login/')
            } else {
                return response.json()
            }
        })
        .then(data => setUrl(data.url))
    }, [])
    return (
        <div className="container mx-auto">
            
            <div className="flex flex-col items-center justify-center py-24 md:py-40 bg-white px-3 md:bg-gray-50">
                <div className="flex flex-col items-center p-6 py-8 bg-white rounded-lg shadow-md w-full md:w-2/3 px-8">
                    {/* Success Icon */}
                    <div className="text-green-500 text-5xl mb-4">
                        <img src="./Login/sent.png" alt="Payment Sent Icon" />
                    </div>
                    {/* Message */}
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Payment Successful!
                    </h1>
                    {/* QR Code */}
                 <img src={`${baseUrlHashless}${url}`} alt="qr_code" />
                    {/* Download QR Button */}
                    <button
                        type="button"
                        className="px-4 bg-2 mt-3 mb-5 md:mb-7 text-white py-2 rounded-full md:rounded-lg hover:bg-red-800 transition"
                    >
                      <a href={`${baseUrlHashless}${url}`}  download>save</a>
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