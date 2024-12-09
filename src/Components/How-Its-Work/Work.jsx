import { FaCreditCard, FaQrcode, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import { TiTickOutline } from "react-icons/ti";

const Work = () => {
    return (
        <div
            className="bg-cover bg-center text-white py-10 lg:py-20"
            style={{ backgroundImage: "url('https://iili.io/2Ty8yKJ.md.png')" }}
        >
            {/* Container */}
            <div className="flex flex-col lg:flex-row h-full items-center lg:items-start justify-center lg:justify-end px-6 lg:px-20">
                {/* Timeline */}
                <div className="space-y-10 max-w-md relative">
                    {/* Vertical Line */}
                    <div className="absolute left-5 top-10 bottom-12 md:bottom-16 border-l-2 border-dotted border-gray-300"></div>

                    {/* Step 1 */}
                    <div className="flex items-start space-x-4 relative">
                        <div className="bg-white rounded-full p-2 z-10">
                            <TiTickOutline className="text-[#7F001D]" size={24} />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-yellow-500">01</div>
                            <h3 className="text-lg font-semibold">Book Ticket</h3>
                            <p className="text-sm">Ticket bookings made through our website or outlets are subject to availability.</p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start space-x-4 relative">
                        <div className="bg-white rounded-full p-2 z-10">
                            <FaCreditCard className="text-[#7F001D]" size={24} />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-yellow-500">02</div>
                            <h3 className="text-lg font-semibold">Payment</h3>
                            <p className="text-sm">Payment for bookings can be made securely through our website using major credit cards or other payment methods specified.</p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start space-x-4 relative">
                        <div className="bg-white rounded-full p-2 z-10">
                            <FaQrcode className="text-[#7F001D]" size={24} />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-yellow-500">03</div>
                            <h3 className="text-lg font-semibold">Get a QR Code</h3>
                            <p className="text-sm">Get a QR code from our website after successful payment process completion.</p>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex items-start space-x-4 relative">
                        <div className="bg-white rounded-full p-2 z-10">
                            <FaMapMarkerAlt className="text-[#7F001D]" size={24} />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-yellow-500">04</div>
                            <h3 className="text-lg font-semibold">Show QR Code at Agent Point</h3>
                            <p className="text-sm">Get a QR code from our website after successful payment process completion.</p>
                        </div>
                    </div>

                    {/* Step 5 */}
                    <div className="flex items-start space-x-4 relative">
                        <div className="bg-white rounded-full p-2 z-10">
                            <FaCheckCircle className="text-[#7F001D]" size={24} />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-yellow-500">05</div>
                            <h3 className="text-lg font-semibold">You are Good to Go</h3>
                            <p className="text-sm">Collect your ticket from our agent point and find your ideal ride here</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Work;
