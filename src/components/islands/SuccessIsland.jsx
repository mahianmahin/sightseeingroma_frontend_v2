/**
 * Success island – shows QR code after successful payment.
 * Receives `uniqueId` as a prop from the Astro page.
 */
import { useEffect, useState } from 'react';

const API_URL = 'https://api.sightseeingroma.com';

export default function SuccessIsland({ uniqueId }) {
  const [url, setUrl] = useState('');
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);

  useEffect(() => {
    // Show email prompt after 1 second
    const t = setTimeout(() => setShowEmailPrompt(true), 1000);

    // Fetch QR code
    fetch(`${API_URL}/success/${uniqueId}/`)
      .then((r) => {
        if (r.status === 401) { window.location.href = '/login'; return null; }
        return r.json();
      })
      .then((data) => { if (data) setUrl(data.url); })
      .catch(console.error);

    return () => clearTimeout(t);
  }, [uniqueId]);

  const handleDownload = () => {
    if (!url) return;
    const fullUrl = `${API_URL}${url}`;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'ticket_qr_code.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
        }, 'image/png');
      } catch {
        window.open(fullUrl, '_blank');
      }
    };
    img.onerror = () => window.open(fullUrl, '_blank');
    img.src = fullUrl;
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-24 md:py-40 bg-white px-3 md:bg-gray-50">
        <div className="flex flex-col items-center p-6 py-8 bg-white rounded-lg shadow-md w-full md:w-2/3 px-8">
          {/* Success Icon */}
          <div className="text-green-500 text-5xl mb-4">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="text-3xl text-center font-bold text-gray-800 mb-2">Payment Successful!</h1>

          {/* QR Code */}
          {url ? (
            <img src={`${API_URL}${url}`} alt="QR Code" className="w-64 h-64 my-6" />
          ) : (
            <div className="w-64 h-64 my-6 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#930B31]" />
            </div>
          )}

          {/* Download QR */}
          <button type="button" onClick={handleDownload}
            className="w-full md:w-1/2 font-bold px-4 bg-[#930B31] mt-3 mb-5 md:mb-7 text-white py-2 rounded md:rounded-lg hover:bg-red-800 transition">
            Download QR Code
          </button>

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
}
