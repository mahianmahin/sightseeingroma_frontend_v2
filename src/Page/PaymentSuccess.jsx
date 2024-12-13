

const PaymentSuccess = () => {
    // Function to handle QR code download
    const downloadQRCode = () => {
        const qrImage = document.getElementById("qrCode");
        const link = document.createElement("a");
        link.href = qrImage.src; // Use the image source
        link.download = "QRCode.png"; // Set the filename
        link.click(); // Trigger the download
    };

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
                    <img
                        id="qrCode"
                        src="./QR/qr.png"
                        alt="QR Code"
                        className="mb-4 mt-10"
                    />

                    {/* Download QR Button */}
                    <button
                        type="button"
                        onClick={downloadQRCode}
                        className="px-4 bg-2 mt-3 mb-5 md:mb-7 text-white py-2 rounded-full md:rounded-lg hover:bg-red-800 transition"
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

export default PaymentSuccess;
